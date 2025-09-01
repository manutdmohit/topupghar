const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID;

export interface PaymentDetails {
  orderId: string;
  platform: string;
  type: string;
  amount?: string | number;
  quantity?: number;
  price?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  receiptUrl: string;
  createdAt: Date;
  duration?: string;
  level?: string;
  diamonds?: number;
  storage?: string;
  uid?: string;
  phone: string;
  uid_email?: string;
  referredBy?: string;
  paymentMethod?: string;
  status: 'pending' | 'approved' | 'rejected';
  // Add promocode fields
  promocode?: string;
  originalPrice?: number;
  discountAmount?: number;
  finalPrice?: number;
}

export interface WalletTopupDetails {
  transactionId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  receiptUrl: string;
  createdAt: Date;
  status: 'pending' | 'completed' | 'cancelled';
  user?: {
    email: string;
    name: string;
  };
  notes?: string;
}

/**
 * Sends payment details to Telegram channel
 * @param paymentDetails - The payment/order details to send
 * @returns Promise with telegram sending result
 */
export async function sendPaymentDetailsToTelegram(
  paymentDetails: PaymentDetails
) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_GROUP_ID) {
      console.error('Telegram configuration is missing');
      throw new Error('Telegram configuration is missing');
    }

    // Format the message
    const message = formatPaymentMessage(paymentDetails);

    // Send to group
    const groupResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_GROUP_ID,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
        // Add timeout and retry configuration
        signal: AbortSignal.timeout(15000), // 15 second timeout
      }
    );

    if (!groupResponse.ok) {
      const error = await groupResponse.json();
      throw new Error(
        `Telegram API error: ${error.description || 'Unknown error'}`
      );
    }

    const result = await groupResponse.json();
    console.log('Payment details sent to Telegram successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending payment details to Telegram:', error);

    // Handle specific network errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(
          'Telegram request timed out. Please check your internet connection.'
        );
      }
      if (
        error.message.includes('fetch failed') ||
        error.message.includes('timeout')
      ) {
        throw new Error(
          'Network error: Unable to reach Telegram servers. Please check your internet connection.'
        );
      }
    }

    throw error;
  }
}

/**
 * Formats payment details into a readable Telegram message
 * @param paymentDetails - The payment details to format
 * @returns Formatted HTML message
 */
function formatPaymentMessage(paymentDetails: PaymentDetails): string {
  const {
    orderId,
    platform,
    type,
    amount,
    price,
    duration,
    level,
    diamonds,
    storage,
    uid,
    phone,
    uid_email,
    receiptUrl,
    referredBy,
    paymentMethod,
    createdAt,
    status,
  } = paymentDetails;

  const date = new Date(createdAt).toLocaleString('en-US', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let message = `🆕 <b>NEW PAYMENT RECEIVED</b> 🆕\n\n`;

  message += `📋 <b>Order Details:</b>\n`;
  message += `🆔 Order ID: <code>${orderId}</code>\n`;
  message += `📱 Platform: <b>${platform.toUpperCase()}</b>\n`;
  message += `🎯 Type: <b>${type.toUpperCase()}</b>\n`;

  if (amount) {
    message += `📊 Amount: <b>${amount}</b>\n`;
  }

  if (paymentDetails.quantity) {
    message += `🔢 Quantity: <b>${paymentDetails.quantity}</b>\n`;
  }

  if (price) {
    message += `💰 Price: <b>NPR ${Math.round(
      paymentDetails.finalPrice || price || 0
    )}</b>\n`;
  }

  // Add promocode information if applied
  if (paymentDetails.promocode) {
    message += `🎫 Promocode: <code>${paymentDetails.promocode}</code>\n`;
    message += `💸 Original Price: <s>NPR ${Math.round(
      paymentDetails.originalPrice || 0
    )}</s>\n`;
    message += `💰 Discount: <b>- NPR ${Math.round(
      paymentDetails.discountAmount || 0
    )}</b>\n`;
    message += `💳 Final Price: <b>NPR ${Math.round(
      paymentDetails.finalPrice || 0
    )}</b>\n`;
  }

  if (duration) {
    message += `⏱️ Duration: <b>${duration}</b>\n`;
  }

  if (level) {
    message += `📈 Level: <b>${level}</b>\n`;
  }

  if (diamonds) {
    message += `💎 Diamonds: <b>${diamonds}</b>\n`;
  }

  if (storage) {
    message += `💾 Storage: <b>${storage}</b>\n`;
  }

  message += `\n👤 <b>Customer Details:</b>\n`;

  if (uid_email) {
    message += `📧 Email/UID: <code>${uid_email}</code>\n`;
  } else if (uid) {
    message += `🆔 UID: <code>${uid}</code>\n`;
  }

  message += `📞 Phone: <code>${phone}</code>\n`;

  if (referredBy) {
    message += `👥 Referred By: <code>${referredBy}</code>\n`;
  }

  if (paymentMethod) {
    message += `💳 Payment Method: <b>${paymentMethod.toUpperCase()}</b>\n`;
  }

  message += `\n📅 <b>Order Info:</b>\n`;
  message += `🕐 Date: <b>${date}</b>\n`;
  message += `📊 Status: <b>${status.toUpperCase()}</b>\n`;

  message += `\n🧾 <b>Receipt:</b>\n`;
  message += `<a href="${receiptUrl}">View Payment Receipt</a>\n`;

  message += `\n⚠️ <i>Please process this order as soon as possible!</i>`;

  return message;
}

/**
 * Sends a simple notification message to Telegram
 * @param title - Message title
 * @param content - Message content
 * @returns Promise with telegram sending result
 */
export async function sendSimpleNotificationToTelegram(
  title: string,
  content: string
) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_GROUP_ID) {
      console.error('Telegram configuration is missing');
      throw new Error('Telegram configuration is missing');
    }

    const message = `🔔 <b>${title}</b>\n\n${content}`;

    const groupResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_GROUP_ID,
          text: message,
          parse_mode: 'HTML',
        }),
        // Add timeout configuration
        signal: AbortSignal.timeout(15000), // 15 second timeout
      }
    );

    if (!groupResponse.ok) {
      const error = await groupResponse.json();
      throw new Error(
        `Telegram API error: ${error.description || 'Unknown error'}`
      );
    }

    const result = await groupResponse.json();
    console.log('Simple notification sent to Telegram successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending simple notification to Telegram:', error);

    // Handle specific network errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(
          'Telegram request timed out. Please check your internet connection.'
        );
      }
      if (
        error.message.includes('fetch failed') ||
        error.message.includes('timeout')
      ) {
        throw new Error(
          'Network error: Unable to reach Telegram servers. Please check your internet connection.'
        );
      }
    }

    throw error;
  }
}

