import { NextRequest, NextResponse } from 'next/server';
import {
  sendOrderNotificationToAdmin,
  sendSimpleOrderNotification,
} from '@/lib/email-service';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { testType = 'html' } = body;

    const testOrderData = {
      orderId: 'TEST-20241201-123456-001',
      platform: 'Test Platform',
      type: 'Test Service',
      amount: '100',
      price: '50',
      customerName: 'Test Customer',
      customerPhone: '+1234567890',
      customerEmail: 'test@example.com',
      receiptUrl: 'https://example.com/test-receipt.jpg',
      createdAt: new Date(),
    };

    let result;

    if (testType === 'simple') {
      result = await sendSimpleOrderNotification(testOrderData);
    } else {
      result = await sendOrderNotificationToAdmin(testOrderData);
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully using ${testType} format`,
      data: result,
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send test email',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  return NextResponse.json({
    message:
      'Email test endpoint is available. Use POST with { "testType": "html" } or { "testType": "simple" }',
    availableTypes: ['html', 'simple'],
  });
};
