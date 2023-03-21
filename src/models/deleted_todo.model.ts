import mongoose, { Model, Schema } from "mongoose";

export interface IDeletedTodo {
  _id: Number;
  timeStamp: number;
  user: string;
}

export interface DeletedTodoDocument extends Document {
  _id: Number;
  timeStamp: number;
  user: string;
}

export interface DeletedTodoModel extends Model<DeletedTodoDocument> {
  build(attrs: IDeletedTodo): DeletedTodoDocument;
}

const DeletedTodoSchema: Schema = new Schema(
  {
    _id: { type: Number, required: true },
    timeStamp: { type: Number, required: true },
    user: { type: String, required: true },
  },
  {
    collection: "deleted_todos",
    toObject: {
      transform: function (doc, ret) {},
    },

    toJSON: {
      transform: function (doc, ret) {},
    },
  }
);

DeletedTodoSchema.statics.build = (attrs: IDeletedTodo) => {
  return new DeletedTodo(attrs);
};

const DeletedTodo = mongoose.model<DeletedTodoDocument, DeletedTodoModel>(
  "DeletedTodo",
  DeletedTodoSchema
);

export default DeletedTodo;
