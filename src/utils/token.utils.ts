import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
}

export const generateAccessToken = (userId: string): string => {
    const secret: Secret = process.env.ACCESS_TOKEN_SECRET || 'fallback-secret';
    const options: SignOptions = {
        expiresIn: '15m',
    };
    return jwt.sign({ userId }, secret, options);
};

export const generateRefreshToken = (userId: string): string => {
    const secret: Secret = process.env.REFRESH_TOKEN_SECRET!;
    const options: SignOptions = {
        expiresIn: '7d',
    };
    return jwt.sign({ userId }, secret, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
    const secret: Secret = process.env.ACCESS_TOKEN_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return { userId: decoded.userId };
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    const secret: Secret = process.env.REFRESH_TOKEN_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return { userId: decoded.userId };
};
