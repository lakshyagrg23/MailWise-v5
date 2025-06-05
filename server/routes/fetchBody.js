import { Router } from "express"
import { fetch3 } from "../controllers/fetch-emails/fetch3.js";
import { aiEmail } from "../controllers/fetch-emails/aiEmail.js";
const router=Router();

router.get("/email",aiEmail)
router.get("/:userId",fetch3) //fetch body

export default router;