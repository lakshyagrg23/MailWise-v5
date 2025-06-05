import { Router } from "express"
import { restEmail } from "../controllers/emails/restEmail.js";
const router=Router();

router.put("/fetch_rest/:userId",restEmail);


export default router;