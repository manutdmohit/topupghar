# Environment Setup

This document outlines the required environment variables for the TopUp Ghar application.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Database Configuration

```env
MONGODB_URI=mongodb://localhost:27017/your-database-name
```

### Cloudinary Configuration (for image uploads)

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Resend Email Service (for order notifications)

```env
RESEND_API_KEY=your-resend-api-key
```

### Admin Email (optional)

```env
ADMIN_EMAIL=admin@yourdomain.com
```

If not set, defaults to `topup.ghar11@gmail.com`

### Next.js Configuration (if using NextAuth)

```env
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## Getting Started

1. Copy the variables above to your `.env.local` file
2. Replace the placeholder values with your actual credentials
3. Restart your development server after adding environment variables

## Email Service Setup

The application now includes automatic email notifications for new orders. When a customer places an order, the admin will receive a detailed email with:

- Order ID and details
- Customer information
- Payment receipt link (if uploaded)
- Processing instructions

The email service uses Resend and includes:

- Beautiful HTML email templates
- Fallback to simple text emails
- Error handling that doesn't affect order creation
- Automatic retry logic

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your API keys secure and rotate them regularly
- Use different API keys for development and production
