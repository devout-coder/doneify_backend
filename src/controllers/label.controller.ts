import { Request, Response, NextFunction } from "express";
import User, { updateTimeStamp } from "../models/user.model";
import Label from "../models/label.model";
import DeletedLabel from "../models/deleted_label.model";
import { generateRandomNumber } from "../services/random_no";

class LabelController {
  constructor() {}

  async generateDefaultLabel(user: String) {
    const id: Number = generateRandomNumber(10);
    const timeStamp: Number = Date.now();
    const name: String = "General";
    const color: String = "Color(0xffffffff)";

    const label = new Label({
      _id: id,
      name,
      color,
      timeStamp,
      user: user,
    });
    await label.save();
  }

  async getLabels(req: Request, res: Response) {
    const user = res.locals.user;

    const newLabels = await Label.find({
      user: user.id,
      timeStamp: { $gt: res.locals.offlineDBUpdatedTime },
    }).exec();
    console.log(`all labels are fetched are ${newLabels}`);

    const newDeletedLabels = await DeletedLabel.find({
      user: user.id,
      timeStamp: { $gt: res.locals.offlineDBUpdatedTime },
    }).exec();
    console.log(`all deleted labels are fetched are ${newDeletedLabels}`);

    return res.status(200).json({
      success: true,
      message: "offline db needs to be updated",
      labels: newLabels,
      deletedLabels: newDeletedLabels,
      todos: res.locals.todos,
      deletedTodos: res.locals.deletedTodos,
    });
  }

  async createLabel(data: any, user: any, callback: any, socket: any) {
    const id: number = parseInt(data["id"]);
    const name: string = data.name;
    const color: string = data.color;
    const timeStamp: number = data.timeStamp;

    const label = new Label({
      _id: id,
      name,
      color,
      timeStamp,
      user: user.id,
    });
    await label.save();
    socket
      .to(user.id)
      .emit("label_operation", { operation: "create", data: label });

    callback({
      success: true,
      data: label,
    });

    updateTimeStamp(user.id, timeStamp);
  }

  async updateLabel(data: any, user: any, callback: any, socket: any) {
    const id: number = parseInt(data["id"]);
    const name: string = data.name;
    const color: string = data.color;
    const timeStamp: number = data.timeStamp;

    try {
      const oldLabel = await Label.findById(id).exec();

      console.log("the val is " + oldLabel);
      if (oldLabel && user.id == oldLabel.user) {
        const updatedLabel = await Label.findByIdAndUpdate(
          id,
          {
            _id: id,
            name,
            color,
            timeStamp,
            user: user.id,
          },
          {
            new: true,
          }
        );

        socket.to(user.id).emit("label_operation", {
          operation: "update",
          data: updatedLabel,
        });
        callback({
          success: true,
          data: updatedLabel,
        });

        updateTimeStamp(user.id, timeStamp);
      } else {
        callback({
          success: false,
          message: "user details didn't match with the owner of the label",
        });
      }
    } catch (error) {
      callback({
        success: false,
        message: error,
      });
    }
  }

  async deleteLabel(data: any, user: any, callback: any, socket: any) {
    const id: number = parseInt(data["id"]);
    const timeStamp: number = data.timeStamp;

    const oldLabel = await Label.findById(id).exec();
    if (oldLabel && user.id == oldLabel["user"]) {
      await Label.findByIdAndRemove(id)
        .then(async (val) => {
          callback({
            success: true,
            data: "Label deleted",
          });

          socket.to(user.id).emit("label_operation", {
            operation: "delete",
            data: oldLabel,
          });

          const deletedLabel = new DeletedLabel({
            _id: id,
            timeStamp,
            user: user.id,
          });
          await deletedLabel.save();
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
        message: "user details didn't match with the owner of the label",
      });
    }
  }
}

export default new LabelController();
