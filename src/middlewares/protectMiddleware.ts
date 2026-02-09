import { Request, Response, NextFunction } from "express";
import tryCatch from "../utils/tryCatch";
import AppError from "../utils/AppError";
import { verifyAccessToken } from "../utils/token.utils";
import User from "../apps/auth/model/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
      };
    }
  }
}

const protectMiddleware = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new AppError("You are not logged in. Please login to access.", 401),
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      return next(
        new AppError("Invalid or expired token. Please login again.", 401),
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new AppError("User no longer exists.", 401));
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  },
);

export default protectMiddleware;
