import mongoose, { Document, Schema } from 'mongoose';

export interface ISearchHistory extends Document {
  _id: string; 
  ip: string;
  searchTerm: string;
  timestamp: Date;
}

export const SearchHistorySchema: Schema = new Schema({
  ip: { type: String, required: true },
  searchTerm: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.SearchHistory || mongoose.model<ISearchHistory>('SearchHistory', SearchHistorySchema);