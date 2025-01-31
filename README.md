# Intellecta

Intellecta is an AI-powered learning assistant platform that helps users create personalized courses, generate flashcards, and track their learning progress.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- AI-powered course generation
- Flashcard creation from various file formats (PDF, DOCX, TXT)
- Spaced repetition system for efficient learning
- Progress tracking and learning analytics
- Personalized recommendations
- User authentication and authorization

## Technologies Used

### Frontend

- Vue.js 3
- Vue Router
- Axios
- Tailwind CSS
- ApexCharts
- vue3-toastify

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- OpenAI API for AI-powered features

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm && pnpm (v6 or later)
- MongoDB

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/TheAce74/intellecta.git
   cd intellecta
   ```

2. Install dependencies for both client and server:

   ```
   cd client
   pnpm install
   cd ../server
   pnpm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the `server` directory
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     OPENAI_API_KEY=your_openai_api_key
     GITHUB_TOKEN=your_github_access_token
     ```

4. Start the development servers:
   - For the client:
     ```
     cd client
     pnpm dev
     ```
   - For the server:
     ```
     cd server
     pnpm dev
     ```

## Usage

1. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).
2. Register a new account or log in if you already have one.
3. Use the navigation menu to access different features:
   - Course Generator: Create AI-generated courses on various subjects.
   - Flashcard Creator: Upload documents to generate flashcards automatically.
   - My Courses: View and manage your created courses.
   - Flashcard Review: Practice your flashcards using the spaced repetition system.
   - Recommendations: Get personalized course and flashcard recommendations.

## API Endpoints

- Authentication:

  - POST /api/auth/register - Register a new user
  - POST /api/auth/login - Log in a user
  - POST /api/auth/logout - Log out a user
  - GET /api/auth/user - Get current user information

- Courses:

  - POST /api/courses/generate - Generate a new course
  - POST /api/courses - Save a generated course
  - GET /api/courses - Get all courses for the current user
  - GET /api/courses/:id - Get a specific course
  - DELETE /api/courses/:id - Delete a course
  - POST /api/courses/progress - Update module progress

- Flashcards:

  - POST /api/flashcards/create - Create flashcards from uploaded file
  - POST /api/flashcards - Save flashcards
  - GET /api/flashcards - Get all flashcards for the current user
  - DELETE /api/flashcards/:id - Delete a flashcard
  - POST /api/flashcards/:id/review - Review a flashcard

- Study Time:

  - GET /api/study-time - Get study time data
  - POST /api/study-time - Add study time

- Recommendations:
  - GET /api/recommendations - Get personalized recommendations

## Contributing

We welcome contributions to Intellecta! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

Please make sure to follow the code style of the project.
