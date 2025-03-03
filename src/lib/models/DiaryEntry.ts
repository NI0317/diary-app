import mongoose from 'mongoose';

const DiaryEntrySchema = new mongoose.Schema({
  date: { type: String, required: true },
  mood: { type: Number, required: true },
  learned: { type: String, required: true },
  improvements: { type: String, required: true },
  gratitude: { type: [String], required: true },
  lookingForward: { type: String, required: true },
  news: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.models.DiaryEntry || mongoose.model('DiaryEntry', DiaryEntrySchema); 