'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export function ShoppingCartComponent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      title: 'Free Fire 1000 Diamonds',
      price: 15.99,
      quantity: 1,
      image: '/free-fire.jpg',
    },
    {
      id: '2',
      title: 'TikTok 1000 Coins',
      price: 12.99,
      quantity: 2,
      image: '/mobile-gaming.jpg',
    },
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative text-white hover:bg-purple-700/50 backdrop-blur-sm rounded-full p-2"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-xs font-bold animate-pulse">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg bg-gradient-to-br from-white to-purple-50">
        <SheetHeader className="border-b border-purple-100 pb-4">
          <SheetTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-purple-600" />
            Shopping Cart
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            {totalItems} item{totalItems !== 1 ? 's' : ''} ready for checkout
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm">Add some gaming goodies!</p>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">
                      {item.title}
                    </h4>
                    <p className="text-purple-600 font-bold text-lg">
                      ${item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full border-purple-200 hover:bg-purple-50 bg-transparent"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full border-purple-200 hover:bg-purple-50 bg-transparent"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                    onClick={() => updateQuantity(item.id, 0)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="border-t border-purple-100 pt-6 mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Subtotal:</span>
                  <span className="font-bold text-2xl text-purple-600">
                    ${Math.round(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
                  <span>Delivery:</span>
                  <span className="text-green-600 font-semibold">
                    FREE (Instant)
                  </span>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  Proceed to Checkout
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Secure checkout with 256-bit SSL encryption
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