/**
 * Sends wallet top-up details to Telegram channel
 * @param topupDetails - The wallet top-up details to send
 * @returns Promise with telegram sending result
 */
export async function sendWalletTopupDetailsToTelegram(
  topupDetails: WalletTopupDetails
) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_GROUP_ID) {
      console.error('Telegram configuration is missing');
      throw new Error('Telegram configuration is missing');
    }

    // Format the message
    const message = formatWalletTopupMessage(topupDetails);

    // Send to group
    const groupResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_GROUP_ID,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
        // Add timeout and retry configuration
        signal: AbortSignal.timeout(15000), // 15 second timeout
      }
    );

    if (!groupResponse.ok) {
      const error = await groupResponse.json();
      throw new Error(
        `Telegram API error: ${error.description || 'Unknown error'}`
      );
    }

    const result = await groupResponse.json();
    console.log('Wallet top-up details sent to Telegram successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending wallet top-up details to Telegram:', error);

    // Handle specific network errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(
          'Telegram request timed out. Please check your internet connection.'
        );
      }
      if (
        error.message.includes('fetch failed') ||
        error.message.includes('timeout')
      ) {
        throw new Error(
          'Network error: Unable to reach Telegram servers. Please check your internet connection.'
        );
      }
    }

    throw error;
  }
}

/**
 * Formats wallet top-up details into a readable Telegram message
 * @param topupDetails - The wallet top-up details to format
 * @returns Formatted HTML message
 */
