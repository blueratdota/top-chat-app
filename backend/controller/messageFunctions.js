import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// WHEN TRYING TO CHAT WITH SOMEONE
// YOU CREATE A CONVERSATION BETWEEN TWO USERS
// EMPTY CONVERSATION AT START

const establishConversation = async (req, res, next) => {
  const { authorId, recipientId, content } = req.body;
  try {
    const conversation = await prisma.conversation.create({
      data: { type: "PRIVATE" }
    });
    const membersId = [authorId, recipientId];
    for (const member of membersId) {
      const memberData = await prisma.user.findUnique({
        where: { id: member },
        select: { id: true, Profile: true, email: true }
      });

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { members: { connect: memberData } }
      });
    }
    const result = {
      isSuccess: true,
      msg: "Conversation established",
      data: conversation
    };
    res.status(200).json(result);
  } catch (error) {
    const result = new Error("Conversation not established");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

const addConversationMessage = async (req, res, next) => {
  const { conversationId, content, authorId } = req.body;
  const convservation = await prisma.conversation.findUnique({
    where: { id: conversationId }
  });
  try {
    const message = await prisma.message.create({
      data: {
        authorId: authorId,
        content: content
        // conversationId: conversationId
      }
    });
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { messages: { connect: message } }
    });
    const result = {
      isSuccess: true,
      msg: "Message sent",
      data: message
    };
    res.status(200).json(result);
  } catch (error) {
    const result = new Error("Message not sent");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

const sendPersonalMessage = async (req, res, next) => {
  // WHEN SENDING A MESSAGE
  // IF CONVERSATION BETWEEN USERS EXISTS ALREADY, UPDATE THE CONVERSATION
  // ELSE CREATE A CONVERSATION MODEL FIRST
  // CONNECT USERS TO CONVERSATION
  // CONNECT MESSAGE TO CONVERSATION
  // const { authorId, recipientId, content } = req.body;
  // try {
  //   const message = await prisma.message.create({
  //     data: {
  //       authorId: authorId,
  //       content: content
  //     }
  //   });
  //   const conversationExists = await prisma.conversation.findFirst({
  //     where: { members: { in: [authorId, recipientId] } }
  //   });
  //   await prisma.user.update({
  //     where: { id: authorId },
  //     data: { sentMessages: { connect: message } }
  //   });
  //   await prisma.user.update({
  //     where: { id: recipientId },
  //     data: { receivedMessages: { connect: message } }
  //   });
  //   const result = {
  //     isSuccess: true,
  //     msg: "Message delivered",
  //     data: message
  //   };
  //   res.status(200).json(result);
  // } catch (error) {
  //   const result = new Error("Message delivery failed");
  //   result.status = 400;
  //   result.log = error;
  //   next(result);
  // }
};

export { sendPersonalMessage, establishConversation, addConversationMessage };
