import express from "express";
import {
  establishConversation,
  sendPersonalMessage,
  addConversationMessage,
  getConversation
} from "../controller/messageFunctions.js";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

router.get("/conversation/:id", protect, getConversation);
router.post("/send", addConversationMessage);
router.post("/establish-conversation", protect, establishConversation);

export default router;
