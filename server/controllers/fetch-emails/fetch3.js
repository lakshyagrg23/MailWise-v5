import { extractBody } from "../helpFunctions/extractBody.js";
import { google } from "googleapis";
import pool from "../../db.js"; // Assuming you have a database connection
import fs from "fs";
import path from "path";

export const fetch3 = async (req, res) => {
    console.log("Fetching email for user:", req.params);
    
    const { userId } = req.params;
    const accessToken = req.headers.authorization?.split(" ")[1] || req.query.access_token;
    
    console.log("Access Token:", accessToken);
    
    if (!userId || !accessToken) {
        return res.status(400).json({ error: "Missing userId or access_token" });
    }

    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: "v1", auth: authClient });

    try {
        // Fetch the email
        const msg = await gmail.users.messages.get({ userId: "me", id: userId });
        console.log(msg.data.payload.headers)

        if (!msg.data) {
            return res.status(404).json({ error: "Email not found" });
        }

        const headers = msg.data.payload.headers;
        const subject = headers.find((h) => h.name === "Subject")?.value || "No Subject";
        const sender = headers.find((h) => h.name === "From")?.value || "Unknown Sender";
        const body = extractBody(msg.data.payload);
        const receivedAt = new Date(parseInt(msg.data.internalDate)).toISOString();

        let attachments = [];

        // ✅ Ensure the email has parts before accessing them
        if (msg.data.payload.parts) {
            for (let part of msg.data.payload.parts) {
                if (part.filename && part.body?.attachmentId) {
                    const attachId = part.body.attachmentId;

                    try {
                        // Fetch the attachment
                        const attachmentResponse = await gmail.users.messages.attachments.get({
                            userId: "me",
                            messageId: userId,
                            id: attachId,
                        });

                        if (!attachmentResponse.data || !attachmentResponse.data.data) {
                            console.error("Failed to fetch attachment:", part.filename);
                            continue; // Skip this attachment if it's not retrieved properly
                        }
                        
                        const base64Data = attachmentResponse.data.data
                    .replace(/-/g, "+")
                    .replace(/_/g, "/");
                        
                        attachments.push({
                            filename: part.filename,
                            mimeType: part.mimeType,
                            data: base64Data, // Base64 encoded
                        });

                        console.log(`Saved attachment: ${filePath}`);
                    } catch (attachmentError) {
                        console.error(`Error fetching attachment (${part.filename}):`, attachmentError);
                    }
                }
            }
        }

        // Send response
        res.json({
            email: {
                _id: userId,
                userId,
                subject,
                sender,
                body,
                received_at: receivedAt,
                attachments, // Include attachments
            },
        });
    } catch (error) {
        console.error(`Error fetching email ${userId}:`, error);
        res.status(500).json({ error: "Failed to fetch email", details: error.message });
    }
};
