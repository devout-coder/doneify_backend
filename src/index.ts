import express, { Express, Application, Request, Response } from "express";

import * as http from "http";

import cors from "cors";

import dotenv from "dotenv";

import { RouteConfig } from "./routeConfig";

import { UserRoutes } from "./routes/user";
import { AuthRoutes } from "./routes/auth";
import mongoose from "mongoose";

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

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome world");
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

      routes.forEach((route: RouteConfig) => {
        console.log(`Routes configured for ${route.getName()}`);
      });
    });
  })
  .catch((err) => {
    console.log(`something fucked up `, err);
  });
