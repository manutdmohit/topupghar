# User Model Setup Guide

## Overview

This guide explains how to set up the User model with admin credentials for the Topup Ghar application.

## User Model Features

### Fields

- **email** (required, unique): User's email address with validation
- **password** (required): Hashed password with minimum 6 characters
- **role** (enum): Either 'user' or 'admin', defaults to 'user'
- **isActive** (boolean): Account status, defaults to true
- **createdAt/updatedAt**: Automatic timestamps

### Security Features

- Password hashing using bcryptjs with salt rounds of 12
- Password comparison method for authentication
- Password excluded from JSON responses
- Email validation with regex pattern
- Unique email constraint

## Admin User Setup

### Prerequisites

1. MongoDB connection string in environment variables
2. Required dependencies installed:
   ```bash
   npm install bcryptjs mongoose
   npm install -D @types/bcryptjs
   ```

### Environment Variables

Add to your `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/gameshop
# or your MongoDB Atlas connection string
```

### Creating Admin User

#### Method 1: Using the Script (Recommended)

Run the provided script to create the admin user:

```bash
npm run create-admin
```

This will create an admin user with:

- **Email**: admin@topupghar.com
- **Password**: Admin@123456
- **Role**: admin

#### Method 2: Manual Creation

You can also create the admin user manually by calling the registration API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@topupghar.com",
    "password": "Admin@123456"
  }'
```

Then update the user role to admin in your database.

## API Endpoints

### Authentication Endpoints

#### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@topupghar.com",
  "password": "Admin@123456"
}
```

#### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## Usage Examples

### Login Component

```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      // Handle successful login
      console.log('Logged in user:', data.user);
    } else {
      // Handle error
      console.error('Login failed:', data.error);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### Admin Validation

```typescript
const isAdmin = user.role === 'admin' && user.isActive;
```

## Security Notes

1. **Change Default Password**: Always change the default admin password after first login
2. **Environment Variables**: Never commit sensitive credentials to version control
3. **Password Requirements**: Ensure passwords meet minimum security requirements
4. **Rate Limiting**: Consider implementing rate limiting on auth endpoints
5. **Session Management**: Implement proper session management for production

## Database Schema

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Check your MONGODB_URI environment variable
   - Ensure MongoDB is running
   - Verify network connectivity

2. **Password Hashing Issues**

   - Ensure bcryptjs is properly installed
   - Check for TypeScript compilation errors

3. **Email Validation Errors**
   - Verify email format matches the regex pattern
   - Check for duplicate email addresses

### Debug Commands

```bash
# Check if admin user exists
npm run create-admin

# Test database connection
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));
"
```
