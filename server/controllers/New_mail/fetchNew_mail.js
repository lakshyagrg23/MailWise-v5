import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

export const fetchMail = async (req, res) => {
    console.log("Gmail Webhook Received");
    console.log(req.body);

    const { message } = req.body;

    if (!message || !message.data) {
        console.log("No message data found");
        return res.status(400).send("Invalid webhook payload");
    }
};
