import connectDB from '@/config/db';
import {
  ContactSettings,
  type IContactSettings,
} from '@/lib/models/ContactSettings';
import {
  DEFAULT_CONTACT_SETTINGS,
  type ContactSettingsDto,
} from '@/lib/contact-settings';

export function toContactSettingsDto(
  settings: IContactSettings | ContactSettingsDto,
): ContactSettingsDto {
  return {
    whatsapp: settings.whatsapp,
    telegram: settings.telegram,
    facebook: settings.facebook,
  };
}

export async function getContactSettings(): Promise<ContactSettingsDto> {
  await connectDB();

  let settings = await ContactSettings.findOne({ key: 'default' }).lean();

  if (!settings) {
    settings = await ContactSettings.create({
      key: 'default',
      ...DEFAULT_CONTACT_SETTINGS,
    });
  }

  return toContactSettingsDto(settings);
}

export async function updateContactSettings(
  input: ContactSettingsDto,
): Promise<ContactSettingsDto> {
  await connectDB();

  const whatsapp = input.whatsapp?.trim();
  const telegram = input.telegram?.trim();
  const facebook = input.facebook?.trim();

  if (!whatsapp || !telegram || !facebook) {
    throw new Error('WhatsApp, Telegram, and Facebook fields are required');
  }

  const settings = await ContactSettings.findOneAndUpdate(
    { key: 'default' },
    { whatsapp, telegram, facebook },
    { new: true, upsert: true, runValidators: true },
  );

  return toContactSettingsDto(settings);
}
