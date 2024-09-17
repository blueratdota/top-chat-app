import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { genToken } from "../utils/generateToken.js";
const prisma = new PrismaClient();

const getUserData = async (req, res, next) => {
  const { id } = req.user;
  console.log(req.user);
  const userData = await prisma.user.findUnique({
    where: { id: id },
    include: {
      Friends: true
    }
  });
  const result = {
    isSuccess: true,
    msg: "Friend request sent",
    data: userData
  };
  res.status(200).json(result);
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

      // ONCE ACCOUNT CREATED, CREATE THE FOLLOWING TABLE ENTRIES
      // FRIENDS -- LIST OF USER'S FRIENDS -- START EMPTY
      // FRIENDS -- SENT FRIEND REQUESTS
      // FRIENDS -- RECEIVED FRIEND REQUESTS

      // DEFAULT PROFILE
      // EMPTY BIO, FIRST NAME, LAST NAME

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
      data: { userId: friendId }
    });
    await prisma.user.update({
      where: { id: userId },
      data: { Friends: { connect: friendRequest } }
    });
    const result = {
      isSuccess: true,
      msg: "Friend request sent",
      data: friendRequest
    };
    res.status(200).json(result);
  } catch (error) {}
};

export { getUserData, userSignup, userLogin, userAddFriend };
