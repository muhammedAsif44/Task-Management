import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

const tryCatch = (fn: AsyncRequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export default tryCatch;
