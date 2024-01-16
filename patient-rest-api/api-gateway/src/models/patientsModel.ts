import { Schema, Types, Document, model } from "mongoose";
import Joi = require("joi");
import jwt = require('jsonwebtoken');
import bcrypt from 'bcrypt';

interface Patient extends Document {
    firstname: String,
    lastname: String,
    phone_number: Number,
    email: String,
    password: String,
    DOB: Date,
    signJWT: () => Promise<string>,
    hashPassword: () => Promise<void>
}

const patientSchema = new Schema<Patient>({
    _id: {type: Types.ObjectId, auto: true},
    firstname: {type: String, required: true, minlength: 1, maxlength: 255},
    lastname: {type: String, required: true, minlength: 1, maxlength: 255},
    phone_number: {type: Number, required: true},
    email: {type: String, required: true, maxlength:255, unique: true},
    password: {type: String, required: true, minlength:5, maxlength:255},
    DOB: {type: Date, required: true}
});

patientSchema.methods.signJWT = async function() {
    if(!process.env.JWT_SECRET){
        throw new Error('No sceret was provided for jsonwebtoken');
    }

    let token = await jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '8h'})
    return token;
}

patientSchema.methods.hashPassword = async function(): Promise<void>{
    let hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
}

export function validateRegistration(body: any) {
    const Schema = Joi.object({
        firstname: Joi.string().required().max(255).min(1),
        lastname: Joi.string().required().max(255).min(1),
        phone_number: Joi.number().required(),
        email: Joi.string().email().required().max(255),
        password: Joi.string().required().max(255).min(5),
        DOB: Joi.date().required()
    })

    return Schema.validate(body);
}

export function validateUpdate(body: any) {
    const Schema = Joi.object({
        firstname: Joi.string().max(255).min(1),
        lastname: Joi.string().max(255).min(1),
        phone_number: Joi.number(),
        email: Joi.string().email().max(255),
        password: Joi.string().max(255).min(5),
        DOB: Joi.date()
    })

    return Schema.validate(body);
}

export const Patient = model<Patient>('Patient', patientSchema)