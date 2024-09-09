const { Server } = require('socket.io');
const mongoose = require('mongoose');
const Tweet = require('./src/models/tweet');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: 'https://tweety-by-tharun.netlify.app'
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send old tweets on connection
  Tweet.find({})
    .sort({ createdAt: -1 }) // Sort by latest tweets
    .limit(10) // Limit to last 10 tweets
    .then((tweets) => {
      socket.emit('oldTweets', tweets);
    })
    .catch((error) => console.error(error));

  // Handle new tweet post requests
  socket.on('newTweet', async (data) => {
    try {
      const tweet = new Tweet({
        content: data.content,
        username: data.userId,
      });
      await tweet.save();

      // Emit the new tweet to all clients
      io.emit('newTweet', tweet);
    } catch (error) {
      console.error('Error saving tweet:', error);
    }
  });

  // Handle likes
  socket.on('likeTweet', async ({ tweetId, userId }) => {
    try {
      const tweet = await Tweet.findById(tweetId);

      if (tweet.likes.includes(userId)) {
        // Unlike
        tweet.likes = tweet.likes.filter((like) => like !== userId);
      } else {
        // Like
        tweet.likes.push(userId);
      }
      await tweet.save();

      // Emit updated tweet to all clients
      io.emit('updateTweet', tweet);
    } catch (error) {
      console.error('Error liking tweet:', error);
    }
  });

	socket.on('deleteTweet', async ({tweetId,userId}) => {
    try {
			const fetchTweet =  await Tweet.findById(tweetId);
			if(fetchTweet.username === userId) {
				const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
				if (deletedTweet) {
					io.emit('deleteTweet', tweetId); // Notify all clients about the deleted tweet
				}
			} else {
				throw new Error("username mismatch");
			}
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
