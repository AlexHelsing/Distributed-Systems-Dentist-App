import { isValidObjectId } from "mongoose";
import {Request, Response, NextFunction} from 'express';

export default function validateObjectId (req: Request, res: Response, next: NextFunction) {

    if (!req.params.id && !req.params.dentist_id) return res.status(403).json({"message": "Id was not provided"})
    
    if(isValidObjectId(req.params.id) || isValidObjectId(req.params.dentist_id)) {
        next();
    }
    else{
        return res.status(400).json({"message": "Invalid Object id"})
    }
}