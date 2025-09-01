# Telegram Bot Integration Setup Guide

This guide will help you set up a Telegram bot to receive payment notifications from your TopUp Ghar application.

## Prerequisites

- A Telegram account
- Access to create a bot via @BotFather
- A Telegram channel or group where you want to receive notifications

## Step 1: Create a Telegram Bot

1. **Open Telegram** and search for `@BotFather`
2. **Start a chat** with BotFather
3. **Send the command**: `/newbot`
4. **Follow the prompts**:
   - Enter a name for your bot (e.g., "TopUp Ghar Notifications")
   - Enter a username for your bot (must end with 'bot', e.g., "topupghar_notifications_bot")
5. **Save the bot token** that BotFather provides (you'll need this later)

## Step 2: Create a Telegram Channel/Group

### Option A: Create a Channel

1. **Click the menu** (three lines) in Telegram
2. **Select "New Channel"**
3. **Enter channel name** (e.g., "TopUp Ghar Orders")
4. **Add description** (optional)
5. **Choose privacy** (Public or Private - Private is recommended for security)
6. **Add your bot as an admin**:
   - Go to channel settings
   - Click "Administrators"
   - Click "Add Admin"
   - Search for your bot username
   - Give it permission to "Post Messages"

### Option B: Use an Existing Group

1. **Add your bot to the group** as an admin
2. **Give it permission** to "Post Messages"

## Step 3: Get Channel/Group ID

1. **Send a message** in your channel/group
2. **Forward that message** to `@userinfobot`
3. **Note the chat ID** (it will be a negative number like `-1001234567890`)

## Step 4: Configure Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_personal_chat_id_here
TELEGRAM_GROUP_ID=your_channel_or_group_id_here
```

**Example:**

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
TELEGRAM_GROUP_ID=-1001234567890
```

**Note:** `TELEGRAM_CHAT_ID` is your personal chat ID (positive number) for individual notifications, while `TELEGRAM_GROUP_ID` is your channel/group ID (negative number) for group notifications.

## Step 5: Test the Integration

1. **Start your development server**:

   ```bash
   npm run dev
   ```

2. **Visit the test page**: `http://localhost:3000/admin/telegram-test`

3. **Test different notification types**:

   - **Payment Notification**: Tests sending detailed payment information
   - **Simple Notification**: Tests sending a simple text message
   - **Status Update**: Tests sending order status updates

4. **Check your Telegram channel/group** to see if messages are received

## Step 6: Verify Production Setup

When deploying to production:

1. **Set the environment variables** in your hosting platform
2. **Test the integration** using the test endpoint
3. **Monitor the logs** to ensure notifications are being sent

## Features

### Automatic Notifications

The bot will automatically send notifications for:

1. **New Payment Received**: When a customer submits a payment

   - Order details (ID, platform, type, amount, price)
   - Customer information (phone, email/UID)
   - Payment receipt link
   - Order timestamp

2. **Order Status Updates**: When orders are approved, rejected, or processing

   - Order ID
   - New status
   - Additional notes (if any)

3. **Wallet Top-up Requests**: When a user submits a wallet top-up request

   - Transaction details (ID, amount, payment method)
   - User information (email, name)
   - Payment receipt link
   - Transaction timestamp

4. **Wallet Top-up Status Updates**: When wallet top-ups are approved or rejected
   - Transaction ID
   - New status (approved/rejected)
   - Admin notes (if any)

### Message Format

The bot sends formatted HTML messages with:

- 📋 Order/Transaction details
- 👤 Customer/User information
- 📅 Order/Transaction timestamps
- 🧾 Receipt links
- 📊 Status updates
- 💰 Wallet top-up information

## Troubleshooting

### Common Issues

1. **"TELEGRAM_BOT_TOKEN not configured"**

   - Check that your environment variable is set correctly
   - Restart your development server after adding the variable

2. **"TELEGRAM_GROUP_ID not configured"**

   - Verify the channel/group ID is correct
   - Make sure it includes the negative sign for channels

3. **"Bot was blocked by the user"**

   - The bot needs to be an admin in the channel/group
   - Check bot permissions (must have "Post Messages" permission)

4. **Messages not appearing in channel**
   - Verify the bot is added as an admin
   - Check that the channel/group ID is correct
   - Ensure the bot has permission to post messages

### Testing

Use the test endpoints to verify your setup:

```bash
# Test payment notification
curl -X POST http://localhost:3000/api/test-telegram \
  -H "Content-Type: application/json" \
  -d '{"testType": "payment"}'

# Test simple notification
curl -X POST http://localhost:3000/api/test-telegram \
  -H "Content-Type: application/json" \
  -d '{"testType": "simple"}'

# Test status update
curl -X POST http://localhost:3000/api/test-telegram \
  -H "Content-Type: application/json" \
  -d '{"testType": "status"}'

# Test wallet top-up request
curl -X POST http://localhost:3000/api/test-telegram \
  -H "Content-Type: application/json" \
  -d '{"testType": "wallet-topup"}'

# Test wallet top-up approval
curl -X POST http://localhost:3000/api/test-telegram \
  -H "Content-Type: application/json" \
  -d '{"testType": "wallet-approval"}'

# Test wallet top-up rejection
curl -X POST http://localhost:3000/api/test-telegram \
  -H "Content-Type: application/json" \
  -d '{"testType": "wallet-rejection"}'
```

## Security Notes

- **Keep your bot token secret** - never commit it to version control
- **Use private channels/groups** for sensitive order information
- **Monitor bot access** - regularly check who has access to your channel
- **Consider rate limiting** - the bot has API limits, so monitor usage

## Support

If you encounter issues:

1. **Check the browser console** for error messages
2. **Check server logs** for detailed error information
3. **Verify environment variables** are set correctly
4. **Test with the provided test endpoints**

The integration is designed to be robust with fallback mechanisms, so even if Telegram notifications fail, your order processing will continue to work normally.
