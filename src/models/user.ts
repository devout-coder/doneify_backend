import MongooseService from "../services/mongoose";

import { model, Schema, Model, Document } from "mongoose";

import { scrypt, randomBytes } from "crypto";

import { promisify } from "util";

import { Password } from "../services/password";

const scryptAsync = promisify(scrypt);

export interface IUser {
  email: string;
  password: string;
  username: string;
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  username: string;
}

interface UserModel extends Model<UserDocument> {
  build(attrs: IUser): UserDocument;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true },

    password: { type: String, required: true },

    username: { type: String, required: true },
  },

  {
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

const User = MongooseService.getInstance().model<UserDocument, UserModel>(
  "User",
  UserSchema
);

export default User;
