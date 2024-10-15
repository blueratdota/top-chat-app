import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  commentPost,
  createPost,
  getFriendshipStatus,
  getUserConversations,
  getUserData,
  getUserFriends,
  getUserPosts,
  getUserProfile,
  getUserProfileById,
  likePost,
  updateUserDisplayPhoto,
  updateUserGeneralInfo,
  userAcceptFriend,
  userAddFriend,
  userDeleteFriendRequest,
  userLogin,
  userLogout,
  userSignup,
  userUpdateProfile
} from "../controller/userFunctions.js";
import multer from "multer";
const upload = multer({ dest: "image_uploads" });
const router = express.Router();

// GET ALL USER DATA
router.get("/userdata", protect, getUserData);
// GET SPECIFIC USER DATA
router.get("/profile", protect, getUserProfile);
router.get("/friend-status/:id", protect, getFriendshipStatus);
router.get("/posts/:id", getUserPosts);
// router.get("/friends", protect, getUserFriends);
router.get("/conversations", protect, getUserConversations);
router.get("/:id", getUserProfileById);
// POST
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/add-friend", protect, userAddFriend);
router.post("/logout", userLogout);
router.post("/post", protect, upload.single("file"), createPost);
// PUT
router.put("/like", protect, likePost);
router.put("/comment", protect, commentPost);
router.put("/accept-friend", protect, userAcceptFriend);
router.put("/profile", protect, userUpdateProfile);
router.put("/intro/:id", protect, updateUserGeneralInfo);
router.put(
  "/display-photo",
  protect,
  upload.single("file"),
  updateUserDisplayPhoto
);
// DELETE
router.delete("/friendship", userDeleteFriendRequest);

export default router;
