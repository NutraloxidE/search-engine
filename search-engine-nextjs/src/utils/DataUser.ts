// src/utils/models/User.ts
//user data model for mongoose

import { Document, Schema, model, models } from 'mongoose';

interface IUser extends Document {
  //add nextauth id
  nextauth_id?: string[];
  userName?: string;
  email: string;
  password: string;
  image?: string;
  emailVerified?: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  nextauth_id: { type: [String], required: false },
  userName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
  emailVerified: { type: Date, required: false },
});

export default models.User || model<IUser>('User', UserSchema);
