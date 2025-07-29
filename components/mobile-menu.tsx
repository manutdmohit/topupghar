'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  ChevronDown,
  Home,
  ShoppingBag,
  Phone,
  Gamepad2,
  Gift,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setOpenSubmenu(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape + focus first item
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setOpenSubmenu(null);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        firstMenuItemRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', href: '/' },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: 'Shop',
      href: '#',
      hasSubmenu: true,
      submenu: [
        {
          icon: <Gamepad2 className="w-4 h-4" />,
          label: 'Gaming',
          href: '/gaming',
        },
        {
          icon: <Gift className="w-4 h-4" />,
          label: 'Gift Cards',
          href: '/gift-cards',
        },
        {
          icon: <ShoppingCart className="w-4 h-4" />,
          label: 'Shopping',
          href: '/shopping',
        },
      ],
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Contact Us',
      href: '/contact',
    },
  ];

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:bg-purple-700/50 backdrop-blur-sm rounded-full p-2"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

          <div
            ref={modalRef}
            className="fixed top-16 left-4 right-4 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-300 transform scale-95 opacity-0 animate-fadeIn"
          >
            <nav className="p-6">
              {menuItems.map((item, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  {item.hasSubmenu ? (
                    <div>
                      <button
                        ref={index === 0 ? firstMenuItemRef : null}
                        onClick={() =>
                          setOpenSubmenu(
                            openSubmenu === item.label ? null : item.label
                          )
                        }
                        className="w-full flex items-center justify-between py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-purple-600 group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-all duration-300 ${
                            openSubmenu === item.label
                              ? 'rotate-180 text-purple-600'
                              : ''
                          }`}
                        />
                      </button>

                      {openSubmenu === item.label && (
                        <div className="mt-2 ml-8 space-y-2">
                          {item.submenu?.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="flex items-center gap-3 py-2 px-3 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className="text-purple-500">
                                {subItem.icon}
                              </div>
                              <span>{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center justify-between py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-purple-600 group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