function formatWalletTopupMessage(topupDetails: WalletTopupDetails): string {
  const {
    transactionId,
    amount,
    paymentMethod,
    receiptUrl,
    createdAt,
    status,
    user,
    notes,
  } = topupDetails;

  const date = new Date(createdAt).toLocaleString('en-US', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const statusEmoji = {
    pending: '⏳',
    completed: '✅',
    cancelled: '❌',
  };

  const statusText = {
    pending: 'PENDING',
    completed: 'APPROVED',
    cancelled: 'REJECTED',
  };

  let message = `💰 <b>WALLET TOP-UP</b> 💰\n`;
  message += `${statusEmoji[status]} <b>${statusText[status]}</b> ${statusEmoji[status]}\n\n`;

  message += `📋 <b>Transaction Details:</b>\n`;
  message += `🆔 Transaction ID: <code>${transactionId}</code>\n`;
  message += `💰 Amount: <b>NPR ${amount}</b>\n`;
  message += `💳 Payment Method: <b>${paymentMethod.toUpperCase()}</b>\n`;
  message += `📅 Date: <b>${date}</b>\n`;

  if (user) {
    message += `\n👤 <b>User Information:</b>\n`;
    message += `📧 Email: <code>${user.email}</code>\n`;
    if (user.name) {
      message += `👤 Name: <b>${user.name}</b>\n`;
    }
  }

  if (notes) {
    message += `\n📝 <b>Notes:</b>\n`;
    message += `${notes}\n`;
  }

  message += `\n🧾 <b>Receipt:</b>\n`;
  message += `<a href="${receiptUrl}">View Receipt</a>\n`;

  return message;
}

/**
 * Sends wallet top-up status update to Telegram
 * @param transactionId - The transaction ID
 * @param status - The new status
 * @param additionalInfo - Any additional information
 * @returns Promise with telegram sending result
 */
export async function sendWalletTopupStatusUpdateToTelegram(
  transactionId: string,
  status: 'approved' | 'rejected',
  additionalInfo?: string
) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_GROUP_ID) {
      console.error('Telegram configuration is missing');
      throw new Error('Telegram configuration is missing');
    }

    const statusEmoji = {
      approved: '✅',
      rejected: '❌',
    };

    const statusText = {
      approved: 'APPROVED',
      rejected: 'REJECTED',
    };

    let message = `💰 <b>WALLET TOP-UP</b> 💰\n`;
    message += `${statusEmoji[status]} <b>${statusText[status]}</b> ${statusEmoji[status]}\n\n`;
    message += `🆔 Transaction ID: <code>${transactionId}</code>\n`;
    message += `📊 Status: <b>${statusText[status]}</b>\n`;

    if (additionalInfo) {
      message += `📝 Note: ${additionalInfo}\n`;
    }

    const groupResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_GROUP_ID,
          text: message,
          parse_mode: 'HTML',
        }),
        // Add timeout configuration
        signal: AbortSignal.timeout(15000), // 15 second timeout
      }
    );

    if (!groupResponse.ok) {
      const error = await groupResponse.json();
      throw new Error(
        `Telegram API error: ${error.description || 'Unknown error'}`
      );
    }

    const result = await groupResponse.json();
    console.log(
      'Wallet top-up status update sent to Telegram successfully:',
      result
    );
    return { success: true, data: result };
  } catch (error) {
    console.error(
      'Error sending wallet top-up status update to Telegram:',
      error
    );

    // Handle specific network errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(
          'Telegram request timed out. Please check your internet connection.'
        );
      }
      if (
        error.message.includes('fetch failed') ||
        error.message.includes('timeout')
      ) {
        throw new Error(
          'Network error: Unable to reach Telegram servers. Please check your internet connection.'
        );
      }
    }

    throw error;
  }
}

/**
 * Sends order status update to Telegram
 * @param orderId - The order ID
 * @param status - The new status
 * @param additionalInfo - Any additional information
 * @returns Promise with telegram sending result
 */
export async function sendOrderStatusUpdateToTelegram(
  orderId: string,
  status: 'approved' | 'rejected' | 'processing',
  additionalInfo?: string
) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_GROUP_ID) {
      console.error('Telegram configuration is missing');
      throw new Error('Telegram configuration is missing');
    }

    const statusEmoji = {
      approved: '✅',
      rejected: '❌',
      processing: '⏳',
    };

    const statusText = {
      approved: 'APPROVED',
      rejected: 'REJECTED',
      processing: 'PROCESSING',
    };

    let message = `${statusEmoji[status]} <b>ORDER STATUS UPDATE</b> ${statusEmoji[status]}\n\n`;
    message += `🆔 Order ID: <code>${orderId}</code>\n`;
    message += `📊 Status: <b>${statusText[status]}</b>\n`;

    if (additionalInfo) {
      message += `📝 Note: ${additionalInfo}\n`;
    }

    const groupResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_GROUP_ID,
          text: message,
          parse_mode: 'HTML',
        }),
        // Add timeout configuration
        signal: AbortSignal.timeout(15000), // 15 second timeout
      }
    );

    if (!groupResponse.ok) {
      const error = await groupResponse.json();
      throw new Error(
        `Telegram API error: ${error.description || 'Unknown error'}`
      );
    }

    const result = await groupResponse.json();
    console.log('Order status update sent to Telegram successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending order status update to Telegram:', error);

    // Handle specific network errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(
          'Telegram request timed out. Please check your internet connection.'
        );
      }
      if (
        error.message.includes('fetch failed') ||
        error.message.includes('timeout')
      ) {
        throw new Error(
          'Network error: Unable to reach Telegram servers. Please check your internet connection.'
        );
      }
    }

    throw error;
  }
}
