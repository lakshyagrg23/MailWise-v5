import axios from 'axios';
import pool from '../../db.js';  // Ensure correct path to db.js
import globalStore from '../helpFunctions/global.js';

const defaultCategories = [
    { name: "Essential", description: "Important career, academic, or life updates such as job offers, exam schedules, etc." },
    { name: "Social", description: "Personal communications and social media notifications." },
    { name: "Promotions", description: "Marketing, sales, and product launch announcements." },
    { name: "Updates", description: "Order status, service updates, or time-sensitive event notifications." },
    { name: "Finance", description: "Banking, billing, investment updates." },
    { name: "Subscriptions", description: "Regular newsletters, content updates from subscribed services." },
    { name: "Miscellaneous", description: "Everything else." }
];

export const callback = (oauth2Client) => async (req, res) => {
    try {
        const { code } = req.query;
        console.log("Received OAuth code:", code); // Debugging log

        const { tokens } = await oauth2Client.getToken(code);
        console.log("Received OAuth tokens:", tokens); // Debugging log

        oauth2Client.setCredentials(tokens);
        const accessToken = tokens.access_token;
        globalStore.accessToken=accessToken;
        globalStore.oauth2Client=oauth2Client;
        // Fetch user details using the access token
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        console.log("User Info Response:", userInfoResponse.data); // Debugging log

        const userEmail = userInfoResponse.data.email;
        const userName = userInfoResponse.data.name;
        const userpic = userInfoResponse.data.picture;

        // Check if the user exists in the database
        const userCheckQuery = `SELECT id,update FROM users WHERE email = $1`;
        const userCheckResult = await pool.query(userCheckQuery, [userEmail]);
        console.log(userCheckResult)
        let userId,update;
        if (userCheckResult.rows.length === 0) {
            // User doesn't exist, insert them into the database
            const userInsertQuery = `INSERT INTO users (google_id, name, email, profile_pic_url,update)
                                     VALUES ($1, $2, $3, $4,$5)
                                     RETURNING id,update;`;
            const userResult = await pool.query(userInsertQuery, [userInfoResponse.data.id, userName, userEmail, userpic,1]);
            userId = userResult.rows[0].id;
            update=1;
            console.log("New user authenticated with ID:", userId);

            // Insert default categories for the new user
            await insertDefaultCategories(userId);
        } else {
            // User already exists, just get their ID
            userId = userCheckResult.rows[0].id;
            update=userCheckResult.rows[0].update
            console.log("Existing user authenticated with ID:", userId);
        }

        // Redirect with access token, user ID, and name
        res.redirect(`${process.env.FRONTEND_URL}/emails/inbox?access_token=${accessToken}&user_id=${userId}&name=${encodeURIComponent(userName)}&update=${update}`);
    } catch (error) {
        console.error("Error during OAuth callback:", error);
        res.status(500).send("Authentication failed");
    }
};

// Ensure insertDefaultCategories is defined somewhere
async function insertDefaultCategories(userId) {
    try {
        for (const category of defaultCategories) {
            await pool.query(
                `INSERT INTO category_preferences (user_id, category_name, category_description) 
                 VALUES ($1, $2, $3) 
                 ON CONFLICT (user_id, category_name) DO NOTHING;`, 
                [userId, category.name, category.description]
            );
        }
        console.log(`Default categories inserted for user ${userId}`);
    } catch (error) {
        console.error("Error inserting default categories:", error);
    }
}
