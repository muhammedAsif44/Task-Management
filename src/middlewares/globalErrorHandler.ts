import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

const globalErrorHandler = (
    err: AppError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = (err as AppError).statusCode || 500;
    const status = (err as AppError).status || 'error';

    if (process.env.NODE_ENV === 'development') {
        res.status(statusCode).json({
            status,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    } else {
        if ((err as AppError).isOperational) {
            res.status(statusCode).json({
                status,
                message: err.message,
            });
        } else {
            console.error('ERROR ', err);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong!',
            });
        }
    }
};

export default globalErrorHandler;
