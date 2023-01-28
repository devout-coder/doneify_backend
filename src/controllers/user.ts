import { Request, Response, NextFunction } from "express";

class UserController {
  constructor() {}

  async getUsers(req: any, res: Response, next: NextFunction) {
    return res.status(200).json({
      success: true,
      data: [
        {
          name: "John",
        },
        {
          name: "Steve",
        },
      ],
    });
  }
}

export default new UserController();
