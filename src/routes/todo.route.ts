import { Application } from "express";
import TodoController from "../controllers/todo.controller";
import jwt from "../services/jwt";
import labelController from "../controllers/label.controller";

export const todoRoutes = (app: Application): Application => {
  // app.route(`/todos`).put([jwt.authenticateJWT, TodoController.updateTodo]);
  // app
  //   .route("/todos?offlineTimestamp=:lastOfflineUpdated")
  //   .get([jwt.authenticateJWT, TodoController.getTodos]);
  app.get("/todos/:lastOfflineUpdated", [
    jwt.authenticateJWT,
    TodoController.getTodos,
    labelController.getLabels,
  ]);
  app.post("/postLogin", [
    jwt.authenticateJWT,
    // TodoController.getTodos,
    // labelController.getLabels,
    TodoController.postLogin,
  ]);
  return app;
};
