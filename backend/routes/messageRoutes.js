import express from "express";
import multer from "multer";
const upload = multer({ dest: "image_uploads" });
// ENDPOINT FUNCTIONS
import {
  establishConversation,
  addConversationTextMessage,
  addConversationImageMessage,
  getConversation,
  getPrivateConversationById,
  getAllMessagesFromConversationId,
  getImageFromId
} from "../controller/messageFunctions.js";
const router = express.Router();
// MIDDLEWARE
import { protect } from "../middleware/authMiddleware.js";

router.get("/conversation/:id?", protect, getPrivateConversationById);
router.get(
  "/all-messages/:id?/:cursor?",
  protect,
  getAllMessagesFromConversationId
);
router.get("/image/:id", getImageFromId);
// SENDING MESSAGE
router.put("/send-txt", protect, addConversationTextMessage);
// SENDING IMAGE
router.put(
  "/send-img",
  protect,
  upload.single("file"),
  addConversationImageMessage
);
router.post("/establish-conversation", protect, establishConversation);

export default router;
