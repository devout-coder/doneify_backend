import { Application } from "express";
import { RouteConfig } from "../routeConfig";
import TodoController from "../controllers/todo.controller";
import jwt from "../services/jwt";

export class TodoRoutes extends RouteConfig {
  constructor(app: Application) {
    super(app, "TodoRoutes");
  }

  configureRoutes() {
    this.app
      .route(`/todos`)
      .post([jwt.authenticateJWT, TodoController.createTodo]);
    this.app
      .route(`/todos`)
      .delete([jwt.authenticateJWT, TodoController.deleteTodo]);
    this.app
      .route(`/todos`)
      .put([jwt.authenticateJWT, TodoController.updateTodo]);
    return this.app;
  }
}
