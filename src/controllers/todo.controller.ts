import { Request, Response, NextFunction } from "express";
import Todo from "../models/todo.model";
import DeletedTodo from "../models/deleted_todo.model";
import mongoose from "mongoose";
// import Todo from "../models/todo.model";
import { io } from "..";
import User, { updateTimeStamp } from "../models/user.model";
import Label from "../models/label.model";

class TodoController {
  async postLogin(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.user;

    try {
      const newTodos = req.body.todos;
      const newLabels = req.body.labels;
      const allLabels = await Label.find({
        user: user.id,
      }).exec();
      const allTodos = await Todo.find({ user: user.id }).exec();

      var repeatedLabels: any = {};

      for (let newLabel of newLabels) {
        var colorRepeated: String = "";
        var colorRepeatedLabel: String = "";
        var nameRepeated: String = "";
        for (let label of allLabels) {
          if (label["name"] == newLabel["name"]) {
            nameRepeated = label["name"];
          } else if (label["color"] == newLabel["color"]) {
            colorRepeated = label["color"];
            colorRepeatedLabel = label["name"];
          }
        }
        if (colorRepeated == "" && nameRepeated == "") {
          const label = new Label({
            _id: parseInt(newLabel["id"]),
            name: newLabel["name"],
            color: newLabel["color"],
            timeStamp: Date.now(),
            user: user.id,
          });
          var result: any = await label.save();
          allLabels.push(result);
          // console.log(result);
        } else if (colorRepeated != "") {
          repeatedLabels[newLabel["name"]] = colorRepeatedLabel;
        }
      }

      const repeatedLabelsArr = Object.keys(repeatedLabels);
      console.log(`repeated labels are ${repeatedLabelsArr}}`);

      for (let todo of newTodos) {
        var id: number = parseInt(todo["id"]);
        var taskName: string = todo["taskName"];
        var taskDesc: string = todo["taskDesc"];
        var finished: boolean = todo["finished"];
        var labelName: string = todo["labelName"];
        var timeStamp: number = todo["timeStamp"];
        var time: string = todo["time"];
        var timeType: string = todo["timeType"];
        var index: number = todo["index"];

        if (repeatedLabelsArr.includes(labelName)) {
          console.log(`todo with repeated label is ${todo}`);
          labelName = repeatedLabels[labelName];
        }

        const timeTodos = await Todo.find({
          user: user.id,
          time: todo["time"],
        }).exec();
        index = timeTodos.length;

        console.log(id, taskName, index);
        const oldTodo = await Todo.findById(id).exec();
        if (!oldTodo) {
          const newTodo = new Todo({
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
          const result = await newTodo.save();
          allTodos.push(result);
        } else {
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
          allTodos.push(updatedTodo!);
        }
      }
      // console.log(`all labels are ${allLabels} all todos are ${allTodos}`);

      updateTimeStamp(user.id, Date.now());

      return res.status(200).json({
        success: true,
        labels: allLabels,
        todos: allTodos,
      });
    } catch (error) {
      console.log(error);
    }
    // console.log(newLabels);
    // console.log(allLabels);
    // console.log(newTodos);
  }

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
      console.log("the todo val is " + oldTodo);
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
