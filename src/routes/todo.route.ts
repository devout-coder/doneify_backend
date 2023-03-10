import { Application } from "express";
import TodoController from "../controllers/todo.controller";
import jwt from "../services/jwt";

export const todoRoutes = (app: Application): Application => {
  app.route(`/todos`).post([jwt.authenticateJWT, TodoController.createTodo]);
  app.route(`/todos`).delete([jwt.authenticateJWT, TodoController.deleteTodo]);
  app.route(`/todos`).put([jwt.authenticateJWT, TodoController.updateTodo]);
  return app;
};
