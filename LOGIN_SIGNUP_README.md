# Login & Signup System

A full-stack authentication system with a React frontend and Express backend.

## Setup

### Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is taken)

## Features

- **Signup**: Create new account with email and password
- **Login**: Sign in with email and password
- **Dashboard**: Protected page showing user info after login
- **Token-based Auth**: JWT tokens stored in localStorage
- **Password Security**: Passwords hashed with bcryptjs
- **CORS Enabled**: Frontend and backend can communicate

## Project Structure

```
backend/
  index.js          - Express server with auth routes
  package.json      - Backend dependencies
  users.json        - User data storage (created on first signup)

frontend/
  src/
    App.jsx         - Main app with routing
    pages/
      Login.jsx     - Login form
      Signup.jsx    - Signup form
      Dashboard.jsx - Protected user dashboard
    styles/
      Auth.css      - Styling for login/signup
      Dashboard.css - Styling for dashboard
```

## API Endpoints

### `POST /api/signup`
Create a new account.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### `POST /api/login`
Log in with email and password.
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### `GET /api/me`
Get current user info (requires Bearer token).
```
Authorization: Bearer <token>
```

## Testing the Flow

1. Open http://localhost:5173
2. Click "Signup" and create an account
3. You'll be redirected to the Dashboard
4. Click "Logout" to go back to login
5. Log in with the credentials you created

## Notes

- Users are stored in `backend/users.json`
- Passwords are hashed using bcryptjs
- Tokens expire after 7 days
- The JWT secret is hardcoded for dev (change in production!)
