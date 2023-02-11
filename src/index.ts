import express, { Express, Application, Request, Response } from "express";
import * as http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.route";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { todoRoutes } from "./routes/todo.route";

const app: Express = express();
dotenv.config({});
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 8000;
if (process.env.DEBUG) {
  process.on("unhandledRejection", function (reason) {
    process.exit(1);
  });
} else {
}

//routes
app.get("/", (req: Request, res: Response) => {
  res.send("Fuck this world");
});
todoRoutes(app);
authRoutes(app);

const server: http.Server = http.createServer(app);

const io = new Server(server);

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
};

const MONGODB_URI = process.env.MONGODB_URI || "";

mongoose
  .connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
      io.on("connection", (userSocket: any) => {
        userSocket.on("send_message", (data: any) => {
          userSocket.broadcast.emit("receive_message", data);
        });
      });
      // io.on("connection", (socket: any) => {
      //   socket.on("createTodo", (data: any) => {
      //     // data will look like => {myID: "123123"}
      //     console.log("user joined room");
      //     socket.join(data.myID);
      //   });
      // });
      // routes.forEach((route: RouteConfig) => {
      //   console.log(`Routes configured for ${route.getName()}`);
      // });
    });
  })
  .catch((err) => {
    console.log(`something fucked up `, err);
  });
