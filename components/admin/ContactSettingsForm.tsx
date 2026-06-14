'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MessageCircle, Facebook, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DEFAULT_CONTACT_SETTINGS } from '@/lib/contact-settings';

export function ContactSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_CONTACT_SETTINGS);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/admin/contact-settings');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load contact settings');
        }

        setFormData(data.contactSettings);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to load contact settings',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/contact-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update contact settings');
      }

      setFormData(data.contactSettings);
      toast.success('Contact links updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update contact settings',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 text-gray-500">
        Loading contact settings...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border mt-8">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-600" />
          Contact Links
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Update WhatsApp, Telegram, and Facebook links shown across the site
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp Number
          </label>
          <input
            type="text"
            value={formData.whatsapp}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))
            }
            placeholder="+9779800000000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Include country code, e.g. +35795676054
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telegram Number or Username
          </label>
          <input
            type="text"
            value={formData.telegram}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, telegram: e.target.value }))
            }
            placeholder="+35795676054 or @username"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Facebook className="w-4 h-4" />
            Facebook Page URL
          </label>
          <input
            type="url"
            value={formData.facebook}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, facebook: e.target.value }))
            }
            placeholder="https://www.facebook.com/yourpage"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Contact Links'}
        </Button>
      </form>
    </div>
  );
}
