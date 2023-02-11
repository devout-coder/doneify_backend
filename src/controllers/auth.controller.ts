import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Password } from "../services/password";
import User from "../models/user.model";

const jwtSecret: string = process.env.JWT_SECRET || "123456";
// const tokenExpirationInSeconds = 36000;

class AuthController {
  constructor() {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;

      const user = await User.findOne({
        email: email,
      }).exec();

      if (user) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      } else {
        try {
          const newUser = User.build({ username, email, password });
          await newUser.save();

          const token = jwt.sign({ id: newUser?.id }, jwtSecret);
          return res.status(200).json({
            success: true,
            data: newUser,
            token,
          });
        } catch (e) {
          throw new Error("Error while register");
        }
      }
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const user = await User.findOne({
        email: email,
      }).exec();

      if (user) {
        const isPasswordMatch = await Password.compare(
          user.password!!,
          password
        );
        if (!isPasswordMatch) {
          // throw new Error("Invalid Password");
          return res.status(401).json({
            success: false,
            message: "Invalid credentials",
          });
        } else {
          const token = jwt.sign({ id: user?.id }, jwtSecret);

          return res.status(200).json({
            success: true,
            data: user,
            token,
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }
    } catch (e) {
      next(e);
    }
  }

  async signupGoogle(req: Request, res: Response, next: NextFunction) {
    try {
      const username = req.body.username;
      const email = req.body.email;
      const user = await User.findOne({
        email: email,
      }).exec();
      console.log(`fetched username: ${username} and email: ${email}`);

      if (user) {
        //user exists
        const token = jwt.sign({ id: user?.id }, jwtSecret);
        console.log(
          `existing username: ${user.username} and email: ${user.email}`
        );
        return res.status(200).json({
          success: true,
          data: user,
          token,
        });
      } else {
        try {
          const newUser = User.build({ username, email });
          await newUser.save();
          console.log(
            `new username: ${newUser?.username} and email: ${newUser?.email}`
          );
          const token = jwt.sign({ id: newUser?.id }, jwtSecret);
          return res.status(200).json({
            success: true,
            data: newUser,
            token,
          });
        } catch (e) {
          throw new Error("Error while register");
        }
      }
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();
