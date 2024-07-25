import mongoose, { Document, Schema } from 'mongoose';

interface IData extends Document {
  id: number;
  title: string;
  url: string;
  about: string;
  textSnippet: string;
  fetchedAt: Date;
  relatedUrls: string[]; // 追加したフィールド
  favicon: string; // 追加したフィールド
}

const DataSchema: Schema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  about: { type: String, required: true },
  textSnippet: { type: String, required: true },
  fetchedAt: { type: Date, default: Date.now },
  relatedUrls: { type: [String], default: [] }, // 追加したフィールド
  favicon: { type: String, default: '' } // 追加したフィールド
});

export default mongoose.models.Data || mongoose.model<IData>('Data', DataSchema);