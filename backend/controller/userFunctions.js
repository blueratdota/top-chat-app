import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { genToken } from "../utils/generateToken.js";
const prisma = new PrismaClient();

// #### GET USER PROFILE, ALL FRIENDS, CONVERSATIONS, ETC... ####
const getUserData = async (req, res, next) => {
  const { id } = req.user;
  // console.log(req.user);
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

const getFriendshipStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.id;
    const receiver = await prisma.friendship.findFirst({
      where: { acceptingUserId: userId, requestingUserId: friendId }
    });
    const sender = await prisma.friendship.findFirst({
      where: { requestingUserId: userId, acceptingUserId: friendId }
    });
    let btnAction = "";
    let friendshipId = null;
    if (receiver) {
      if (receiver.accepted) {
        btnAction = "Friends";
      } else {
        btnAction = "Confirm request";
        friendshipId = receiver.id;
      }
    }
    if (sender) {
      if (sender.accepted) {
        btnAction = "Friends";
      } else {
        btnAction = "Cancel request";
        friendshipId = sender.id;
      }
    }
    if (!sender && !receiver) {
      btnAction = "Add friend";
    }
    const result = {
      isSuccess: true,
      msg: "Friendship status checked",
      btnAction: btnAction,
      friendshipId: friendshipId
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    const result = new Error("Friendship status check failed");
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
                  select: {
                    firstName: true,
                    lastName: true,
                    displayPhoto: true
                  }
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

const getUserPosts = async (req, res, next) => {
  const id = req.params.id;
  try {
    const userData = await prisma.user.findUnique({
      where: { id: id },
      select: {
        posts: {
          include: {
            comments: {
              select: { author: { select: { profile: true, email: true } } }
            },
            likedByUsers: {
              select: { email: true, profile: true }
            },
            author: { select: { profile: true, email: true } }
          },
          orderBy: { datePosted: "desc" }
        }
      }
    });
    const result = {
      isSuccess: true,
      msg: "Post downloaded",
      data: userData,
      userId: id
    };
    res.status(200).json(result);
  } catch (error) {
    const result = new Error("User post data download failed");
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

      const newProfile = await prisma.profile.create({
        data: { userId: user.id }
      });

      const newGeneralInfo = await prisma.generalInfo.create({
        data: { profileId: newProfile.id }
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
      const user = await prisma.user.findUnique({
        where: { email: email },
        include: { profile: { include: { user: { select: { email: true } } } } }
      });
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
      data: { requestingUserId: req.user.id, acceptingUserId: friendId }
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

const userDeleteFriendRequest = async (req, res, next) => {
  const { friendRequestId } = req.body;
  try {
    const friendship = await prisma.friendship.delete({
      where: { id: friendRequestId }
    });

    const result = {
      isSuccess: true,
      msg: "Friendship cancelled"
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
  // console.log(req.user);
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

const updateUserGeneralInfo = async (req, res, next) => {
  try {
    const generalInfo = req.body;
    const { id } = req.params;

    const newProfile = await prisma.generalInfo.update({
      where: { id: id },
      data: { ...generalInfo }
    });

    const result = {
      isSuccess: true,
      msg: "Profile updated",
      data: newProfile
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    const result = new Error("Profile update failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

const updateUserDisplayPhoto = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // console.log(req.file);
    const fileData = {
      path: req.file.path,
      name: req.file.originalname,
      filename: req.file.filename,
      fileSize: req.file.size,
      authorId: req.user.id
    };
    await prisma.profile.update({
      where: { userId: userId },
      data: { displayPhoto: fileData.filename }
    });
    const result = {
      isSuccess: true,
      msg: "Display Photo Updated"
    };
    res.status(200).json(fileData);
  } catch (error) {
    console.log(error);
    const result = new Error("Display Photo Update Failed");
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
        profile: {
          include: { user: { select: { email: true } }, generalInfo: true }
        }
      }
    });
    // console.log(userData);

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

const createPost = async (req, res, next) => {
  try {
    const { textContent } = req.body;
    const fileData = (() => {
      if (req.file) {
        return {
          path: req.file.path,
          name: req.file.originalname,
          filename: req.file.filename,
          fileSize: req.file.size,
          authorId: req.user.id
        };
      } else return null;
    })();
    const post = await prisma.posts.create({
      data: {
        authorId: req.user.id,
        textContent: textContent,
        imageContent: fileData?.filename
      }
    });
    const result = {
      isSuccess: true,
      msg: "Post created",
      data: post
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    const result = new Error("Failed to create post");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

const likePost = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const user = await prisma.user.findFirst({
      where: { id: req.user.id },
      select: { likedPosts: true }
    });
    console.log(user.likedPosts);

    if (
      user.likedPosts.some((post) => {
        return post.id == postId;
      })
    ) {
      const post = await prisma.user.update({
        where: { id: req.user.id },
        data: { likedPosts: { disconnect: { id: postId } } },
        select: { likedPosts: true }
      });
      const result = {
        isSuccess: true,
        msg: "Post disliked",
        data: post
      };
      res.status(200).json(result);
    } else {
      const post = await prisma.user.update({
        where: { id: req.user.id },
        data: { likedPosts: { connect: { id: postId } } },
        select: { likedPosts: true }
      });
      const result = {
        isSuccess: true,
        msg: "Post liked",
        data: post
      };
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    const result = new Error("Failed to like post");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

export {
  getUserData,
  getUserPosts,
  getUserProfile,
  getUserProfileById,
  getUserFriends,
  getFriendshipStatus,
  getUserConversations,
  createPost,
  likePost,
  userSignup,
  userLogin,
  userLogout,
  userAddFriend,
  userAcceptFriend,
  userUpdateProfile,
  userDeleteFriendRequest,
  updateUserGeneralInfo,
  updateUserDisplayPhoto
};

// FOR SHOWING PROFILE ON FRIEND REQUEST
// CREATE A GET PROFILE API BASED ON USER ID
// PROFILE SHOULD SHOW COMPLETE NAME AND PROFILE PICTURE IF IMPLEMENTED
