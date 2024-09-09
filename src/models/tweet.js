const mongoose = require('mongoose');

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
		type: [String],
		default:[]
	}
}, {
  timestamps: true,
});

const Tweet = mongoose.models?.Tweet || mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
