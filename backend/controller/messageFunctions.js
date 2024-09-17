import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const sendMessage = async (req, res, next) => {
  const { author, receiver, content } = req.body;
};

export { sendMessage };
