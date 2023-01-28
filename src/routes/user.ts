import { RouteConfig } from "../routeConfig";

import express, { Application, Request, Response } from "express";

import UserController from "../controllers/user";
import jwt from "../jwt";

export class UserRoutes extends RouteConfig {
  constructor(app: Application) {
    super(app, "UserRoutes");
  }

  configureRoutes() {
    this.app
      .route(`/users`)
      .get([jwt.authenticateJWT, UserController.getUsers]);

    return this.app;
  }
}
