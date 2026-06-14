export type ContactSettingsDto = {
  whatsapp: string;
  telegram: string;
  facebook: string;
};

export const DEFAULT_CONTACT_SETTINGS: ContactSettingsDto = {
  whatsapp: '+35795676054',
  telegram: '+35795676054',
  facebook: 'https://www.facebook.com/share/1HaEjS42Er/?mibextid=wwXIfr',
};

export function getWhatsAppUrl(
  whatsapp: string,
  message = 'Hi, I need help with my order',
) {
  const digits = whatsapp.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function getTelegramUrl(telegram: string) {
  const handle = telegram.trim().replace(/^@/, '');
  if (handle.startsWith('+') || /^\d/.test(handle)) {
    return `https://t.me/${handle.startsWith('+') ? handle : `+${handle.replace(/\D/g, '')}`}`;
  }
  return `https://t.me/${handle}`;
}

export function openContactLink(
  type: 'whatsapp' | 'telegram' | 'facebook',
  settings: ContactSettingsDto,
) {
  switch (type) {
    case 'whatsapp':
      window.open(getWhatsAppUrl(settings.whatsapp), '_blank');
      break;
    case 'telegram':
      window.open(getTelegramUrl(settings.telegram), '_blank');
      break;
    case 'facebook':
      window.open(settings.facebook, '_blank');
      break;
  }
}
