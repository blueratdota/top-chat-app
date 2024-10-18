import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  commentPost,
  createPost,
  getExplorePosts,
  getFriendsPosts,
  getUserPosts,
  likePost
} from "../controller/postFunctions.js";
import multer from "multer";

// ALLOW UPLOAD VIA MULTER
const upload = multer({ dest: "image_uploads" });
// INIT ROUTER
const router = express.Router();

// GET
router.get("/friends-posts", protect, getFriendsPosts);
router.get("/others-posts", protect, getExplorePosts);
router.get("/user-posts/:id", getUserPosts);
// POST
router.post("/post", protect, upload.single("file"), createPost);
// PUT
router.put("/like", protect, likePost);
router.put("/comment", protect, commentPost);

export default router;
