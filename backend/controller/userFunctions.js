import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { genToken } from "../utils/generateToken.js";
const prisma = new PrismaClient();

const getUserData = async (req, res, next) => {
  const { id } = req.user;
  console.log(req.user);
  try {
    const userData = await prisma.user.findUnique({
      where: { id: id },
      include: {
        Profile: true,
        friends: true,
        friendsOf: true,
        sentMessages: true,
        conversation: { include: { members: true, messages: true } }
      }
    });
    const result = {
      isSuccess: true,
      msg: "User data downloaded successfuly",
      data: userData
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    const result = new Error("User data download failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};
const getUserProfile = async (req, res, next) => {
  console.log(req.user);

  const { id } = req.user;
  try {
    const userData = await prisma.user.findUnique({
      where: { id: id },
      select: {
        profile: true
      }
    });
    const result = {
      isSuccess: true,
      msg: "User profile data downloaded",
      data: userData
    };
    res.status(200).json(result);
  } catch (error) {
    const result = new Error("User profile data download failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};
const getUserFriends = async (req, res, next) => {
  const { id } = req.user;
  try {
    const userData = await prisma.user.findUnique({
      where: { id: id },
      select: {
        friends: true,
        friendsOf: true
      }
    });
    const result = {
      isSuccess: true,
      msg: "User friends data downloaded",
      data: userData
    };
    res.status(200).json(result);
  } catch (error) {
    const result = new Error("User friends data download failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

// CREATE A GET ALL FRIEND DATA

const userSignup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email: email, password: hashedPassword }
      });
      const result = { isSuccess: true, msg: "User created", data: user };

      res.status(200).json(result);
    } else {
      throw new Error();
    }
  } catch (error) {
    const result = new Error("User creation failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const user = await prisma.user.findUnique({ where: { email: email } });
      if (!user) {
        const error = new Error("User does not exist");
        error.status = 401;
        return next(error);
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        const error = new Error("Password is incorrect");
        error.status = 401;
        return next(error);
      }
      genToken(res, user.id);
      console.log(`###### Login posted by email: ${user.email}`);

      const result = { isSuccess: true, msg: "User logged in", data: user };
      res.status(200).json(result);
    } else {
      throw new Error();
    }
  } catch (error) {
    const result = new Error("User login failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

const userAddFriend = async (req, res, next) => {
  const { userId, friendId } = req.body;
  try {
    const friendRequest = await prisma.friends.create({
      data: { requestingUserId: userId, acceptingUserId: friendId }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { friends: { connect: friendRequest } }
    });
    await prisma.user.update({
      where: { id: friendId },
      data: { friendsOf: { connect: friendRequest } }
    });

    const result = {
      isSuccess: true,
      msg: "Friend request sent",
      data: friendRequest
    };
    res.status(200).json(result);
  } catch (error) {
    const result = new Error("Friend request failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

const userAcceptFriend = async (req, res, next) => {
  const { id, requestingUserId, acceptingUserId } = req.body;
  try {
    if (acceptingUserId == req.user.id) {
      const friendRequest = await prisma.friends.update({
        where: { id: id },
        data: { accepted: true }
      });
      const result = {
        isSuccess: true,
        msg: "Friend request accepted",
        data: friendRequest
      };
      res.status(200).json(result);
    } else {
      throw new Error("Error in accepting friend request");
    }
  } catch (error) {
    const result = new Error("Friend request handling fatal error");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

const userUpdateProfile = async (req, res, next) => {
  const { firstName, lastName, bio } = req.body;
  const userBio = bio ? bio : "";
  try {
    // CHECK IF USER ALREADY HAS PROFILE
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true }
    });
    if (user.profile) {
      // HAS AN EXISTING PROFILE
      // UPDATE PROFILE
      const profile = await prisma.profile.update({
        where: { id: user.profile.id },
        data: {
          firstName: firstName,
          lastName: lastName,
          bio: userBio
        }
      });
      const result = {
        isSuccess: true,
        msg: "Profile updated",
        data: profile
      };
      res.status(200).json(result);
    } else {
      // HAS NO EXISTING PROFILE
      // CREATE A NEW PROFILE AND CONNECT IT TO USER
      const profile = await prisma.profile.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          bio: userBio,
          userId: req.user.id
        }
      });
      const result = {
        isSuccess: true,
        msg: "Profile created",
        data: profile
      };
    }
  } catch (error) {
    console.log(error);
    const result = new Error("Profile update failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

export {
  getUserData,
  getUserProfile,
  getUserFriends,
  userSignup,
  userLogin,
  userAddFriend,
  userAcceptFriend,
  userUpdateProfile
};

// FOR SHOWING PROFILE ON FRIEND REQUEST
// CREATE A GET PROFILE API BASED ON USER ID
// PROFILE SHOULD SHOW COMPLETE NAME AND PROFILE PICTURE IF IMPLEMENTED
