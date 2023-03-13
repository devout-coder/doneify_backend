import mongoose, { model, Schema, Model, Document } from "mongoose";

import { scrypt, randomBytes } from "crypto";

import { promisify } from "util";

import { Password } from "../services/password";

const scryptAsync = promisify(scrypt);

export interface IUser {
  email: string;
  password?: string;
  username: string;
  todoTimeStamp?: number;
}

export interface UserDocument extends Document {
  email: string;
  password?: string;
  username: string;
  todoTimeStamp?: number;
}

interface UserModel extends Model<UserDocument> {
  build(attrs: IUser): UserDocument;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: false },
    username: { type: String, required: true },
    todoTimeStamp: { type: Number, required: false },
  },
  {
    collection: "users",
    toObject: {
      transform: function (doc, ret) {},
    },

    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
      },
    },
  }
);

UserSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));

    this.set("password", hashed);
  }

  done();
});

UserSchema.statics.build = (attrs: IUser) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);

export async function updateTimeStamp(userId: string, timeStamp: number) {
  const userDetails = await User.findById(userId).exec();
  if (userDetails != null) {
    const result = await User.findByIdAndUpdate(userId, {
      username: userDetails.username,
      email: userDetails.email,
      password: userDetails.password,
      todoTimeStamp: timeStamp,
    });
    console.log(`result of updateTimeStamp is ${result}`);
  }
}

export default User;
