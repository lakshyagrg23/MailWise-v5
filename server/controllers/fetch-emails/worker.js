import { GoogleGenerativeAI } from '@google/generative-ai';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import pool from '../../db.js';  
import { extractBody } from '../helpFunctions/extractBody.js';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Chunk helper
const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

async function fetchUserCategories(userId) {
    try {
        const query = `SELECT category_name, category_description FROM category_preferences WHERE user_id = $1;`;
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error("Error fetching user categories:", error);
        return [];
    }
}

async function processEmailWithGemini(userId, subject, body) {
    try {
        const categories = await fetchUserCategories(userId);
        const categoryList = categories.length > 0 
            ? categories.map((cat, index) => `${index + 1}. ${cat.category_name} - ${cat.category_description}`).join("\n") 
            : "Miscellaneous";

        const PROMPT = `
You are an expert email assistant. Your task is to:
1. Classify the email into one of these categories:
   ${categoryList}
2. Generate a concise summary (30-40 words) of the email.

Email Subject: ${subject}
Email Body: ${body || "No email body available."}

Return the response in the following JSON format (without Markdown or additional formatting):
{
    "category": "<CATEGORY_NAME>",
    "summary": "<SUMMARY_TEXT>"
}`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(PROMPT);
        const response = await result.response;
        const textResponse = await response.text();
        const cleanedResponse = textResponse.replace(/```json|```/g, "").trim();
        const jsonResponse = JSON.parse(cleanedResponse);

        return {
            emailCategory: jsonResponse.category || "Miscellaneous",
            summary: jsonResponse.summary || "Summary generation failed."
        };
    } catch (error) {
        console.error("Error processing email with Gemini:", error);
        return {
            emailCategory: "Miscellaneous",
            summary: "Summary generation failed."
        };
    }
}

process.on("message", async ({ messages, userId, accessToken,update }) => {
    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: authClient });
    let emails = [];

    const CHUNK_SIZE = 3; // Number of emails to process in parallel per batch
    const DELAY_BETWEEN_BATCHES = 1000; // ms delay between batches

    const chunks = chunkArray(messages, CHUNK_SIZE);

    for (const chunk of chunks) {
        const batchResults = await Promise.allSettled(chunk.map(async (message) => {
            try {
                const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });
                const attachName = msg.data.payload.parts?.[1]?.body?.attachmentId
                    ? msg.data.payload.parts[1].filename
                    : "";

                const headers = msg.data.payload.headers;
                const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
                const sender = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
                const body = extractBody(msg.data.payload);
                const receivedAt = new Date(parseInt(msg.data.internalDate)).toISOString();
                console.log(receivedAt)

                const { emailCategory, summary } = await processEmailWithGemini(userId, subject, body);

               await pool.query(
                `INSERT INTO email_metadata (user_id, email_id, subject, sender, category, attachname, emailSummary, received_date, update)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (email_id) DO UPDATE
                SET category = EXCLUDED.category,
                    update = EXCLUDED.update;`,
                [userId, message.id, subject, sender, emailCategory, attachName, summary, receivedAt, 1]
                );


                return {
                    email_id: message.id,
                    subject,
                    sender,
                    body,
                    category: emailCategory,
                    attachname: attachName,
                    emailsummary: summary,
                    received_date:receivedAt
                };
            } catch (err) {
                console.error("Error processing individual email:", err);
                return null;
            }
        }));

        const successfulEmails = batchResults
            .filter(result => result.status === 'fulfilled' && result.value !== null)
            .map(result => result.value);

        emails.push(...successfulEmails);

        await delay(DELAY_BETWEEN_BATCHES);
    }

    process.send(emails);
    process.exit(0);
});
