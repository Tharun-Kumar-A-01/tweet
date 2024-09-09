const express = require('express');
const next = require('next');
const http = require('http');
const Tweet = require("./src/models/tweet")
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config(); // Ensure environment variables are loaded

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

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
 // Next.js handling
 server.all('*', (req, res) => {
	return handle(req, res);
});

const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
	console.log(`> Ready on http://localhost:${port}`);
});
});