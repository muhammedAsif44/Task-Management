import bcrypt from "bcrypt";
import User from "../model/user.model";
import AppError from "../../../utils/AppError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/token.utils";
import {
  RegisterInput,
  LoginInput,
  RefreshResponse,
} from "../types/auth.types";

const generateTokens = (userId: string) => ({
  accessToken: generateAccessToken(userId),
  refreshToken: generateRefreshToken(userId),
});

export const register = async (body: RegisterInput) => {
  const { name, email, password } = body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return { user };
};

export const login = async (body: LoginInput) => {
  const { email, password } = body;

  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokens = generateTokens(user._id.toString());
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return { user, ...tokens };
};

export const refreshToken = async (
  oldRefreshToken: string,
): Promise<RefreshResponse> => {
  let decoded;
  try {
    decoded = verifyRefreshToken(oldRefreshToken);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await User.findById(decoded.userId).select("+refreshToken");
  if (!user) {
    throw new AppError("User not found", 401);
  }

  if (user.refreshToken !== oldRefreshToken) {
    user.refreshToken = undefined;
    await user.save();
    throw new AppError("Invalid refresh token. Please login again.", 401);
  }

  const tokens = generateTokens(user._id.toString());
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return tokens;
};
