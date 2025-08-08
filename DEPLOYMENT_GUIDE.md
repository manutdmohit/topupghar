# Deployment Guide - Hosting Outside Nepal

This guide will help you deploy your TopUp Ghar application to a hosting platform outside Nepal to avoid Telegram restrictions.

## 🎯 **Why Host Outside Nepal?**

- **Telegram is banned in Nepal** - API calls from Nepal will timeout/fail
- **Global accessibility** - Your app will work worldwide
- **Better performance** - Global CDN and edge networks
- **Reliable Telegram integration** - Bot will work from unrestricted regions

## 🚀 **Recommended Hosting Platforms**

### **1. Vercel (Best Choice)**

- ✅ **Free tier available**
- ✅ **Perfect for Next.js**
- ✅ **Global CDN**
- ✅ **Automatic deployments**
- ✅ **Easy environment variable setup**

### **2. Netlify**

- ✅ **Free tier available**
- ✅ **Global edge network**
- ✅ **Good for static sites**

### **3. Railway**

- ✅ **Good for full-stack apps**
- ✅ **Global deployment**
- ✅ **Easy database integration**

## 📋 **Pre-Deployment Checklist**

### **Environment Variables Required:**

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=your_admin_email

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
TELEGRAM_GROUP_ID=your_group_id

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 🚀 **Vercel Deployment Steps**

### **Step 1: Prepare Your Repository**

1. **Push your code to GitHub**
2. **Ensure all environment variables are documented**
3. **Test locally** (without Telegram for now)

### **Step 2: Deploy to Vercel**

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure project settings**

### **Step 3: Set Environment Variables**

1. **Go to Project Settings → Environment Variables**
2. **Add all required environment variables**
3. **Set them for Production, Preview, and Development**

### **Step 4: Deploy**

1. **Click "Deploy"**
2. **Wait for build to complete**
3. **Your app will be live at `https://your-project.vercel.app`**

## 🔧 **Post-Deployment Testing**

### **1. Test Telegram Connection**

Visit: `https://your-domain.vercel.app/api/test-telegram-connection`

### **2. Test Payment Notifications**

1. **Go to**: `https://your-domain.vercel.app/admin/telegram-test`
2. **Test all notification types**
3. **Check your Telegram channel/group**

### **3. Test Complete Order Flow**

1. **Create a test order**
2. **Verify Telegram notification is received**
3. **Check email notifications**

## 🌍 **Alternative Hosting Options**

### **Netlify Deployment**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build your project
npm run build

# Deploy
netlify deploy --prod
```

### **Railway Deployment**

1. **Connect GitHub repository**
2. **Set environment variables**
3. **Deploy automatically**

## 🔒 **Security Considerations**

### **Environment Variables**

- ✅ **Never commit secrets to Git**
- ✅ **Use hosting platform's secure environment variable system**
- ✅ **Rotate tokens regularly**

### **Domain Security**

- ✅ **Use HTTPS (automatic with Vercel/Netlify)**
- ✅ **Set up custom domain if needed**
- ✅ **Configure CORS properly**

## 📊 **Monitoring & Maintenance**

### **Health Checks**

- **Set up uptime monitoring**
- **Monitor Telegram API responses**
- **Check database connections**

### **Logs & Debugging**

- **Use hosting platform's logging**
- **Monitor API response times**
- **Set up error alerts**

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **Telegram still not working**

   - ✅ Check environment variables are set correctly
   - ✅ Verify bot token is valid
   - ✅ Ensure bot is admin in channel/group

2. **Database connection issues**

   - ✅ Check MongoDB URI format
   - ✅ Verify network access from hosting region
   - ✅ Check database user permissions

3. **Build failures**
   - ✅ Check for TypeScript errors
   - ✅ Verify all dependencies are in package.json
   - ✅ Check Node.js version compatibility

## 📞 **Support**

If you encounter issues:

1. **Check hosting platform documentation**
2. **Review deployment logs**
3. **Test individual components**
4. **Contact hosting platform support**

## 🎉 **Benefits After Deployment**

- ✅ **Telegram bot will work perfectly**
- ✅ **Global accessibility**
- ✅ **Better performance**
- ✅ **Automatic scaling**
- ✅ **Professional domain**
- ✅ **SSL certificates included**
- ✅ **CDN for faster loading**

Your TopUp Ghar application will be accessible worldwide and your Telegram bot will work flawlessly from the hosting platform's global infrastructure!
