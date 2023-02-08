import { Application } from "express";
import { RouteConfig } from "../routeConfig";
import TodoController from "../controllers/todo";

export class TodoRoutes extends RouteConfig {
  constructor(app: Application) {
    super(app, "TodoRoutes");
  }

  configureRoutes() {
    this.app.route(`/todos`).post(TodoController.createTodo);
    this.app.route(`/todos`).delete(TodoController.deleteTodo);
    this.app.route(`/todos`).put(TodoController.updateTodo);
    return this.app;
  }
}
