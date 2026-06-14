'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_CONTACT_SETTINGS,
  type ContactSettingsDto,
} from '@/lib/contact-settings';

export function useContactSettings() {
  const [contactSettings, setContactSettings] =
    useState<ContactSettingsDto>(DEFAULT_CONTACT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchSettings() {
      try {
        const response = await fetch('/api/contact-settings');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load contact settings');
        }

        if (!cancelled && data.contactSettings) {
          setContactSettings(data.contactSettings);
        }
      } catch (error) {
        console.error('Failed to fetch contact settings:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  return { contactSettings, loading };
}
