import { Request, Response, NextFunction } from "express";
import TodoModel from "../models/todo.model";
import mongoose from "mongoose";

class TodoController {
  constructor() {}

  async createTodo(req: Request, res: Response) {
    const id: number = parseInt(req.body.id);
    const taskName: string = req.body.taskName;
    const taskDesc: string = req.body.taskDesc;
    const finished: boolean = req.body.finished;
    const labelName: string = req.body.labelName;
    const timeStamp: number = req.body.timeStamp;
    const time: string = req.body.time;
    const timeType: string = req.body.timeType;
    const index: number = req.body.index;

    const loggedUser = res.locals.user;

    // console.log(`user received is ${user.id}`);

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
      user: loggedUser.id,
    });
    await todo.save();

    return res.status(200).json({
      success: true,
      data: todo,
    });
  }

  async updateTodo(req: Request, res: Response) {
    const id: number = parseInt(req.body.id);
    const taskName: string = req.body.taskName;
    const taskDesc: string = req.body.taskDesc;
    const finished: boolean = req.body.finished;
    const labelName: string = req.body.labelName;
    const timeStamp: number = req.body.timeStamp;
    const time: string = req.body.time;
    const timeType: string = req.body.timeType;
    const index: number = req.body.index;

    const loggedUser = res.locals.user;

    try {
      const oldTodo = await TodoModel.findById(id);
      if (oldTodo && loggedUser.id == oldTodo.user) {
        const updatedPost = await TodoModel.findByIdAndUpdate(
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
        return res.status(200).json({ success: true, data: updatedPost });
      } else {
        return res.status(400).json({
          success: false,
          message: "user details didn't match with the owner of the todo",
        });
      }
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "fucked something up" });
    }
    // }
  }

  async deleteTodo(req: Request, res: Response) {
    const id: number = parseInt(req.body.id);

    const loggedUser = res.locals.user;
    const oldTodo = await TodoModel.findById(id);
    if (oldTodo && loggedUser.id == oldTodo.user) {
      await TodoModel.findByIdAndRemove(id)
        .then((val) => {
          return res
            .status(200)
            .json({ success: true, message: "Todo deleted" });
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ success: false, message: "fucked something up" });
        });
    } else {
      return res.status(400).json({
        success: false,
        message: "user details didn't match with the owner of the todo",
      });
    }
  }
}

export default new TodoController();
