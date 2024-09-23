# Tweet

Tweet It is a Twitter-like application built using [Next.js](https://nextjs.org/) and [MongoDB](https://www.mongodb.com/). It allows users to create, like, and interact with tweets. The project also includes user authentication and a responsive user interface.

## Features

- **User Authentication**: Sign up and log in using secure authentication (via JWT ).
- **Create Tweets**: Authenticated users can post their tweets.
- **Like Tweets**: Users can like or unlike tweets.
- **Timeline Feed**: View tweets from all users in reverse chronological order.
- **Profile Page**: View a user’s details and Log out option.
- **Responsive Design**: Works on mobile, tablet, and desktop.

## Technologies Used

- **Next.js**: Server-side rendering and static site generation for the frontend.
- **MongoDB**: NoSQL database for storing user data and tweets.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT**: Creating and Verifying Tokens.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
  
## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) installed
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or a local MongoDB instance

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tharun-Kumar-A-01/tweet.git
   cd tweet
	 ```
   

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root of your project and add the following:
   ```bash
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/tweet-it?retryWrites=true&w=majority
   JWT_SECRET=your-jwt-secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building and Running in Production

To build and run the app in production mode:

```bash
npm run build
npm start
```

## API Endpoints

- **`/api/auth`**: Handles user authentication (sign up, log in).
- **`/api/tweets`**: API for creating, fetching, and liking tweets.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

<!-- ## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. -->
