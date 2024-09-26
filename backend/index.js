import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
// IMPORT ROUTES
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { establishConversation } from "./controller/messageFunctions.js";

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Change to your frontend's URL
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
};
const port = process.env.PORT || 3001;
// since not using cmjs - use this
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(`### pathname is: ${__dirname}`);

// body parser middleware
// must be before other
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));
// api endpoints
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// use error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`### server is running on port: ${port}`);
});

export { __dirname };
