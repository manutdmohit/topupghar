'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';

interface PopupData {
  title: string;
  message: string;
  features: string[];
  ctaText: string;
  isActive: boolean;
  showDelay: number;
  frequency: string;
}

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Fetch popup data from API with cache-busting
    const fetchPopupData = async () => {
      try {
        console.log('🔍 WelcomeModal: Fetching popup data...');
        // Add timestamp to prevent caching
        const response = await fetch(`/api/popup?t=${Date.now()}`);
        console.log('🔍 WelcomeModal: API response status:', response.status);

        if (response.ok) {
          const result = await response.json();
          console.log('✅ WelcomeModal: Popup data received:', result);
          setPopupData(result.data);
        } else {
          const errorData = await response.json();
          console.error(
            '❌ WelcomeModal: Failed to fetch popup data:',
            errorData
          );
        }
      } catch (error) {
        console.error('❌ WelcomeModal: Error fetching popup:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopupData();
  }, [refreshKey]);

  // Add a periodic refresh to check for admin changes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 30000); // Check every 30 seconds for updates

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log('🔍 WelcomeModal: Checking popup display logic...');
    console.log('🔍 WelcomeModal: popupData:', popupData);
    console.log('🔍 WelcomeModal: loading:', loading);

    if (!popupData || !popupData.isActive || loading) {
      console.log(
        '❌ WelcomeModal: Not showing popup - missing data or loading'
      );
      return;
    }

    // Check frequency logic
    const shouldShowPopup = checkFrequencyLogic(popupData.frequency);

    if (!shouldShowPopup) {
      console.log(
        '❌ WelcomeModal: Not showing popup - frequency check failed'
      );
      return;
    }

    // Show popup after the configured delay
    console.log(
      '✅ WelcomeModal: Setting timer to show popup in',
      popupData.showDelay,
      'ms'
    );

    const timer = setTimeout(() => {
      console.log('🎉 WelcomeModal: Showing popup now!');
      setIsOpen(true);
    }, popupData.showDelay);

    return () => clearTimeout(timer);
  }, [popupData, loading]);

  const checkFrequencyLogic = (frequency: string) => {
    const lastShown = localStorage.getItem('lastModalShown');
    const currentTime = Date.now();

    console.log('🔍 WelcomeModal: Frequency:', frequency);
    console.log('🔍 WelcomeModal: Last shown:', lastShown);

    if (!lastShown) {
      console.log('✅ WelcomeModal: First time user - will show popup');
      return true;
    }

    const lastShownTime = parseInt(lastShown);
    const diffHours = (currentTime - lastShownTime) / (1000 * 60 * 60);

    console.log('🔍 WelcomeModal: Time since last shown:', diffHours, 'hours');

    // Handle different frequency settings
    switch (frequency) {
      case '2hours':
        const shouldShow = diffHours >= 2;
        console.log('🔍 WelcomeModal: 2-hour check - should show:', shouldShow);
        return shouldShow;
      case 'daily':
        return diffHours >= 24;
      case 'weekly':
        return diffHours >= 168; // 7 days
      case 'always':
        return true;
      default:
        console.log(
          '⚠️ WelcomeModal: Unknown frequency, defaulting to 2 hours'
        );
        return diffHours >= 2;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Record when the popup was shown for frequency checking
    localStorage.setItem('lastModalShown', Date.now().toString());
    console.log('✅ WelcomeModal: Recorded popup shown time');
  };

  if (!isOpen || !popupData || loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center justify-center p-4">
          {/* Logo */}
          <Image
            src="/logo.jpg"
            alt="Topup Ghar"
            width={70}
            height={70}
            priority
          />

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {popupData.title}
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {popupData.message}
          </p>

          {/* Features */}
          <div className="space-y-3 mb-6 text-left">
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

          {/* CTA Button */}
          <Button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            {popupData.ctaText}
          </Button>

          {/* Footer */}
          <p className="text-xs text-gray-400 mt-4">Don't show this again</p>
        </div>
      </div>
    </div>
  );
}
