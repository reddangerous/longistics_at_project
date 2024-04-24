import express from 'express'
import { makeStkPushRequest, stkCallBackUrl } from "../controllers/mpesa.js";
const router = express.Router();

router.route("/stk-push-request").post(makeStkPushRequest);
router.route("/stk-push/callback").post(stkCallBackUrl);

export default router;


