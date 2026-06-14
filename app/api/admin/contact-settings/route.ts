import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import {
  getContactSettings,
  updateContactSettings,
} from '@/lib/contact-settings.server';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const contactSettings = await getContactSettings();
    return NextResponse.json({ contactSettings });
  } catch (error) {
    console.error('Error in GET /admin/contact-settings:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch contact settings', error: errorMessage },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const contactSettings = await updateContactSettings({
      whatsapp: body.whatsapp,
      telegram: body.telegram,
      facebook: body.facebook,
    });

    return NextResponse.json({
      message: 'Contact settings updated successfully',
      contactSettings,
    });
  } catch (error) {
    console.error('Error in PUT /admin/contact-settings:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: errorMessage || 'Failed to update contact settings' },
      { status: 400 },
    );
  }
}
