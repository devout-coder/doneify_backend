import mongoose, { Model, Schema } from "mongoose";
import { io } from "..";

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
  console.log(`real change is ${JSON.stringify(change)}`);
  const map = new Map(Object.entries(change));
  const todo = map.get("fullDocument");
  console.log(todo);
  todo["id"] = todo["_id"];

  //socket connection now works for create, only that has fullDocument. change in case of update and delete:
  //update
  // {"_id":{"_data":"8263ED0F8C000000622B022C0100296E5A100463B6F177E0FD4903B80618784767A672461E5F69640031047E45824B40F40004","_typeBits":"QA=="},"operationType":"update","clusterTime":{"$timestamp":"7200428473205129314"},"ns":{"db":"doneify","coll":"todos"},"documentKey":{"_id":632368455327866},"updateDescription":{"updatedFields":{"taskName":"fhghvhuu","timeStamp":1676480388250},"removedFields":[],"truncatedArrays":[]}}
  //delete
  //{"_id":{"_data":"8263ED0F01000000082B022C0100296E5A100463B6F177E0FD4903B80618784767A672461E5F6964003101BCC2DE23731E0004","_typeBits":"QA=="},"operationType":"delete","clusterTime":{"$timestamp":"7200427876204675080"},"ns":{"db":"doneify","coll":"todos"},"documentKey":{"_id":244510056626575}}

  // io.emit("todo_changed_server", JSON.stringify(map.get("fullDocument")));

  io.emit("todo_changed_server", JSON.stringify(map.get("fullDocument")));
});

export default Todo;
