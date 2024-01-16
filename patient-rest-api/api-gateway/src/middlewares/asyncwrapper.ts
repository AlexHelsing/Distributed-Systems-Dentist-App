import { Request, Response, NextFunction, RequestHandler } from "express";

export default function asyncwrapper(Handler: RequestHandler) {
   return async (req: Request, res: Response, next: NextFunction) => {
     try
     {
        await Handler(req, res, next);
     }
     catch(exception)
     {
        next(exception)
     }
   } 
}