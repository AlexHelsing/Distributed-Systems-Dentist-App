import { isValidObjectId } from "mongoose";
import {Request, Response, NextFunction} from 'express';

export default function validateObjectId (req: Request, res: Response, next: NextFunction) {

    if (!req.params.id) return res.status(403).json({"message": "Id was not provided"})
    
    if(isValidObjectId(req.params.id)) {
        next();
    }
    else{
        return res.status(400).json({"message": "Invalid Object id"})
    }
}