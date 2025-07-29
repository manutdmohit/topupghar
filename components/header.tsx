'use client';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MobileMenu } from './mobile-menu';

const HeaderSection = () => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white px-4 py-4 sticky top-0 z-50 shadow-2xl backdrop-blur-lg border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              {/* <Gamepad2 className="w-6 h-6 text-white" /> */}
              <Image
                src="/logo.jpg"
                alt="Game Shop Logo"
                width={40}
                height={40}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Topup घर
            </span>
            <div className="text-xs font-medium text-purple-300">
              डिजिटल दुनियाँको तपाईंको भरपर्दो साथी
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#"
            className="hover:text-purple-300 transition-all duration-300 font-medium relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <div className="relative group">
            <div className="flex items-center space-x-1 hover:text-purple-300 transition-all duration-300 cursor-pointer font-medium relative group">
              <span>Shop</span>
              <ChevronDown className="w-4 h-4" />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </div>
            <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-purple-500/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <Link
                href="#"
                className="block px-4 py-3 text-sm text-gray-200 hover:bg-purple-500/20 hover:text-purple-300 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
              >
                Gaming
              </Link>
              <Link
                href="#"
                className="block px-4 py-3 text-sm text-gray-200 hover:bg-purple-500/20 hover:text-purple-300 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
              >
                Gift Cards
              </Link>
              <Link
                href="#"
                className="block px-4 py-3 text-sm text-gray-200 hover:bg-purple-500/20 hover:text-purple-300 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
              >
                Subscription
              </Link>
            </div>
          </div>
          <Link
            href="#"
            className="hover:text-purple-300 transition-all duration-300 font-medium relative group"
          >
            Contact Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* <ShoppingCartComponent /> */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
