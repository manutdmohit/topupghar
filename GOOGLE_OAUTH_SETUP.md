# Google OAuth Setup Guide

This guide will help you set up Google OAuth for your Topup Ghar application.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "Topup Ghar")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your Google Cloud project, go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google Identity" and then "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:

   - User Type: External
   - App name: "Topup Ghar"
   - User support email: Your email
   - Developer contact information: Your email
   - Save and continue through the other sections

4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: "Topup Ghar Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
   - Click "Create"

## Step 4: Get Your Credentials

After creating the OAuth client, you'll see:

- **Client ID**: A long string ending with `.apps.googleusercontent.com`
- **Client Secret**: A secret string

## Step 5: Update Environment Variables

Add these to your `.env.local` file:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Go to `/admin/login`
3. Click "Sign in with Google"
4. You should be redirected to Google's consent screen
5. After authorization, you should be redirected back to your app

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**:

   - Make sure the redirect URI in Google Console exactly matches your callback URL
   - Check for trailing slashes or protocol mismatches

2. **"invalid_client" error**:

   - Verify your Client ID and Client Secret are correct
   - Make sure you're using the right credentials for your environment

3. **"access_denied" error**:
   - Check if your OAuth consent screen is properly configured
   - Ensure the Google+ API is enabled

### Security Notes:

- Never commit your `.env.local` file to version control
- Use different OAuth credentials for development and production
- Regularly rotate your Client Secret
- Monitor your OAuth usage in Google Cloud Console

## Production Deployment

When deploying to production:

1. Update the authorized origins and redirect URIs in Google Console
2. Use environment variables in your hosting platform
3. Ensure your domain uses HTTPS (required for OAuth)
4. Consider setting up domain verification in Google Console

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)
- [Google Cloud Console](https://console.cloud.google.com/)




