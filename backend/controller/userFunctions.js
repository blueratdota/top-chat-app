import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { genToken } from "../utils/generateToken.js";
const prisma = new PrismaClient();

// #### GET USER PROFILE, ALL FRIENDS, CONVERSATIONS, ETC... ####
const getUserData = async (req, res, next) => {
  const { id } = req.user;
  console.log(req.user);
  try {
    const userData = await prisma.user.findUnique({
      where: { id: id },
      include: {
        profile: true,
        receivedFriendRequests: true,
        sentFriendRequests: true,
        sentMessages: true,
        conversations: { include: { members: true, messages: true } }
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

const getUserFriends = async (req, res, next) => {
  const { id } = req.user;
  try {
    const userData = await prisma.user.findUnique({
      where: { id: id },
      select: {
        friends: true
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

const getUserConversations = async (req, res, next) => {
  const { id } = req.user;
  try {
    const userData = await prisma.user.findUnique({
      where: { id: id },
      select: {
        conversations: {
          include: {
            members: {
              where: { id: { not: id } },
              select: {
                id: true,
                email: true,
                profile: {
                  select: { firstName: true, lastName: true }
                }
              }
            },
            messages: { orderBy: { dateSent: "desc" }, take: 1 }
          },
          orderBy: { dateUpdated: "desc" }
        }
      }
    });
    const result = {
      isSuccess: true,
      msg: "User conversations data downloaded",
      data: userData,
      userId: id
    };
    res.status(200).json(result);
  } catch (error) {
    const result = new Error("User conversations data download failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

// #### USER CREATION, USER LOGIN/LOGOUT ####
const userSignup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email: email, password: hashedPassword }
      });

      await prisma.profile.create({
        data: { userId: user.id }
      });

      const result = { isSuccess: true, msg: "User created", data: user };

      res.status(200).json(result);
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
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

const userLogout = async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ message: `User: logged-out` });
};

// #### USER ADD FRIEND, ACCEPT FRIEND, REMOVE FRIEND, BLOCK FRIEND ####

const userAddFriend = async (req, res, next) => {
  const { friendId } = req.body;
  try {
    const friendship = await prisma.friendship.create({
      data: { requestingUserId: req.user.id, acceptingUserrId: friendId }
    });
    const result = {
      isSuccess: true,
      msg: "Friendship requested",
      data: friendship
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    const result = new Error("Friend request failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

const userAcceptFriend = async (req, res, next) => {
  const { friendRequestId } = req.body;
  try {
    const friendship = await prisma.friendship.update({
      where: { id: friendRequestId },
      data: { accepted: true }
    });
    const result = {
      isSuccess: true,
      msg: "Friend request accepted",
      data: friendship
    };
    res.status(200).json(result);
  } catch (error) {
    const result = new Error("Friend request handling fatal error");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

// #### GET,UPDATE USER PROFILE ####

const getUserProfile = async (req, res, next) => {
  console.log(req.user);
  try {
    const { id } = req.user;
    const userData = await prisma.user.findUnique({
      where: { id: id },
      select: {
        profile: { include: { user: { select: { email: true } } } }
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
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    const result = new Error("Profile update failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

const getUserProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = await prisma.user.findUnique({
      where: { id: id },
      select: {
        profile: { include: { user: { select: { email: true } } } }
      }
    });
    console.log(userData);

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

export {
  getUserData,
  getUserProfile,
  getUserProfileById,
  getUserFriends,
  getUserConversations,
  userSignup,
  userLogin,
  userLogout,
  userAddFriend,
  userAcceptFriend,
  userUpdateProfile
};

// FOR SHOWING PROFILE ON FRIEND REQUEST
// CREATE A GET PROFILE API BASED ON USER ID
// PROFILE SHOULD SHOW COMPLETE NAME AND PROFILE PICTURE IF IMPLEMENTED
