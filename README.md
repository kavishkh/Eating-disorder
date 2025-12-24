# Eating Disorder Recovery App - MongoDB Backend

This application has been migrated from Firebase to MongoDB with Express backend.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB installation)

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb+srv://kavishkhanna06_db_user:Eatingdisorder12@cluster0.mhogpcx.mongodb.net/eating-disorder?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
VITE_API_URL=http://localhost:5000/api
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server (runs both backend and frontend):
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:5173 (or next available port)

### Available Scripts

- `npm run dev` - Run both backend and frontend concurrently
- `npm run server` - Run only the backend server
- `npm run client` - Run only the frontend
- `npm run build` - Build the frontend for production

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Moods
- `GET /api/moods` - Get all mood entries (requires auth)
- `GET /api/moods/recent/:days` - Get recent mood entries (requires auth)
- `GET /api/moods/today` - Check if mood recorded today (requires auth)
- `POST /api/moods` - Create mood entry (requires auth)
- `PUT /api/moods/:id` - Update mood entry (requires auth)
- `DELETE /api/moods/:id` - Delete mood entry (requires auth)

### Goals
- `GET /api/goals` - Get all goals (requires auth)
- `POST /api/goals` - Create goal (requires auth)
- `PUT /api/goals/:id` - Update goal (requires auth)
- `DELETE /api/goals/:id` - Delete goal (requires auth)

### Chat
- `GET /api/chat` - Get chat history (requires auth)
- `POST /api/chat` - Save chat message (requires auth)
- `DELETE /api/chat` - Clear chat history (requires auth)

### Progress
- `GET /api/progress` - Get progress metrics (requires auth)

## Database Schema

### User
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  name: String,
  goals: [String],
  disorder: String,
  registrationDate: Date,
  onboardingCompleted: Boolean,
  lastActivity: String,
  moodEntries: Number,
  progressMetrics: {
    completedGoals: Number,
    totalGoals: Number,
    streakDays: Number,
    lastActiveDate: String
  }
}
```

### MoodEntry
```javascript
{
  userId: ObjectId (ref: User),
  date: String,
  mood: Number (1-5),
  note: String,
  timestamp: String
}
```

### Goal
```javascript
{
  userId: ObjectId (ref: User),
  text: String,
  completed: Boolean,
  completedAt: String
}
```

### ChatMessage
```javascript
{
  userId: ObjectId (ref: User),
  content: String,
  isUser: Boolean,
  timestamp: Date
}
```

## Migration from Firebase

The app has been fully migrated from Firebase to MongoDB:
- ✅ Firebase Authentication → JWT-based authentication
- ✅ Firestore → MongoDB with Mongoose
- ✅ All service files updated to use REST API
- ✅ Offline support maintained with localStorage
- ✅ Network status monitoring preserved

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- All API endpoints (except auth) require authentication
- CORS is enabled for frontend access
- Environment variables should never be committed to version control
