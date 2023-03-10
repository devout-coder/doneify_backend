import express, { Express, Application, Request, Response } from "express";
import * as http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.route";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { todoRoutes } from "./routes/todo.route";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "./services/jwt";
import todoController from "./controllers/todo.controller";

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

export const io = new Server(server);

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
};

const MONGODB_URI = process.env.MONGODB_URI || "";

mongoose
  .set("strictQuery", true)
  .connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);

      io.use((socket, next) => {
        const token = socket.handshake.auth.auth_token;
        console.log("token is " + token);
        jwt.verify(token, JWT_KEY, (err: any, user: any) => {
          if (err) {
            console.log("Error", err);
          }
          socket.data.user = user;
          // console.log(
          //   `the current user in middleware is ${JSON.stringify(user)}`
          // );
          next();
        });
      });

      io.on("connection", (socket) => {
        // console.log("connection triggered");

        const user = socket.data.user;
        // console.log("the user is " + user);

        socket.join(user.id);

        socket.on("create_todo", async (dataString, callback) => {
          const data = JSON.parse(dataString);
          todoController.createTodo(data, user, callback, socket);
        });

        socket.on("update_todo", async (dataString, callback) => {
          const data = JSON.parse(dataString);
          todoController.updateTodo(data, user, callback, socket);
        });

        socket.on("delete_todo", async (dataString, callback) => {
          const data = JSON.parse(dataString);
          todoController.deleteTodo(data, user, callback, socket);
        });
      });
    });
  })
  .catch((err) => {
    console.log(`something fucked up `, err);
  });
