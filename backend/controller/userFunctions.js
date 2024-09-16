import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { genToken } from "../utils/generateToken.js";
const prisma = new PrismaClient();

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
      genToken(res, user.email);
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

export { userSignup, userLogin };
