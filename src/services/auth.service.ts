import User from "../models/user.model";

import { IUser } from "../models/user.model";

class AuthService {
  // async createUser(data: IUser) {
  //   try {
  //     const user = User.build(data);
  //     return await user.save();

  //   } catch (e) {
  //     console.log(e);
  //     // throw new Error(e);
  //   }
  // }

  // async createGoogleUser(data: IUser) { try {
  //     const user = User.build(data);
  //     return await user.save();
  //   } catch (e) {
  //     console.log(e);
  //     // throw new Error(e);
  //   }
  // }

  // async findUserByEmail(email: string) {
  //   return User.findOne({
  //     email: email,
  //   }).exec();
  // }
}

export default new AuthService();
