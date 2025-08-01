# VideoTube - A Full-Stack Video Streaming Platform

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/ojas-17/Video-Streaming-App)

VideoTube is a comprehensive, full-stack video streaming application inspired by YouTube. It is built with a modern technology stack, featuring a React frontend and a Node.js/Express backend. The platform allows users to register, upload, watch, and interact with video content through likes, comments, and subscriptions.

Demo: https://video-streaming-app-frontend-cyan.vercel.app/

## Features

- **User Authentication**: Secure user registration and login using JWT (Access and Refresh Tokens) and password hashing with bcrypt.
- **Video Management**: Users can upload videos with custom titles, descriptions, and thumbnails. They can also update or delete their own videos.
- **Video Playback**: A responsive video player powered by Video.js for a seamless viewing experience across devices.
- **Channel and Subscriptions**:
    - Each user has a personal channel page displaying their uploaded videos.
    - Users can subscribe to and unsubscribe from other channels.
    - A dedicated page to view content from all subscribed channels.
- **User Interaction**:
    - Like or unlike videos and comments.
    - Post, edit, and delete comments on videos.
- **Personalized Content**:
    - **Watch History**: Keeps track of all videos viewed by a logged-in user.
    - **Liked Videos**: A dedicated page to browse all videos a user has liked.
- **Content Discovery**:
    - **Search**: Find videos based on their titles.
    - **Trending Page**: Discover popular videos based on view counts.
- **Account Management**:
    - Users can update their full name, username, profile picture (avatar), and cover image.
    - Secure password change functionality.
- **UI/UX**:
    - A clean, modern, and responsive user interface built with Tailwind CSS.
    - Light and Dark mode themes.
    - Interactive pop-ups for user actions and notifications.

## Tech Stack

### Frontend (Client)
- **Framework**: React.js
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Video Player**: Video.js
- **Icons**: Font Awesome, React Icons

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Media Storage**: Cloudinary for video files, thumbnails, and user avatars.
- **File Uploads**: Multer
- **Middleware**: CORS, Cookie-Parser, MongooseAggregatePaginateV2

## Project Structure
The repository is organized into two main directories: `client` for the frontend application and `server` for the backend.

```
.
├── client/         # React frontend application
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/ # React components
│       ├── contexts/   # React context for state management
│       └── ...
└── server/         # Node.js/Express backend
    ├── public/
    └── src/
        ├── controllers/ # API logic
        ├── db/          # Database connection
        ├── middlewares/ # Express middlewares
        ├── models/      # Mongoose schemas
        ├── routes/      # API routes
        └── utils/       # Utility functions
```

## Local Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local instance or a cloud service like MongoDB Atlas)
- A [Cloudinary](https://cloudinary.com/) account for media storage.

### Backend Setup
1.  **Clone the repository:**
    ```sh
    git clone https://github.com/ojas-17/Video-Streaming-App.git
    cd Video-Streaming-App/server
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the `server` directory and add the following environment variables:
    ```env
    MONGODB_URI=<your_mongodb_connection_string>
    PORT=8000
    CORS_ORIGIN=http://localhost:5173
    
    ACCESS_TOKEN_SECRET=<your_access_token_secret>
    ACCESS_TOKEN_EXPIRY=1d
    
    REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
    REFRESH_TOKEN_EXPIRY=10d

    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    ```

4.  **Run the server:**
    ```sh
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (e.g., `http://localhost:8000`).

### Frontend Setup
1.  **Navigate to the client directory:**
    ```sh
    cd ../client
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```
    
3.  **Create a `.env` file** in the `client` directory and add your backend URL:
    ```env
    VITE_BACKEND_URL=http://localhost:8000/api/v1
    ```

4.  **Run the client:**
    ```sh
    npm run dev
    ```
    The React development server will start, typically on `http://localhost:5173`.
