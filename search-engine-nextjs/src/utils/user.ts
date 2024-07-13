// src/utils/models/User.ts

import { Document, Schema, model, models } from 'mongoose';

interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  image?: string;
  emailVerified?: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
  emailVerified: { type: Date, required: false },
});

export default models.User || model<IUser>('User', UserSchema);
