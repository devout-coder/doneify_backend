import { Application, Request, Response } from "express";

import { RouteConfig } from "../routeConfig";

import AuthController from "../controllers/auth";

export class AuthRoutes extends RouteConfig {
  constructor(app: Application) {
    super(app, "AuthRoutes");
  }

  configureRoutes() {
    this.app.route("/login").post(AuthController.login);

    this.app.route("/signup").post(AuthController.signup);

    return this.app;
  }
}
