import express from "express";
import {
  establishConversation,
  sendPersonalMessage,
  addConversationMessage
} from "../controller/messageFunctions.js";
const router = express.Router();

router.post("/send", addConversationMessage);
router.post("/establish-conversation", establishConversation);

export default router;
