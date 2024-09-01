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
	likes:{
		type: Number,
		default:0
	}
}, {
  timestamps: true,
});

const Tweet = mongoose.models?.Tweet || mongoose.model('Tweet', tweetSchema);
export default Tweet;
