import {
  Gamepad2,
  MessageCircle,
  Mail,
  Facebook,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const FooterSection = () => {
  const contactInfo = {
    whatsapp: '+35795676054',
    telegram: '+35795676054',
    email: 'topup.ghar11@gmail.com',
    facebook: 'https://www.facebook.com/profile.php?id=100083244470979',
  };

  const handleContact = (
    type: 'whatsapp' | 'telegram' | 'email' | 'facebook'
  ) => {
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
      case 'email':
        window.open(
          `mailto:${contactInfo.email}?subject=Support Request`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(contactInfo.facebook, '_blank');
        break;
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Image
                  src="/logo.jpg"
                  alt="Game Shop Logo"
                  width={40}
                  height={40}
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Topup घर
                </span>
                <div className="text-sm text-purple-300">
                  डिजिटल दुनियाँको तपाईंको भरपर्दो साथी
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Your ultimate destination for gaming credits, premium services,
              and exclusive content. Trusted by millions of gamers worldwide
              with instant delivery and 24/7 support.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-6 text-purple-300">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'Contact Us', href: '/contact-us' },
                { name: 'FAQ', href: '/faq' },
                { name: 'About Us', href: '/about' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-6 text-purple-300">
              Shop Categories
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Gaming', href: '/products/gaming' },
                { name: 'Social Media', href: '/products/social-media' },
                { name: 'Subscription', href: '/products/subscription' },
                { name: 'Load Balance', href: '/products/load-balance' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-6 text-purple-300">
              Contact Us
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => handleContact('whatsapp')}
                className="w-full text-left text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center group"
              >
                <MessageCircle className="w-5 h-5 mr-3 text-green-400" />
                <div>
                  <div className="font-semibold">WhatsApp</div>
                  <div className="text-sm opacity-90">
                    {contactInfo.whatsapp}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <button
                onClick={() => handleContact('telegram')}
                className="w-full text-left text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
              >
                <MessageCircle className="w-5 h-5 mr-3 text-blue-400" />
                <div>
                  <div className="font-semibold">Telegram</div>
                  <div className="text-sm opacity-90">
                    {contactInfo.telegram}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <button
                onClick={() => handleContact('email')}
                className="w-full text-left text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group"
              >
                <Mail className="w-5 h-5 mr-3 text-purple-400" />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-sm opacity-90">{contactInfo.email}</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <button
                onClick={() => handleContact('facebook')}
                className="w-full text-left text-gray-300 hover:text-blue-600 transition-colors duration-300 flex items-center group"
              >
                <Facebook className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <div className="font-semibold">Facebook</div>
                  <div className="text-sm opacity-90">Visit our page</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Topup Ghar. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
