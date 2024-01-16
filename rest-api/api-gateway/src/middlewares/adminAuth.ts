import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export default async function authAdmin (req: Request, res: Response, next: NextFunction) {
    let token: string | undefined  = req.headers['x-access-token'] as string
    
    if(!token) return res.status(401).json({"message":"Access denided, token was not provided."});
    
    if (process.env.JWT_SECRET === undefined || process.env.JWT_SECRET.trim() as string === '') {
        throw new Error("Json webtoken secret was not provided.");
    }

    try {

        let decoded = await jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
        if(decoded._id !== req.params.id || !decoded.isAdmin) return res.status(401).json({"message":"Unauthorized access"})
        

        next();
    }
    catch(err) {
        // jwt throws an error in case of failure in verification of token.
        return res.status(401).json({"message":"Unauthorized access"})
    }

}