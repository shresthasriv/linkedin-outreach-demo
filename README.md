# LinkedIn Outreach Demo

AI-powered LinkedIn outreach application integrating Unipile API and OpenAI for personalized message generation.

## Architecture

```
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/          # Environment configuration
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.js      # LinkedIn OAuth flow
│   │   │   ├── profile.js   # Profile fetching
│   │   │   └── message.js   # Message generation & sending
│   │   ├── services/        # Business logic
│   │   │   ├── unipileService.js  # Unipile API integration
│   │   │   └── openaiService.js   # OpenAI integration
│   │   └── server.js        # Express server
├── frontend/                # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Route components
│   │   ├── context/         # Authentication state
│   │   ├── services/        # API client
│   │   └── types/           # TypeScript definitions
├── package.json             # Root scripts for development
└── .gitignore               # Git exclusions
```

## Setup Instructions (for local development)

### Prerequisites
- Node.js 18+
- npm or yarn
- Unipile API key
- OpenAI API key

### 1. Clone Repository
```bash
git clone https://github.com/shresthasriv/linkedin-outreach-demo.git
cd linkedin-outreach-demo
```

### 2. Install All Dependencies
```bash
npm run install:all
```
This installs dependencies for root, backend, and frontend.

### 3. Configure Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your API keys:
```env
PORT=5000
NODE_ENV=development

UNIPILE_API_KEY=your_unipile_api_key_here
UNIPILE_API_URL=https://api12.unipile.com:14284/api/v1

FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Start Development Servers
From the root directory:
```bash
npm run dev
```
This starts both backend and frontend concurrently.

**Alternative - Start Individually:**
```bash
# Backend only
npm run dev:backend

# Frontend only  
npm run dev:frontend
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Key Configuration

### Unipile API Key
1. Sign up at [unipile.com](https://www.unipile.com/)
2. Get your API key from the dashboard
3. Add to backend `.env` file as `UNIPILE_API_KEY`

### OpenAI API Key
- **Backend:** Not required (dynamic API key input)
- **Frontend:** Users enter their OpenAI API key in the UI
- Get key from [platform.openai.com](https://platform.openai.com/)

## Features

### Core Functionality
- **LinkedIn OAuth:** Secure authentication via Unipile's hosted flow
- **Profile Fetching:** Extract LinkedIn profile data (name, job title, company, industry)
- **AI Message Generation:** Personalized outreach messages using OpenAI GPT-4
- **Message Sending:** Send messages directly through LinkedIn
- **Responsive UI:** Clean interface built with Tailwind CSS

### Technical Features
- **Authentication State Management:** React Context API
- **Error Handling:** Comprehensive error states and user feedback
- **Rate Limiting:** Backend API protection
- **Security:** CORS, Helmet, environment variable protection
- **TypeScript:** Type-safe frontend development

## Implementation Process

### 1. Authentication Flow
- User clicks "Connect LinkedIn"
- Backend generates Unipile hosted OAuth URL
- User authenticates through Unipile's interface
- Unipile redirects to `/auth/success`
- Frontend polls for connected account
- Authentication state stored in React Context

### 2. Profile Workflow
- User enters LinkedIn profile URL
- Backend calls Unipile `/users/{identifier}` endpoint
- Profile data extracted and formatted
- Required fields displayed: name, job title, company, industry

### 3. Message Generation
- User's OpenAI API key captured in frontend
- Profile data sent to backend `/message/generate`
- OpenAI GPT-4 generates personalized message
- Message returned with copy functionality

### 4. Message Sending
- Generated or custom message prepared
- Backend calls Unipile `/chats` endpoint
- LinkedIn message sent via official API
- Success/error feedback displayed

### 5. API Integration
- **Unipile Service:** Handles OAuth, profile fetching, message sending
- **OpenAI Service:** Manages AI message generation with dynamic API keys
- **Express Routes:** Clean separation of concerns (auth, profile, message)
- **Frontend Services:** Axios-based API client with error handling

## Tech Stack

**Backend:**
- Node.js + Express
- Unipile API (LinkedIn integration)
- OpenAI API (message generation)
- Axios, CORS, Helmet

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS
- React Router
- Vite build tool
- Lucide React icons

**Development:**
- Concurrently (run both servers)
- Root package.json scripts

## Available Scripts

From root directory:
```bash
npm run dev           # Start both backend and frontend
npm run dev:backend   # Start backend only
npm run dev:frontend  # Start frontend only
npm run install:all   # Install all dependencies
npm run build         # Build frontend for production
npm start             # Start backend in production
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
UNIPILE_API_KEY=your_key_here
UNIPILE_API_URL=https://api12.unipile.com:14284/api/v1
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend
No environment file needed. OpenAI API key is input by users in the UI. 