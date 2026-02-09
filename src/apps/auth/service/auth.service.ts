import bcrypt from 'bcrypt';
import User from '../model/user.model';
import AppError from '../../../utils/AppError';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../../utils/token.utils';

// ============ Types ============
interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface RegisterResponse {
  user: UserData;
}

interface LoginResponse {
  user: UserData;
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// ============ Constants ============
const SALT_ROUNDS = 12;

// ============ Helper Functions ============
const generateTokens = (userId: string) => ({
  accessToken: generateAccessToken(userId),
  refreshToken: generateRefreshToken(userId),
});

const formatUserResponse = (user: { _id: unknown; name: string; email: string }): UserData => ({
  id: user._id?.toString() || '',
  name: user.name,
  email: user.email,
});

// ============ Service Functions ============

/**
 * Register a new user (no tokens returned)
 */
export const register = async (input: RegisterInput): Promise<RegisterResponse> => {
  const { name, email, password } = input;

  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  // Hash password & create user
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashedPassword });

  return {
    user: formatUserResponse(user),
  };
};

/**
 * Login user (returns tokens)
 */
export const login = async (input: LoginInput): Promise<LoginResponse> => {
  const { email, password } = input;

  // Find user with password
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const tokens = generateTokens(user._id.toString());
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    user: formatUserResponse(user),
    ...tokens,
  };
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (oldRefreshToken: string): Promise<RefreshResponse> => {
  // Verify token
  let decoded;
  try {
    decoded = verifyRefreshToken(oldRefreshToken);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // Find user & validate stored token
  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user) {
    throw new AppError('User not found', 401);
  }

  // Token reuse detection
  if (user.refreshToken !== oldRefreshToken) {
    user.refreshToken = undefined;
    await user.save();
    throw new AppError('Invalid refresh token. Please login again.', 401);
  }

  // Generate new tokens
  const tokens = generateTokens(user._id.toString());
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return tokens;
};
