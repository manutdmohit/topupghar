import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export interface OrderEmailData {
  orderId: string;
  platform: string;
  type: string;
  amount: string;
  price: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  receiptUrl?: string;
  createdAt: Date;
}

/**
 * Sends order details to admin via email
 * @param orderData - The order data to send
 * @returns Promise with email sending result
 */
export async function sendOrderNotificationToAdmin(orderData: OrderEmailData) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'topup.ghar11@gmail.com';

    const emailContent = generateOrderEmailContent(orderData);

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [adminEmail],
      subject: `New Order Received - ${orderData.orderId}`,
      html: emailContent,
    });

    if (error) {
      console.error('Resend email error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Order notification email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending order notification email:', error);
    throw error;
  }
}

/**
 * Generates HTML email content for order notification
 * @param orderData - The order data
 * @returns HTML string for the email
 */
function generateOrderEmailContent(orderData: OrderEmailData): string {
  const formattedDate = new Date(orderData.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #8b5cf6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #8b5cf6;
          margin: 0;
          font-size: 24px;
        }
        .order-id {
          background-color: #f3f4f6;
          padding: 10px;
          border-radius: 5px;
          font-family: monospace;
          font-weight: bold;
          color: #8b5cf6;
          text-align: center;
          margin: 20px 0;
        }
        .order-details {
          background-color: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: bold;
          color: #6b7280;
        }
        .value {
          color: #111827;
        }
        .receipt-section {
          margin-top: 20px;
          text-align: center;
        }
        .receipt-link {
          display: inline-block;
          background-color: #8b5cf6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin-top: 10px;
        }
        .receipt-link:hover {
          background-color: #7c3aed;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .urgent {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .urgent h3 {
          color: #d97706;
          margin: 0 0 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 New Order Received!</h1>
          <p>A new order has been placed on TopUp Ghar</p>
        </div>

        <div class="order-id">
          Order ID: ${orderData.orderId}
        </div>

        <div class="urgent">
          <h3>⚠️ Action Required</h3>
          <p>Please process this order as soon as possible. Customer is waiting for their service.</p>
        </div>

        <div class="order-details">
          <h3>📋 Order Details</h3>
          
          <div class="detail-row">
            <span class="label">Platform:</span>
            <span class="value">${orderData.platform}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Service Type:</span>
            <span class="value">${orderData.type}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Amount:</span>
            <span class="value">${orderData.amount}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Price:</span>
            <span class="value">₹${orderData.price}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Order Date:</span>
            <span class="value">${formattedDate}</span>
          </div>
          
          ${
            orderData.customerName
              ? `
          <div class="detail-row">
            <span class="label">Customer Name:</span>
            <span class="value">${orderData.customerName}</span>
          </div>
          `
              : ''
          }
          
          ${
            orderData.customerPhone
              ? `
          <div class="detail-row">
            <span class="label">Customer Phone:</span>
            <span class="value">${orderData.customerPhone}</span>
          </div>
          `
              : ''
          }
          
          ${
            orderData.customerEmail
              ? `
          <div class="detail-row">
            <span class="label">Customer Email:</span>
            <span class="value">${orderData.customerEmail}</span>
          </div>
          `
              : ''
          }
        </div>

        ${
          orderData.receiptUrl
            ? `
        <div class="receipt-section">
          <h3>📄 Payment Receipt</h3>
          <p>Customer has uploaded a payment receipt. Please verify the payment before processing the order.</p>
          <a href="${orderData.receiptUrl}" class="receipt-link" target="_blank">
            View Receipt
          </a>
        </div>
        `
            : ''
        }

        <div class="footer">
          <p>This is an automated notification from TopUp Ghar</p>
          <p>Please process this order promptly to maintain customer satisfaction.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends a simple text email as fallback
 * @param orderData - The order data to send
 * @returns Promise with email sending result
 */
export async function sendSimpleOrderNotification(orderData: OrderEmailData) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'topup.ghar11@gmail.com';

    const { data, error } = await resend.emails.send({
      from: 'TopUp Ghar <noreply@topupghar.com>',
      to: [adminEmail],
      subject: `New Order - ${orderData.orderId}`,
      text: `
New Order Received!

Order ID: ${orderData.orderId}
Platform: ${orderData.platform}
Type: ${orderData.type}
Amount: ${orderData.amount}
Price: ₹${orderData.price}
Date: ${new Date(orderData.createdAt).toLocaleString()}

${orderData.customerName ? `Customer: ${orderData.customerName}` : ''}
${orderData.customerPhone ? `Phone: ${orderData.customerPhone}` : ''}
${orderData.customerEmail ? `Email: ${orderData.customerEmail}` : ''}

Please process this order as soon as possible.
      `,
    });

    if (error) {
      console.error('Resend email error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Simple order notification email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending simple order notification email:', error);
    throw error;
  }
}
