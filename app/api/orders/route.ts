import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Order from '@/models/Order';
import Promocode from '@/lib/models/Promocode';
import connectDB from '@/config/db';
import { Wallet, WalletTransaction } from '@/models/Wallet';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import {
  sendOrderNotificationToAdmin,
  sendSimpleOrderNotification,
} from '@/lib/email-service';
import {
  sendPaymentDetailsToTelegram,
  sendSimpleNotificationToTelegram,
} from '@/lib/telegram-service';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to upload image to Cloudinary
async function uploadImage(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'topupghar-receipts', // Optional: organize uploads
      },
      (err: any, result: UploadApiResponse | undefined) => {
        if (err) {
          console.error('Cloudinary Error:', err);
          return reject(new Error('Image upload failed.'));
        }
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Cloudinary did not return a result.'));
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export const POST = async (req: NextRequest) => {
  try {
    await connectDB(); // Ensure database connection is established

    // Get user session for authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: 'Authentication required. Please log in to create an order.',
        },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const receipt = formData.get('receipt') as File | null;
    const paymentMethod = formData.get('paymentMethod') as string;

    // Prepare order data from form fields
    const orderData: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      if (key !== 'receipt') {
        // Exclude the file itself from the order data object
        orderData[key] = value;
      }
    });

    // Handle wallet payments (no receipt required)
    if (paymentMethod === 'wallet') {
      // For wallet payments, we'll process the payment immediately
      // No receipt upload needed
    } else if (!receipt) {
      return NextResponse.json(
        { message: 'Receipt image is required for non-wallet payments.' },
        { status: 400 }
      );
    } else {
      // Upload receipt to Cloudinary for non-wallet payments
      const uploadResult = (await uploadImage(receipt)) as UploadApiResponse;
      orderData.receiptUrl = uploadResult.secure_url;
    }

    // Add userId to order data
    orderData.userId = session.user.id;

    // Handle promocode if provided
    // The price from the form is the base price per unit
    const basePricePerUnit = parseFloat(orderData.price || '0');
    const quantity = parseInt(orderData.quantity || '1');

    // Calculate total prices with quantity
    let finalPrice = basePricePerUnit * quantity;
    let originalPrice = parseFloat(
      orderData.originalPrice || (basePricePerUnit * quantity).toString()
    );
    let discountAmount = 0;
    let appliedPromocode = null;

    console.log('Order creation debug:', {
      userId: session.user.id,
      receivedPrice: orderData.price,
      receivedOriginalPrice: orderData.originalPrice,
      quantity: quantity,
      basePricePerUnit: basePricePerUnit,
      calculatedOriginalPrice: originalPrice,
      calculatedFinalPrice: finalPrice,
      receivedPromocode: orderData.promocode,
    });

    if (orderData.promocode && orderData.promocode.trim()) {
      try {
        // Find and validate the promocode
        const promocode = await Promocode.findOne({
          name: orderData.promocode.toUpperCase(),
        });

        if (
          promocode &&
          promocode.isActive &&
          new Date() < promocode.expiry &&
          promocode.usedCount < promocode.maxCount
        ) {
          // Determine the base price for promocode calculation
          // Use the current final price (which includes quantity) for promocode calculation
          const basePriceForPromocode = finalPrice;

          // Calculate promocode discount on the quantity-adjusted price
          const promocodeDiscountAmount =
            (basePriceForPromocode * promocode.discountPercentage) / 100;
          finalPrice = basePriceForPromocode - promocodeDiscountAmount;
          discountAmount = promocodeDiscountAmount;
          appliedPromocode = promocode.name;

          // Increment usage count
          await Promocode.findByIdAndUpdate(promocode._id, {
            $inc: { usedCount: 1 },
          });
        }
      } catch (error) {
        console.error('Error processing promocode:', error);
        // Continue without promocode if there's an error
      }
    } else {
      // No promocode applied, use the quantity-adjusted price
      finalPrice = basePricePerUnit * quantity;
    }

    // Create a new order with the Cloudinary URL and promocode data
    const newOrder = new Order({
      ...orderData,
      receiptUrl:
        paymentMethod === 'wallet' ? 'wallet-payment' : orderData.receiptUrl,
      promocode: appliedPromocode,
      originalPrice: originalPrice,
      discountAmount: Math.round(discountAmount),
      finalPrice: Math.round(finalPrice),
    });

    await newOrder.save();

    // Process wallet payment if selected
    if (paymentMethod === 'wallet') {
      try {
        // Get user wallet and check balance
        const wallet = await Wallet.findOne({ userId: session.user.id });
        console.log('Wallet lookup result:', {
          userId: session.user.id,
          wallet: wallet
            ? { balance: wallet.balance, totalSpent: wallet.totalSpent }
            : null,
        });

        if (!wallet) {
          // Create wallet if it doesn't exist
          const newWallet = new Wallet({
            userId: session.user.id,
            balance: 0,
            totalTopups: 0,
            totalSpent: 0,
            isActive: true,
          });
          await newWallet.save();

          // Delete the order since wallet creation failed
          await Order.findByIdAndDelete(newOrder._id);
          return NextResponse.json(
            {
              message: 'Wallet not found. Please top up your wallet first.',
            },
            { status: 400 }
          );
        }

        // Check if wallet has sufficient balance
        const requiredAmount = Math.round(finalPrice);
        console.log('Balance check:', {
          walletBalance: wallet.balance,
          requiredAmount,
          isSufficient: wallet.balance >= requiredAmount,
        });

        if (wallet.balance < requiredAmount) {
          // Delete the order since balance is insufficient
          await Order.findByIdAndDelete(newOrder._id);
          return NextResponse.json(
            {
              message: `Insufficient wallet balance. You have NPR ${wallet.balance} but need NPR ${requiredAmount}. Please top up your wallet.`,
            },
            { status: 400 }
          );
        }

        // Create payment transaction
        const paymentTransaction = new WalletTransaction({
          userId: session.user.id,
          type: 'payment',
          amount: -requiredAmount, // Negative amount for payments
          balance: wallet.balance - requiredAmount,
          description: `Payment for order ${newOrder.orderId}`,
          status: 'completed',
          orderId: newOrder.orderId,
        });

        // Update wallet balance
        wallet.balance -= requiredAmount;
        wallet.totalSpent += requiredAmount;
        wallet.lastTransactionDate = new Date();

        // Update order status and payment method
        newOrder.status = 'pending'; // Set as pending for admin review
        newOrder.paymentMethod = 'wallet';

        // Save all changes in a transaction
        try {
          await Promise.all([
            paymentTransaction.save(),
            wallet.save(),
            newOrder.save(),
          ]);
        } catch (saveError) {
          console.error('Error saving wallet payment data:', saveError);
          throw new Error(
            `Failed to save wallet payment: ${
              saveError instanceof Error ? saveError.message : 'Unknown error'
            }`
          );
        }

        console.log('Wallet payment processed successfully:', {
          orderId: newOrder.orderId,
          amount: requiredAmount,
          newBalance: wallet.balance,
        });

        // Add note about pending status
        newOrder.adminNotes =
          'Wallet payment processed. Order pending admin review.';
      } catch (error) {
        // If wallet payment fails, delete the order
        await Order.findByIdAndDelete(newOrder._id);
        console.error('Wallet payment error details:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace',
          userId: session.user.id,
          orderId: newOrder.orderId,
          amount: Math.round(finalPrice),
          timestamp: new Date().toISOString(),
        });
        return NextResponse.json(
          {
            message: `Wallet payment failed: ${
              error instanceof Error ? error.message : 'Unknown error'
            }. Please try again or use a different payment method.`,
          },
          { status: 400 }
        );
      }
    }

    // Send email notification to admin
    try {
      const emailData = {
        orderId: newOrder.orderId,
        userId: newOrder.userId, // Include userId in notifications
        platform: newOrder.platform,
        type: newOrder.type,
        amount: newOrder.amount,
        quantity: newOrder.quantity,
        price: newOrder.finalPrice,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        customerEmail: newOrder.customerEmail,
        receiptUrl: newOrder.receiptUrl,
        createdAt: newOrder.createdAt,
        // Additional fields for consistency with telegram
        duration: newOrder.duration,
        level: newOrder.level,
        diamonds: newOrder.diamonds,
        storage: newOrder.storage,
        uid: newOrder.uid,
        phone: newOrder.phone,
        uid_email: newOrder.uid_email,
        referredBy: newOrder.referredBy,
        paymentMethod: newOrder.paymentMethod,
        status: newOrder.status,
        // Add promocode fields
        promocode: newOrder.promocode,
        originalPrice: newOrder.originalPrice,
        discountAmount: newOrder.discountAmount,
        finalPrice: newOrder.finalPrice,
      };

      // Try to send HTML email first, fallback to simple text email
      try {
        await sendOrderNotificationToAdmin(emailData);
        console.log('HTML email notification sent successfully');
      } catch (emailError) {
        console.warn('HTML email failed, trying simple email:', emailError);
        await sendSimpleOrderNotification(emailData);
        console.log('Simple email notification sent successfully');
      }
    } catch (emailError) {
      // Log email error but don't fail the order creation
      console.error('Failed to send email notification:', emailError);
    }

    // Send Telegram notification
    try {
      const telegramData = {
        orderId: newOrder.orderId,
        userId: newOrder.userId, // Include userId in notifications
        platform: newOrder.platform,
        type: newOrder.type,
        amount: newOrder.amount,
        quantity: newOrder.quantity,
        price: newOrder.finalPrice,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        customerEmail: newOrder.customerEmail,
        receiptUrl: newOrder.receiptUrl,
        createdAt: newOrder.createdAt,
        // Additional fields for consistency with email
        duration: newOrder.duration,
        level: newOrder.level,
        diamonds: newOrder.diamonds,
        storage: newOrder.storage,
        uid: newOrder.uid,
        phone: newOrder.phone,
        uid_email: newOrder.uid_email,
        referredBy: newOrder.referredBy,
        paymentMethod: newOrder.paymentMethod,
        status: newOrder.status,
        // Add promocode fields
        promocode: newOrder.promocode,
        originalPrice: newOrder.originalPrice,
        discountAmount: newOrder.discountAmount,
        finalPrice: newOrder.finalPrice,
      };

      await sendPaymentDetailsToTelegram(telegramData);
      console.log('Telegram notification sent successfully');
    } catch (telegramError) {
      // Log telegram error but don't fail the order creation
      console.error('Failed to send Telegram notification:', telegramError);

      // Try to send a simple notification as fallback
      try {
        await sendSimpleNotificationToTelegram(
          'New Payment Received',
          `Order ID: ${newOrder.orderId}\nPlatform: ${newOrder.platform}\nType: ${newOrder.type}\nPrice: NPR ${newOrder.finalPrice}`
        );
        console.log('Simple Telegram notification sent as fallback');
      } catch (fallbackError) {
        console.error(
          'Failed to send fallback Telegram notification:',
          fallbackError
        );
      }
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error in POST /orders:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to create order', error: errorMessage },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectDB(); // Ensure database connection is established

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const platform = searchParams.get('platform') || '';

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (platform) filter.platform = { $regex: platform, $options: 'i' };

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    // Get orders with pagination
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (error) {
    console.error('Error in GET /orders:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch orders', error: errorMessage },
      { status: 500 }
    );
  }
};
