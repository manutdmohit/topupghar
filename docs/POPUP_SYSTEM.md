# Editable Popup System

This document describes the new editable popup system that allows administrators to customize the welcome popup that appears when users visit the website.

## Features

- **Editable Content**: Admins can modify title, message, features, and CTA button text
- **Display Settings**: Control when and how often the popup appears
- **Frequency Control**: Choose between once, daily, weekly, or always
- **Customizable Delay**: Set how long to wait before showing the popup
- **Active/Inactive Toggle**: Enable or disable the popup entirely
- **Real-time Preview**: See changes as you edit them

## Database Schema

The popup data is stored in a MongoDB collection with the following structure:

```typescript
interface Popup {
  title: string; // Popup title
  message: string; // Main message content
  features: string[]; // List of feature bullet points
  ctaText: string; // Call-to-action button text
  isActive: boolean; // Whether popup is enabled
  showDelay: number; // Delay before showing (in milliseconds)
  frequency: '2hours'; // Fixed to show every 2 hours
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### Public Endpoint

- `GET /api/popup` - Fetch current popup content for visitors

### Admin Endpoints

- `GET /api/admin/popup` - Fetch popup data for editing (requires admin auth)
- `PUT /api/admin/popup` - Update popup content (requires admin auth)

## Admin Interface

### Access

Navigate to `/admin/dashboard/popup` in the admin panel to access the popup management interface.

### Features

1. **Basic Settings**

   - Title: The main heading of the popup
   - Message: The descriptive text below the title
   - CTA Button Text: The text on the call-to-action button

2. **Features Management**

   - Add/remove feature bullet points
   - Each feature is displayed with a green dot icon

3. **Display Settings**

   - Show Delay: Time in milliseconds before the popup appears - Frequency: Fixed to show every 2 hours
   - Active Toggle: Enable/disable the popup

4. **Live Preview**
   - See exactly how the popup will look as you edit
   - Real-time updates as you type

## User Experience

### Frequency Logic

- **Fixed 2 Hours**: Popup shows every 2 hours based on timestamp comparison

### Storage

The system uses localStorage to track popup visibility:

- `hasSeenWelcomeModal`: Boolean flag for once frequency
- `lastModalShown`: Timestamp for daily/weekly frequency

## Setup Instructions

### 1. Database Setup

Run the seeding script to create the initial popup:

```bash
node scripts/seed-popup.js
```

### 2. Environment Variables

Ensure your `.env` file contains:

```
MONGODB_URI=your_mongodb_connection_string
```

### 3. Admin Access

Make sure you have admin privileges to access the popup management interface.

## Customization Examples

### Welcome Message

```
Title: "Welcome to Our Store! 🎉"
Message: "Discover amazing deals on gaming, streaming, and social media services. Get started today and enjoy instant delivery!"
```

### Features

- "🎮 Instant gaming top-ups"
- "📱 Social media boosts"
- "🎬 Streaming service subscriptions"
- "⚡ 24/7 customer support"

### CTA Button

```
"Start Shopping Now! 🚀"
```

## Technical Implementation

### Components

- `WelcomeModal.tsx` - The popup component that displays to users
- `PopupManagementPage.tsx` - Admin interface for editing popup content

### Models

- `Popup.ts` - MongoDB schema and model definition

### API Routes

- `/api/popup` - Public endpoint for fetching popup data
- `/api/admin/popup` - Admin endpoints for managing popup content

## Troubleshooting

### Popup Not Showing

1. Check if popup is active in admin settings
2. Verify frequency settings match your requirements
3. Check browser console for API errors
4. Ensure localStorage is enabled in the browser

### Admin Access Issues

1. Verify admin authentication
2. Check admin email in request headers
3. Ensure proper admin role permissions

### Content Not Updating

1. Clear browser cache
2. Check if changes were saved successfully
3. Verify API responses in network tab

## Future Enhancements

Potential improvements for the popup system:

- A/B testing capabilities
- Multiple popup variants
- Advanced targeting (user segments, time-based)
- Analytics and performance tracking
- Rich media support (images, videos)
- Custom CSS styling options
