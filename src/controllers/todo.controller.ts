import { Request, Response, NextFunction } from "express";
import TodoModel from "../models/todo.model";
import mongoose from "mongoose";
import Todo from "../models/todo.model";
import { io } from "..";

class TodoController {
  constructor() {}

  async createTodo(data: any, user: any, callback: any, socket: any) {
    const id: number = parseInt(data["id"]);
    const taskName: string = data.taskName;
    const taskDesc: string = data.taskDesc;
    const finished: boolean = data.finished;
    const labelName: string = data.labelName;
    const timeStamp: number = data.timeStamp;
    const time: string = data.time;
    const timeType: string = data.timeType;
    const index: number = data.index;

    // console.log("gotten data is " + id + taskName + taskDesc + finished);

    const todo = new TodoModel({
      _id: id,
      taskName,
      taskDesc,
      finished,
      labelName,
      timeStamp,
      time,
      timeType,
      index,
      user: user.id,
    });
    await todo.save();
    socket
      .to(user.id)
      .emit("todo_operation", { operation: "create", data: todo });

    callback({
      success: true,
      data: todo,
    });
  }

  async updateTodo(data: any, user: any, callback: any, socket: any) {
    const id: number = parseInt(data["id"]);
    const taskName: string = data.taskName;
    const taskDesc: string = data.taskDesc;
    const finished: boolean = data.finished;
    const labelName: string = data.labelName;
    const timeStamp: number = data.timeStamp;
    const time: string = data.time;
    const timeType: string = data.timeType;
    const index: number = data.index;

    try {
      const oldTodo = await TodoModel.findById(id).exec();
      console.log("the val is " + oldTodo);
      if (oldTodo && user.id == oldTodo["user"]) {
        const updatedTodo = await TodoModel.findByIdAndUpdate(
          id,
          {
            _id: id,
            taskName,
            taskDesc,
            finished,
            labelName,
            timeStamp,
            time,
            timeType,
            index,
          },
          {
            new: true,
          }
        );

        socket.to(user.id).emit("todo_operation", {
          operation: "update",
          data: updatedTodo,
        });
        callback({
          success: true,
          data: updatedTodo,
        });
      } else {
        callback({
          success: false,
          message: "user details didn't match with the owner of the todo",
        });
      }
    } catch (error) {
      callback({
        success: false,
        message: error,
      });
    }
  }

  async deleteTodo(data: any, user: any, callback: any, socket: any) {
    const id: number = parseInt(data["id"]);

    const oldTodo = await TodoModel.findById(id).exec();
    if (oldTodo && user.id == oldTodo["user"]) {
      await TodoModel.findByIdAndRemove(id)
        .then((val) => {
          callback({
            success: true,
            data: "Todo deleted",
          });

          socket.to(user.id).emit("todo_operation", {
            operation: "delete",
            data: oldTodo,
          });
        })
        .catch((err) => {
          callback({
            success: false,
            message: err,
          });
        });
    } else {
      callback({
        success: false,
        message: "user details didn't match with the owner of the todo",
      });
    }
  }
}

export default new TodoController();
