'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, Plus, Trash2, Eye, Settings } from 'lucide-react';

interface PopupData {
  title: string;
  message: string;
  features: string[];
  ctaText: string;
  isActive: boolean;
  showDelay: number;
  frequency: '2hours';
}

export default function PopupManagementPage() {
  const { adminUser, loading: authLoading } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [popupData, setPopupData] = useState<PopupData>({
    title: '',
    message: '',
    features: [''],
    ctaText: '',
    isActive: true,
    showDelay: 1000,
    frequency: '2hours',
  });

  useEffect(() => {
    if (adminUser) {
      fetchPopupData();
    }
  }, [adminUser]);

  const fetchPopupData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/popup', {
        headers: {
          'x-admin-email': adminUser?.email || '',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setPopupData(result.data);
      } else {
        toast.error('Failed to fetch popup data');
      }
    } catch (error) {
      console.error('Error fetching popup:', error);
      toast.error('Failed to fetch popup data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PopupData, value: any) => {
    setPopupData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...popupData.features];
    newFeatures[index] = value;
    setPopupData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const addFeature = () => {
    setPopupData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index: number) => {
    if (popupData.features.length > 1) {
      const newFeatures = popupData.features.filter((_, i) => i !== index);
      setPopupData((prev) => ({
        ...prev,
        features: newFeatures,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !popupData.title.trim() ||
      !popupData.message.trim() ||
      !popupData.ctaText.trim()
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (popupData.features.some((feature) => !feature.trim())) {
      toast.error('Please fill in all feature fields');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/popup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminUser?.email || '',
        },
        body: JSON.stringify(popupData),
      });

      if (response.ok) {
        toast.success('Popup updated successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update popup');
      }
    } catch (error) {
      console.error('Error updating popup:', error);
      toast.error('Failed to update popup');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You need to be logged in as an admin to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Popup Management</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Basic Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={popupData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Welcome to Topup घर"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="ctaText">CTA Button Text *</Label>
                  <Input
                    id="ctaText"
                    value={popupData.ctaText}
                    onChange={(e) =>
                      handleInputChange('ctaText', e.target.value)
                    }
                    placeholder="Get Started Now! 🚀"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={popupData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Your welcome message here..."
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Features
              </h2>

              <div className="space-y-3">
                {popupData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1"
                    />
                    {popupData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="px-3"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </div>

            {/* Display Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Display Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="showDelay">Show Delay (ms)</Label>
                  <Input
                    id="showDelay"
                    type="number"
                    value={popupData.showDelay}
                    onChange={(e) =>
                      handleInputChange('showDelay', parseInt(e.target.value))
                    }
                    min="0"
                    step="100"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Delay before showing popup
                  </p>
                </div>

                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    value="Every 2 Hours"
                    disabled
                    className="mt-1 bg-gray-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Fixed to show every 2 hours
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={popupData.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange('isActive', checked)
                    }
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Preview
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {popupData.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{popupData.message}</p>

                  <div className="space-y-2 mb-4 text-left">
                    {popupData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    {popupData.ctaText}
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
