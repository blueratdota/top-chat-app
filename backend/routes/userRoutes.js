import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { genToken } from "../utils/generateToken.js";
import { protect } from "../middleware/authMiddleware.js";
import { userLogin, userSignup } from "../controller/userFunctions.js";
const router = express.Router();
const prisma = new PrismaClient();

router.post("/signup", userSignup);
router.post("/login", userLogin);

export default router;
