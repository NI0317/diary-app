import mongoose from 'mongoose';

const DiaryEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  learned: {
    type: String,
    required: true,
  },
  improvements: {
    type: String,
    required: true,
  },
  gratitude: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length <= 3, '感恩事项不能超过3个'],
  },
  lookingForward: {
    type: String,
    required: true,
  },
  news: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.DiaryEntry || mongoose.model('DiaryEntry', DiaryEntrySchema); 