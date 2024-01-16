import express from "express";
import { Request, Response } from "express";
import asyncwrapper from "../../middlewares/asyncwrapper";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Dentist } from "../../models/dentistModel";

const router = express.Router() 

router.get('/', asyncwrapper(async (req: Request, res: Response) => {
    let token: string = req.headers['x-access-token'] as string;
    if (!token) return res.status(401).json({ "message": "No token was provided" });

    if (!process.env.JWT_SECRET) {
        console.log('')
        throw new Error("No secret was provided for json webtoken");
    }

    let id;

    try {
        let decoded = await jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        id = decoded._id;
    }
    catch (err) {
        return res.status(401).json({ "message": "Unauthorized access" });
    }

    if (id) {
        let dentist = await Dentist.findById(id).select('-password');
        if (!dentist) return res.status(404).json({ "message": "Dentist with given id was not found" });

        res.status(200).json(dentist);
    }
}));

export default router;