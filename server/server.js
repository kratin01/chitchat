import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectToMongoDB from "./db/connectToMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";
dotenv.config();

// const app = express();
const __dirname = path.resolve();//it gives the absolute path of the current directory

const PORT = process.env.PORT || 3000;

app.use(express.json()); //this will allow us to extract the body of the request
app.use(cookieParser()); //this will allow us to extract the cookies from the request



app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname,"/client/dist")))//this a middle ware that will serve the static files from the client folder

app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"client","dist","index.html"))//this will send the index.html file to the client
})
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
