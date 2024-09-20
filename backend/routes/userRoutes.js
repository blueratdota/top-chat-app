import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserData,
  getUserFriends,
  getUserProfile,
  userAcceptFriend,
  userAddFriend,
  userLogin,
  userSignup,
  userUpdateProfile
} from "../controller/userFunctions.js";
const router = express.Router();

// GET ALL USER DATA
router.get("/userdata", protect, getUserData);
// GET SPECIFIC USER DATA
router.get("/profile", protect, getUserProfile);
router.get("/friends", protect, getUserFriends);
// POST
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/add-friend", protect, userAddFriend);
// PUT
router.put("/accept-friend", protect, userAcceptFriend);
router.put("/profile", protect, userUpdateProfile);

export default router;
