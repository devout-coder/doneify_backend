import mongoose, { Model, Schema } from "mongoose";

export interface ILabel {
  _id: Number;
  name: string;
  color: string;
  timeStamp: number;
  user: string;
}

export interface LabelDocument extends Document {
  _id: Number;
  name: string;
  color: string;
  timeStamp: number;
  user: string;
}

interface LabelModel extends Model<LabelDocument> {
  build(attrs: ILabel): LabelDocument;
}

const LabelSchema: Schema = new Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    timeStamp: { type: Number, required: true },
    user: { type: String, required: true },
  },
  {
    collection: "labels",
    toObject: {
      transform: function (doc, ret) {},
    },

    toJSON: {
      transform: function (doc, ret) {},
    },
  }
);

LabelSchema.statics.build = (attrs: ILabel) => {
  return new Label(attrs);
};

const Label = mongoose.model<LabelDocument, LabelModel>("Label", LabelSchema);

export default Label;
