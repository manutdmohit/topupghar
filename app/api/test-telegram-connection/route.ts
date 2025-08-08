import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function GET() {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          message: 'TELEGRAM_BOT_TOKEN not configured',
          error: 'Missing environment variable',
        },
        { status: 400 }
      );
    }

    // Test basic connectivity to Telegram API
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        {
          success: false,
          message: 'Telegram API test failed',
          error: error.description || 'Unknown error',
          statusCode: response.status,
        },
        { status: 400 }
      );
    }

    const botInfo = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Telegram API connection successful',
      botInfo: {
        id: botInfo.result.id,
        name: botInfo.result.first_name,
        username: botInfo.result.username,
        canJoinGroups: botInfo.result.can_join_groups,
        canReadAllGroupMessages: botInfo.result.can_read_all_group_messages,
      },
    });
  } catch (error) {
    console.error('Telegram connection test error:', error);
    
    let errorMessage = 'Unknown error occurred';
    let errorType = 'unknown';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your internet connection.';
        errorType = 'timeout';
      } else if (error.message.includes('fetch failed') || error.message.includes('timeout')) {
        errorMessage = 'Network error: Unable to reach Telegram servers. Please check your internet connection.';
        errorType = 'network';
      } else {
        errorMessage = error.message;
        errorType = 'other';
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Telegram API connection test failed',
        error: errorMessage,
        errorType: errorType,
      },
      { status: 500 }
    );
  }
}
