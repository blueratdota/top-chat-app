import jwt from "jsonwebtoken";
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  try {
    let token;
    token = req.cookies.jwt;
    if (token) {
      try {
        console.log("TOKEN VERIFIED");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userQuery = await prisma.user.findUnique({
          where: { name: decoded.userId }
        });
        req.user = await userQuery;
        console.log("success req.user = query");
        next();
      } catch (error) {
        console.log(req.user);
        const err = new Error("Not authorized, INVALID token");
        err.status = 401;
        return next(err);
      }
    } else {
      const error = new Error("Not authorized, no token");
      error.status = 401;
      return next(error);
    }
  } catch (error) {}
};

export { protect };

// modify this to use prisma
