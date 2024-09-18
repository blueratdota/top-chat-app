import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const sendMessage = async (req, res, next) => {
  const { authorId, recipientId, content } = req.body;
  try {
    const message = await prisma.message.create({
      data: {
        authorId: authorId,
        recipientId: recipientId,
        content: content
      }
    });
    await prisma.user.update({
      where: { id: authorId },
      data: { sentMessages: { connect: message } }
    });
    await prisma.user.update({
      where: { id: recipientId },
      data: { receivedMessages: { connect: message } }
    });
    const result = {
      isSuccess: true,
      msg: "Message delivered",
      data: message
    };
    res.status(200).json(result);
  } catch (error) {
    const result = new Error("Message delivery failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

export { sendMessage };
