import { Request, Response, NextFunction } from "express";
import TodoModel, { Todo } from "../models/todo";

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

    console.log(`id received is ${req.body.id}`);

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

    console.log(id);

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "couldn't find required todo" });
    // } else {
    try {
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
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "fucked something up" });
    }
    // }
  }

  async deleteTodo(req: Request, res: Response) {
    const id: number = parseInt(req.body.id);

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "couldn't find required todo" });
    // } else {
    await TodoModel.findByIdAndRemove(id)
      .then((val) => {
        return res.status(200).json({ success: true, message: "Todo deleted" });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ success: false, message: "fucked something up" });
      });
    // }
  }
}

export default new TodoController();
