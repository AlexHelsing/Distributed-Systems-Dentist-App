import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    status?: number;
}

export const errorHandlerMiddleware = function(err: CustomError, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    let err_res = {
        'message': err.message,
        'error': {}
    };
    if (process.env.NODE_ENV === 'development') {
        // Return sensitive stack trace only in dev mode
        err_res['error'] = err.stack || 'No stack trace available.';
    }
    res.status(err.status || 500);
    res.json(err_res);
};