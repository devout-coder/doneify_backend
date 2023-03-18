import { Request, Response, NextFunction } from "express";
import Todo from "../models/todo.model";
import DeletedTodo from "../models/deleted_todo.model";
import mongoose from "mongoose";
// import Todo from "../models/todo.model";
import { io } from "..";
import User, { updateTimeStamp } from "../models/user.model";

class TodoController {
  constructor() {}

  async getTodos(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.user;

    const userDetails = await User.findById(user.id).exec();
    if (userDetails != null) {
      const offlineDBUpdatedTime: number = parseInt(
        req.params.lastOfflineUpdated
      );
      console.log("offline db was updated at " + offlineDBUpdatedTime);
      const onlineDBUpdatedTime: number | undefined =
        userDetails?.todoTimeStamp;
      console.log(`online db was updated at ${userDetails?.todoTimeStamp}`);
      if (
        onlineDBUpdatedTime != undefined &&
        onlineDBUpdatedTime > offlineDBUpdatedTime
      ) {
        res.locals.offlineDBUpdatedTime = offlineDBUpdatedTime;
        res.locals.todos = await Todo.find({
          user: user.id,
          timeStamp: { $gt: offlineDBUpdatedTime },
        }).exec();
        console.log(`all todos are fetched are ${res.locals.todos}`);

        res.locals.deletedTodos = await DeletedTodo.find({
          user: user.id,
          timeStamp: { $gt: offlineDBUpdatedTime },
        }).exec();
        console.log(
          `all deleted todos are fetched are ${res.locals.newDeletedTodos}`
        );
        next();
        // return res.status(200).json({
        //   success: true,
        //   message: "offline db needs to be updated",
        //   todos: newTodos,
        //   deletedTodos: newDeletedTodos,
        // });
      } else {
        console.log("offline db up to date");
        return res.status(200).json({
          success: true,
          message: "offline db up to date",
        });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
  }

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
    console.log(`id is ${user.id}`);

    const todo = new Todo({
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

    updateTimeStamp(user.id, timeStamp);
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
      const oldTodo = await Todo.findById(id).exec();
      console.log("the val is " + oldTodo);
      if (oldTodo && user.id == oldTodo["user"]) {
        const updatedTodo = await Todo.findByIdAndUpdate(
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

        updateTimeStamp(user.id, timeStamp);
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
    const timeStamp: number = data.timeStamp;

    const oldTodo = await Todo.findById(id).exec();
    if (oldTodo && user.id == oldTodo["user"]) {
      await Todo.findByIdAndRemove(id)
        .then(async (val) => {
          callback({
            success: true,
            data: "Todo deleted",
          });

          socket.to(user.id).emit("todo_operation", {
            operation: "delete",
            data: oldTodo,
          });

          const deletedTodo = new DeletedTodo({
            _id: id,
            timeStamp,
            user: user.id,
          });
          await deletedTodo.save();
          updateTimeStamp(user.id, timeStamp);
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
