import { Document, Schema, model, models } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
  nextauth_id?: string[];
  userName?: string;
  email: string;
  salt: string;
  password: string;
  image?: string;
  emailVerified?: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  nextauth_id: { type: [String], required: false },
  userName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  salt: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
  emailVerified: { type: Date, required: false },
});

// パスワードのハッシュ化を追加
UserSchema.methods.hashPassword = async function () {
  const user = this as IUser;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  user.salt = salt;
};

// パスワードの検証を追加
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  const user = this as IUser;
  return bcrypt.compare(candidatePassword, user.password);
};

export default models.User || model<IUser>('User', UserSchema);
