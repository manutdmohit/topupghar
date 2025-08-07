'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MobileMenu } from './mobile-menu';

const HeaderSection = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white px-4 py-4 sticky top-0 z-50 shadow-2xl backdrop-blur-md border-b border-purple-500/20 animate-fade-in-down">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo (Clickable Home) */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative animate-glow">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.jpg"
                alt="Game Shop Logo"
                width={40}
                height={40}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full animate-ping shadow-md" />
          </div>
          <div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              Topup घर
            </span>
            <div className="text-xs font-medium text-purple-300">
              डिजिटल दुनियाँको तपाईंको भरपर्दो साथी
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/"
            className="hover:text-purple-300 transition-all duration-300 font-medium relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Shop Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1 hover:text-purple-300 transition"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <span>Shop</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <div
              className={`absolute top-full right-0 mt-3 w-48 bg-slate-800 border border-purple-500/20 rounded-lg shadow-2xl transform transition-all duration-300 origin-top-right ${
                isDropdownOpen
                  ? 'opacity-100 visible scale-100'
                  : 'opacity-0 invisible scale-95'
              }`}
            >
              {['Gaming', 'Social Media', 'Subscription', 'Load Balance'].map(
                (item, idx) => (
                  <Link
                    key={idx}
                    href={`/products/${item.toLowerCase().replace(' ', '-')}`}
                    className="block px-4 py-3 text-sm text-gray-200 hover:bg-purple-500/10 hover:text-purple-300 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>

          <Link
            href="#"
            className="hover:text-purple-300 transition-all duration-300 font-medium relative group"
          >
            Contact Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
