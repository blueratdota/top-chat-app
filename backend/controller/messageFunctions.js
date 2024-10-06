import { PrismaClient } from "@prisma/client";
import path from "path";
import { __dirname } from "../index.js";
const prisma = new PrismaClient();

// WAYS TO START A PRIVATE CONVERSATION
// 1 - GO TO THEIR PROFILE, CLICK SEND MESSAGE
// CHECK FOR EXISTING CONVERSATION BETWEEN TWO USERS
// LOOK FOR A CONVERSATION THAT IS "TYPE:PRIVATE"
// AND MEMBERS = [USER,OTHERUSER]
// IF NO EXISTING CONVERSATION, CREATE CONVERSATION

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

// GET - DOWNLOAD EXISTING CONVERSATION BETWEEN GIVEN USER
const getConversation = async (req, res, next) => {
  try {
    const memberId = [req.user.id, req.params.id];
    const conversation = await prisma.conversation.findFirst({
      where: { type: "PRIVATE", members: { every: { id: { in: memberId } } } },
      include: { messages: true }
    });
    const result = {
      isSuccess: true,
      msg: "Conversation query successful",
      data: conversation
    };
    // WILL RETURN DATA
    // DATA {"ISSUCCESS":TRUE, "DATA":NULL} => IF NO EXISTING CONVERSATION BETWEEN USERS
    res.status(200).json(result);
  } catch (error) {
    const result = new Error("Conversation query failed");
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

// GET - DOWNLOAD EXISTING CONVERSATION VIA ID
const getPrivateConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const conversation = await prisma.conversation.findFirst({
      where: { type: "PRIVATE", id: id, members: { some: { id: userId } } },
      include: {
        messages: true,
        members: {
          where: { id: { not: userId } },
          select: { profile: true, email: true }
        }
      }
    });
    const result = {
      isSuccess: true,
      msg: "Conversation downloaded",
      data: conversation
    };
    res.status(200).json(result);
  } catch (error) {
    const result = new Error("Conversation download failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};
// GET - DOWNLOAD EXISTING CONVERSATION MESSAGES VIA ID
const getAllMessagesFromConversationId = async (req, res, next) => {
  try {
    const { id, cursor } = req.params;
    console.log(cursor);
    const userId = req.user.id;
    const messages = await prisma.conversation.findUnique({
      where: { type: "PRIVATE", id: id, members: { some: { id: userId } } },
      select: {
        messages: true
      }
    });
    res.status(200).json(messages.messages);
  } catch (error) {
    console.log(error);
    const result = new Error("Conversation download failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};
// GET - DOWNLOAD IMAGE FROM A CONVERSATION
const getImageFromId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const imagePath = path.join(__dirname, "image_uploads", id);
    res.sendFile(imagePath);
  } catch (error) {
    console.log(error);
    const result = new Error("Image download failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

const addConversationTextMessage = async (req, res, next) => {
  try {
    const { conversationId, content } = req.body;
    const conversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        messages: { create: { authorId: req.user.id, content: content } },
        dateUpdated: new Date()
      }
    });

    const result = {
      isSuccess: true,
      msg: "Message sent",
      data: conversation
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    const result = new Error("Message not sent");
    result.status = 400;
    result.log = error;
    next(result);
  }
};
const addConversationImageMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.body;
    // console.log(req.file);
    const fileData = {
      path: req.file.path,
      name: req.file.originalname,
      filename: req.file.filename,
      fileSize: req.file.size,
      authorId: req.user.id
    };
    // {
    //   path: 'image_uploads/416a26b3cf994d74e3d8ca6faaa064ed',
    //   name: 'youtube-svgrepo-com.svg',
    //   fileSize: 761,
    //   authorId: '32da8644-3221-4ef0-a54c-537dd1a2aa98'
    // }
    const conversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        messages: {
          create: {
            authorId: req.user.id,
            content: fileData.filename,
            isImage: true
          }
        },
        dateUpdated: new Date()
      }
    });

    const result = {
      isSuccess: true,
      msg: "Message sent",
      data: conversation
    };
    res.status(200).json(fileData);
  } catch (error) {
    console.log(error);
    const result = new Error("Message not sent");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

export {
  establishConversation,
  addConversationTextMessage,
  addConversationImageMessage,
  getConversation,
  getPrivateConversationById,
  getAllMessagesFromConversationId,
  getImageFromId
};
