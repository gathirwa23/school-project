# Supabase Setup Guide

## Step 1: Create the Users Table in Supabase

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Go to your project
3. Click **SQL Editor** on the left sidebar
4. Click **New query** and paste this SQL:

```sql
create table users (
  id text primary key,
  email text unique not null,
  name text,
  password text not null,
  created_at timestamp default now()
);

-- Optional: Create an index for faster email lookups
create index idx_users_email on users(email);
```

5. Click **Run** to execute the query

## Step 2: Configure Backend Environment

1. Create a `.env` file in the `backend/` folder:

```
SUPABASE_URL=https://fladasxfssnhdpfdehmn.supabase.co
SUPABASE_KEY=sb_publishable_Z44r7LdZt-dOLedvKCCm6w_ExQvwyHJ
JWT_SECRET=your_secret_key_here
PORT=5000
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Start the server:
```bash
npm run dev
```

You should see:
```
✓ Connected to Supabase
✓ Auth server listening on http://localhost:5000
✓ Using Supabase at https://fladasxfssnhdpfdehmn.supabase.co
```

## Step 3: Test the API

### Signup
```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get User Info (requires token from login)
```bash
curl -X GET http://localhost:5000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Frontend - No Changes Needed

The frontend continues to work as-is! It still calls the same Express endpoints:
- `POST /api/signup`
- `POST /api/login`
- `GET /api/me`

The difference is that the backend now stores data in Supabase instead of a JSON file.

## Troubleshooting

**Error: "Could not verify users table"**
- Make sure you created the `users` table in Supabase SQL editor
- Check your SUPABASE_URL and SUPABASE_KEY are correct

**Error: "Invalid credentials" on login**
- Make sure the user exists in your Supabase `users` table
- Double-check email and password

**CORS errors in frontend**
- The backend has CORS enabled, so this shouldn't happen
- Make sure backend is running on `http://localhost:5000`

## View Users in Supabase

1. Go to your Supabase dashboard
2. Click **Table Editor** on the left
3. Select the `users` table
4. You'll see all signed-up users and their data

Note: Passwords are hashed with bcryptjs, so you won't see plain passwords.
