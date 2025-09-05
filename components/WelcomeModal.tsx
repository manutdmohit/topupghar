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
  frequency: '2hours';
}

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch popup data from API
    const fetchPopupData = async () => {
      try {
        console.log('🔍 WelcomeModal: Fetching popup data...');
        const response = await fetch('/api/popup');
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

    // Check if user has seen the modal before based on frequency
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal');
    const lastShown = localStorage.getItem('lastModalShown');
    const currentTime = Date.now();

    console.log('🔍 WelcomeModal: hasSeenModal:', hasSeenModal);
    console.log('🔍 WelcomeModal: lastShown:', lastShown);

    let shouldShow = false;

    // Popup shows every 2 hours
    if (!lastShown) {
      shouldShow = true;
      console.log('✅ WelcomeModal: First time user - will show popup');
    } else {
      const lastShownTime = parseInt(lastShown);
      const currentTime = Date.now();
      const diffHours = (currentTime - lastShownTime) / (1000 * 60 * 60);
      shouldShow = diffHours >= 2;
      console.log(
        '🔍 WelcomeModal: Time since last shown:',
        diffHours,
        'hours'
      );
      console.log('🔍 WelcomeModal: Should show:', shouldShow);
    }

    if (shouldShow) {
      console.log(
        '✅ WelcomeModal: Setting timer to show popup in',
        popupData.showDelay,
        'ms'
      );
      // Show modal after the configured delay
      const timer = setTimeout(() => {
        console.log('🎉 WelcomeModal: Showing popup now!');
        setIsOpen(true);
      }, popupData.showDelay);

      return () => clearTimeout(timer);
    } else {
      console.log(
        '❌ WelcomeModal: Not showing popup - user has seen it recently'
      );
    }
  }, [popupData, loading]);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as seen and record timestamp
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    localStorage.setItem('lastModalShown', Date.now().toString());
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
