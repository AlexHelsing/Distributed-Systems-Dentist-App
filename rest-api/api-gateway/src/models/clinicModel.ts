import { Schema, Types, Document } from 'mongoose';
import mongoose from 'mongoose';
import { Dentist } from './dentistModel';
import jwt from 'jsonwebtoken';

interface Admin extends Document {
  username: String;
  password: String;
}

const adminSchema = new Schema<Admin>({
  username: { type: String, minlength: 3, maxlength: 255, required: true },
  password: { type: String, minlength: 5, maxlength: 255, required: true },
});

interface Clinic extends Document {
  name: String;
  dentists: [Dentist];
  coordinates: {
    lat: Number;
    lng: Number;
  };
  admin: Admin;
  address: String;
  photo: String; // URL to a clinic photo
  city: String;
  // zip: String;
  signJWT: () => Promise<string>;
}

const clinicSchema = new Schema<Clinic>({
  _id: { type: Types.ObjectId, auto: true },
  name: { type: String, required: true, minlength: 3, maxlength: 255 },
  dentists: [{ type: Types.ObjectId, ref: 'Dentist' }],
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  admin: { type: adminSchema, required: true },
  address: { type: String, required: true, max: 255 },
  photo: { type: String, required: true },
  city: { type: String, required: true },
  // zip: {type: String, required: true}
});

clinicSchema.methods.signJWT = async function () {
  if (!process.env.JWT_SECRET) {
    throw new Error('No sceret was provided for jsonwebtoken');
  }

  let token = await jwt.sign(
    { _id: this._id, isAdmin: true },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  return token;
};

export const Clinic = mongoose.model<Clinic>('Clinic', clinicSchema);
