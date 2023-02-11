import mongoose, { Model, Schema } from "mongoose";

export interface ITodo {
  _id: Number;
  taskName: string;
  taskDesc: string;
  finished: boolean;
  labelName: string;
  timeStamp: number;
  time: string;
  timeType: string;
  index: number;
  user: string;
}

export interface TodoDocument extends Document {
  _id: Number;
  taskName: string;
  taskDesc: string;
  finished: boolean;
  labelName: string;
  timeStamp: number;
  time: string;
  timeType: string;
  index: number;
  user: string;
}

interface TodoModel extends Model<TodoDocument> {
  build(attrs: ITodo): TodoDocument;
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
    user: { type: String, required: true },
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

TodoSchema.statics.build = (attrs: ITodo) => {
  return new Todo(attrs);
};

const Todo = mongoose.model<TodoDocument, TodoModel>("Todo", TodoSchema);

Todo.watch().on("change", (change) => {
  console.log("Something has changed");
});

export default Todo;
