import express from 'express'
const router = express.Router()
import sendToChatGPT from "../controllers/chatgptService";

router.post('/chat', async (req, res) => {
    const { userInput } = req.body;
    const response = await sendToChatGPT(userInput);
    res.json({ response });
}
);
