import mongoose, { Model, Schema } from "mongoose";

export interface IDeletedLabel {
  _id: Number;
  timeStamp: number;
  user: string;
}

export interface DeletedLabelDocument extends Document {
  _id: Number;
  timeStamp: number;
  user: string;
}

export interface DeletedLabelModel extends Model<DeletedLabelDocument> {
  build(attrs: IDeletedLabel): DeletedLabelDocument;
}

const DeletedLabelSchema: Schema = new Schema(
  {
    _id: { type: Number, required: true },
    timeStamp: { type: Number, required: true },
    user: { type: String, required: true },
  },
  {
    collection: "deleted_labels",
    toObject: {
      transform: function (doc, ret) {},
    },

    toJSON: {
      transform: function (doc, ret) {},
    },
  }
);

DeletedLabelSchema.statics.build = (attrs: IDeletedLabel) => {
  return new DeletedLabel(attrs);
};

const DeletedLabel = mongoose.model<DeletedLabelDocument, DeletedLabelModel>(
  "DeletedLabel",
  DeletedLabelSchema
);

export default DeletedLabel;
