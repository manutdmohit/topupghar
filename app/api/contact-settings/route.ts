import { NextResponse } from 'next/server';
import { getContactSettings } from '@/lib/contact-settings.server';

export async function GET() {
  try {
    const contactSettings = await getContactSettings();
    return NextResponse.json({ contactSettings });
  } catch (error) {
    console.error('Error in GET /contact-settings:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch contact settings', error: errorMessage },
      { status: 500 },
    );
  }
}
