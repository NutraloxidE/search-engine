import mongoose, { Document, Schema } from 'mongoose';

interface ISearchHistory extends Document {
  ip: string;
  searchTerm: string;
  timestamp: Date;
}

const SearchHistorySchema: Schema = new Schema({
  ip: { type: String, required: true },
  searchTerm: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.SearchHistory || mongoose.model<ISearchHistory>('SearchHistory', SearchHistorySchema);