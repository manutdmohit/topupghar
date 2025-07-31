import { Gamepad2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const FooterSection = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
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
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'discord'].map((social) => (
                <div
                  key={social}
                  className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center cursor-pointer hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-300 border border-purple-500/20 hover:border-purple-400/40"
                >
                  <span className="text-sm font-bold capitalize">
                    {social[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-6 text-purple-300">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {['Home', 'Shop', 'About Us', 'Contact', 'FAQ', 'Support'].map(
                (link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-gray-300 hover:text-purple-300 transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-6 text-purple-300">Services</h3>
            <ul className="space-y-4">
              {[
                'Game Top-ups',
                'Premium Accounts',
                'Gift Cards',
                'Streaming Services',
                'Mobile Credits',
                'Console Games',
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-500/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Topup Ghar. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-300 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-300 transition-colors"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
