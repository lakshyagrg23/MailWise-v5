import { Router } from "express"
import { fetchMail } from "../controllers/New_mail/fetchNew_mail.js";
const router=Router();

router.post("/gmail",fetchMail)


export default router;