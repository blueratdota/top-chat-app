import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// WAYS TO START A PRIVATE CONVERSATION
// 1 - GO TO THEIR PROFILE, CLICK SEND MESSAGE
// CHECK FOR EXISTING CONVERSATION BETWEEN TWO USERS
// LOOK FOR A CONVERSATION THAT IS "TYPE:PRIVATE"
// AND MEMBERS = [USER,OTHERUSER]
// IF NO EXISTING CONVERSATION, CREATE CONVERSATION
//

// POST - CREATE CONVERSATION
const establishConversation = async (req, res, next) => {
  const { recipientId } = req.body;
  try {
    const conversation = await prisma.conversation.create({
      data: {
        type: "PRIVATE",
        members: { connect: [{ id: req.user.id }, { id: recipientId }] }
      }
    });
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

const getConversation = async (req, res, next) => {
  const memberId = [
    "ce6ce699-b3a2-4991-ba40-6354451ab362",
    "63af2f19-d9d0-45f4-86bb-da6c9e70d128"
  ];
  try {
    const conversation = await prisma.conversation.findFirst({
      where: { type: "PRIVATE", members: { every: { id: { in: memberId } } } },
      include: { messages: true }
    });
    const result = {
      isSuccess: true,
      msg: "Conversation downloaded",
      data: conversation
    };
    // WILL RETURN DATA
    // DATA {"ISSUCCESS":TRUE, "DATA":NULL} => IF NO EXISTING CONVERSATION BETWEEN USERS
    res.status(200).json(result);
  } catch (error) {
    const result = new Error("Conversation download failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
  // "id": "7b11051e-c0db-484f-9647-90809ae80e11",
  //       "dateUpdated": "2024-09-19T21:03:02.841Z",
  //       "type": "PRIVATE",
  //       "members": [
  //           {
  //               "id": "ce6ce699-b3a2-4991-ba40-6354451ab362",
  //               "email": "john@gmail.com",
  //               "password": "$2a$10$SriBDS1u.43Idk0HORDwFOyUdfkK2QHNHfU2Ae2OIMSBFPaHZvu82",
  //               "dateCreated": "2024-09-18T13:30:14.914Z",
  //               "dateUpdated": "2024-09-19T21:03:02.841Z",
  //               "conversationId": "7b11051e-c0db-484f-9647-90809ae80e11"
  //           },
  //           {
  //               "id": "63af2f19-d9d0-45f4-86bb-da6c9e70d128",
  //               "email": "bianca@gmail.com",
  //               "password": "$2a$10$92OWubV9Mnx8/FSvciT1Y.QUcv2IOLsxlx1/T1mG9F1etIahkHz/u",
  //               "dateCreated": "2024-09-18T13:30:25.624Z",
  //               "dateUpdated": "2024-09-19T21:03:02.841Z",
  //               "conversationId": "7b11051e-c0db-484f-9647-90809ae80e11"
  //           }
  //       ]
  //   }
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

export {
  sendPersonalMessage,
  establishConversation,
  addConversationMessage,
  getConversation
};
