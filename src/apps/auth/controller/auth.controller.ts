import { Request, Response, NextFunction } from "express";
import AppError from "../../../utils/AppError";
import * as authService from "../service/auth.service";

// ============ Constants ============
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, REFRESH_TOKEN_COOKIE_OPTIONS);
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await authService.register(req.body);

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: {
      user: result.user,
    },
  });
};

 
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await authService.login(req.body);

  setRefreshTokenCookie(res, result.refreshToken);

  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};

 
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const oldRefreshToken = req.cookies?.refreshToken;

  if (!oldRefreshToken) {
    return next(new AppError("Refresh token not found", 401));
  }
  const result = await authService.refreshToken(oldRefreshToken);
  setRefreshTokenCookie(res, result.refreshToken);

  res.status(200).json({
    status: "success",
    message: "Token refreshed successfully",
    data: {
      accessToken: result.accessToken,
    },
  });
};
