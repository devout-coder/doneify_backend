import mongoose, { Schema } from "mongoose";

export interface Todo {
  id: Number;
  taskName: string;
  taskDesc: string;
  finished: boolean;
  labelName: string;
  timeStamp: number;
  time: string;
  timeType: string;
  index: number;
}

const TodoSchema: Schema = new Schema(
  {
    _id: { type: Number, required: true },
    taskName: { type: String, required: true },
    taskDesc: { type: String, required: false },
    finished: { type: Boolean, required: true },
    labelName: { type: String, required: true },
    timeStamp: { type: Number, required: true },
    time: { type: String, required: true },
    timeType: { type: String, required: true },
    index: { type: Number, required: true },
  },
  {
    collection: "todos",
    toObject: {
      transform: function (doc, ret) {},
    },

    toJSON: {
      transform: function (doc, ret) {},
    },
  }
);

const TodoModel = mongoose.model("Todo", TodoSchema);

TodoModel.watch().on("change", (change) => {
  console.log("Something has changed");
});

export default TodoModel;
