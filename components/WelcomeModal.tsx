'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the modal before
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal');
    const lastShown = localStorage.getItem('lastModalShown');
    const currentTime = Date.now();

    // Show modal if:
    // 1. Never seen before, OR
    // 2. Last shown more than 7 days ago
    const shouldShow =
      !hasSeenModal ||
      (lastShown &&
        currentTime - parseInt(lastShown) > 2 * 24 * 60 * 60 * 1000);

    if (shouldShow) {
      // Show modal after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as seen and record timestamp
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    localStorage.setItem('lastModalShown', Date.now().toString());
  };

  if (!isOpen) return null;

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
            Welcome to Topup घर
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your one-stop destination for gaming top-ups, streaming services,
            and social media boosts. Get instant delivery and amazing deals on
            all your favorite platforms!
          </p>

          {/* Features */}
          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Instant delivery on all orders
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Secure payment methods
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              24/7 customer support
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Best prices guaranteed
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started Now! 🚀
          </Button>

          {/* Footer */}
          <p className="text-xs text-gray-400 mt-4">Don't show this again</p>
        </div>
      </div>
    </div>
  );
}
