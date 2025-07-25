"use client"

import { useState } from "react"
import { Menu, X, ChevronDown, Home, ShoppingBag, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: "Home", href: "#" },
    { icon: <ShoppingBag className="w-5 h-5" />, label: "Shop", href: "#", hasSubmenu: true },
    { icon: <Phone className="w-5 h-5" />, label: "Contact Us", href: "#" },
  ]

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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)}></div>
          <div className="fixed top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
            <nav className="p-6">
              {menuItems.map((item, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <a
                    href={item.href}
                    className="flex items-center justify-between py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-purple-600 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.hasSubmenu && (
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors duration-300" />
                    )}
                  </a>
                </div>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
