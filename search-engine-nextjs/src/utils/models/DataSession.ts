// src/utils/models/DataSession.ts
import mongoose, { Document, Schema } from 'mongoose';

interface ISession extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  sessionId: string;
  expires: Date;
}

const SessionSchema: Schema<ISession> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  sessionId: { type: String, required: true, unique: true },
  expires: { type: Date, required: true },
});

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
