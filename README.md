# Antique Chatbot Application

An interactive chatbot application for antique goods shopping, built with Hono, React, and OpenAI integration.

## Features
- Interactive chat interface for antique goods inquiries
- Price negotiation capabilities
- Image upload for antique item discussion
- Real-time chat with AI-powered responses

## Tech Stack
- Backend: Node.js with Hono
- Frontend: React
- AI: OpenAI integration
- Database: MongoDB
- File Storage: Local filesystem

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with required environment variables:
   ```
   OPENAI_API_KEY=your_api_key
   MONGODB_URI=your_mongodb_uri
   PORT=3000
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   Then, open http://localhost:3000 in your browser.

## API Endpoints
- POST /api/chat - Send messages to chatbot
- POST /api/upload - Upload antique images
- GET /api/chat/history - Get chat history

## License
MIT
