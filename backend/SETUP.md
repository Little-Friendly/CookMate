# Backend Authentication Setup

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database Configuration (update with your actual database URL)
DATABASE_URL="postgresql://username:password@localhost:5432/cookmate"
DIRECT_URL="postgresql://username:password@localhost:5432/cookmate"
```

## Database Setup

1. Make sure your database is running
2. Run the Prisma migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

## Starting the Backend

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:8080`

## API Endpoints

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info (requires auth token)

## Frontend Integration

The frontend is now configured to use the backend API instead of Supabase directly. Users will be stored in your local database and authenticated using JWT tokens.
