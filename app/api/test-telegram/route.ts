import { NextRequest, NextResponse } from 'next/server';
import {
  sendPaymentDetailsToTelegram,
  sendSimpleNotificationToTelegram,
  sendOrderStatusUpdateToTelegram,
} from '@/lib/telegram-service';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { testType = 'payment' } = body;

    let result;

    switch (testType) {
      case 'payment':
        const testPaymentData = {
          orderId: 'TEST-20241201-123456-001',
          platform: 'instagram',
          type: 'followers',
          amount: '1000',
          price: 500,
          uid: 'test_user_123',
          phone: '+977-9841234567',
          uid_email: 'test@example.com',
          receiptUrl: 'https://example.com/test-receipt.jpg',
          referredBy: 'test_referral',
          createdAt: new Date(),
          status: 'pending' as const,
        };
        result = await sendPaymentDetailsToTelegram(testPaymentData);
        break;

      case 'simple':
        result = await sendSimpleNotificationToTelegram(
          'Test Notification',
          'This is a test notification from your TopUp Ghar bot!'
        );
        break;

      case 'status':
        result = await sendOrderStatusUpdateToTelegram(
          'TEST-20241201-123456-001',
          'approved',
          'Order processed successfully'
        );
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid test type. Use: payment, simple, or status',
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Test ${testType} sent to Telegram successfully`,
      data: result,
    });
  } catch (error) {
    console.error('Test Telegram error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send test to Telegram',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  return NextResponse.json({
    message: 'Telegram test endpoint',
    usage: {
      POST: {
        description: 'Test Telegram notifications',
        body: {
          testType: 'payment | simple | status',
        },
        examples: [
          'POST /api/test-telegram with { "testType": "payment" }',
          'POST /api/test-telegram with { "testType": "simple" }',
          'POST /api/test-telegram with { "testType": "status" }',
        ],
      },
    },
  });
};
