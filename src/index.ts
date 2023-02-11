import express, { Express, Application, Request, Response } from "express";

import * as http from "http";

import cors from "cors";

import dotenv from "dotenv";

import { RouteConfig } from "./routeConfig";

import { UserRoutes } from "./routes/user.route";
import { AuthRoutes } from "./routes/auth.route";
import mongoose from "mongoose";
import { TodoRoutes } from "./routes/todo.route";
// const io = require("socket.io")(8000);

const routes: Array<RouteConfig> = [];

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

routes.push(new UserRoutes(app));
routes.push(new AuthRoutes(app));
routes.push(new TodoRoutes(app));

app.get("/", (req: Request, res: Response) => {
  res.send("Fuck this world");
});

const server: http.Server = http.createServer(app);

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
      // io.on("connection", (socket: any) => {
      //   socket.on("createTodo", (data: any) => {
      //     // data will look like => {myID: "123123"}
      //     console.log("user joined room");
      //     socket.join(data.myID);
      //   });
      // });
      routes.forEach((route: RouteConfig) => {
        console.log(`Routes configured for ${route.getName()}`);
      });
    });
  })
  .catch((err) => {
    console.log(`something fucked up `, err);
  });
