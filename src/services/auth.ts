import User from "../models/user";

import { IUser } from "../models/user";

class AuthService {
  async createUser(data: IUser) {
    try {
      const user = User.build(data);

      await user.save();
    } catch (e) {
		console.log(e);
      // throw new Error(e);
    }
  }

  async findUserByEmail(email: string) {
    return User.findOne({
      email: email,
    }).exec();
  }
}

export default new AuthService();
