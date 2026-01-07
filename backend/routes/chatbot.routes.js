import express from "express";
import { chatbotQuery } from "../controllers/chatbot.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/query", authenticate, chatbotQuery);

export default router;
