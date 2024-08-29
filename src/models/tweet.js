import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Tweet = mongoose.models?.Tweet || mongoose.model('Tweet', tweetSchema);
export default Tweet;
