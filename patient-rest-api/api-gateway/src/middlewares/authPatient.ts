import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

export default function authPatient(req: Request, res: Response, next: NextFunction) {
    let token: string | undefined = req.headers['x-access-token'] as string

    if(!token) return res.status(401).json({"message":"Token was not provided"});

    if (process.env.JWT_SECRET === undefined || process.env.JWT_SECRET.trim() as string === '') {
        throw new Error("Json webtoken secret was not provided.");
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        if(decoded._id !== req.params.id) {
            return res.status(401).json({"message": "Unauthorized aceess"});      
        }

        next();
    }
    catch(err) {
        return res.status(401).json({"message": "Unauthorized access"});
    }
    
}