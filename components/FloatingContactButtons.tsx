'use client';

import { MessageCircle, Facebook } from 'lucide-react';
import { useState } from 'react';

const FloatingContactButtons = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const contactInfo = {
    whatsapp: '+35795676054',
    telegram: '+35795676054',
    facebook: 'https://www.facebook.com/profile.php?id=100083244470979',
  };

  const handleContact = (type: 'whatsapp' | 'telegram' | 'facebook') => {
    switch (type) {
      case 'whatsapp':
        window.open(
          `https://wa.me/${contactInfo.whatsapp.replace(
            /\D/g,
            ''
          )}?text=Hi, I need help with my order`,
          '_blank'
        );
        break;
      case 'telegram':
        window.open(
          `https://t.me/${contactInfo.telegram.replace('@', '')}`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(contactInfo.facebook, '_blank');
        break;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main Contact Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        aria-label="Contact us"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Floating Contact Options */}
      <div
        className={`absolute bottom-16 right-0 space-y-3 transition-all duration-300 z-50 ${
          isExpanded
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible translate-y-4'
        }`}
      >
        {/* WhatsApp */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleContact('whatsapp');
          }}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            WhatsApp
          </span>
        </button>

        {/* Telegram */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleContact('telegram');
          }}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
          aria-label="Contact us on Telegram"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Telegram
          </span>
        </button>

        {/* Facebook */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleContact('facebook');
          }}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
          aria-label="Visit our Facebook page"
        >
          <Facebook className="w-5 h-5" />
          <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Facebook
          </span>
        </button>
      </div>

      {/* Backdrop to close when clicking outside */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default FloatingContactButtons;
