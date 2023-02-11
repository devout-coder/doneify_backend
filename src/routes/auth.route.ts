import { Application, Request, Response } from "express";
import AuthController from "../controllers/auth.controller";

export const authRoutes = (app: Application): Application => {
  app.route("/login").post(AuthController.login);
  app.route("/signup").post(AuthController.signup);
  app.route("/signupGoogle").post(AuthController.signupGoogle);
  return app;
};
