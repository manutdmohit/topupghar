'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  XCircle,
  RefreshCw,
  MessageCircle,
  Mail,
  Phone,
  Home,
  ExternalLink,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { generateFailedOrderId, formatOrderId } from '@/lib/order-utils';

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState({
    platform: '',
    type: '',
    amount: '',
    price: '',
    orderId: '',
    error: '',
  });

  useEffect(() => {
    // Get order details from URL params
    const platform = searchParams.get('platform') || '';
    const type = searchParams.get('type') || '';
    const amount = searchParams.get('amount') || '';
    const price = searchParams.get('price') || '';
    const orderId = searchParams.get('orderId') || generateFailedOrderId();
    const error = searchParams.get('error') || 'Payment processing failed';

    setOrderDetails({ platform, type, amount, price, orderId, error });
  }, [searchParams]);

  const contactInfo = {
    whatsapp: '+35795676054',
    telegram: '+35795676054',
    email: 'topup.ghar11@gmail.com',
    phone: '+35795676054',
  };

  const handleContact = (type: 'whatsapp' | 'telegram' | 'email' | 'phone') => {
    const message = `Hi, I'm having trouble with my payment. Order ID: ${orderDetails.orderId}. Error: ${orderDetails.error}`;

    switch (type) {
      case 'whatsapp':
        window.open(
          `https://wa.me/${contactInfo.whatsapp.replace(
            /\D/g,
            ''
          )}?text=${encodeURIComponent(message)}`,
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
          `mailto:${contactInfo.email}?subject=Payment Issue - ${
            orderDetails.orderId
          }&body=${encodeURIComponent(message)}`,
          '_blank'
        );
        break;
      case 'phone':
        window.open(`tel:${contactInfo.phone}`, '_blank');
        break;
    }
  };

  const handleRetry = () => {
    // Redirect back to payment page with order details
    const params = new URLSearchParams({
      platform: orderDetails.platform,
      type: orderDetails.type,
      amount: orderDetails.amount,
      price: orderDetails.price,
    });
    router.push(`/topup/payment?${params}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Failure Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8"
          >
            <XCircle className="w-12 h-12 text-red-600" />
          </motion.div>

          {/* Failure Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Sorry for the Inconvenience 😔
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            We encountered an issue processing your payment. Don't worry, your
            money is safe and no charges have been made to your account.
          </motion.p>

          {/* Error Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Order Details
            </h2>

            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono font-semibold text-purple-600">
                  {formatOrderId(orderDetails.orderId)}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Service:</span>
                <span className="font-semibold text-gray-800 capitalize">
                  {orderDetails.platform} {orderDetails.type}
                </span>
              </div>

              {orderDetails.amount && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-800">
                    {orderDetails.amount}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-red-600 text-lg">
                  NPR {Math.round(parseFloat(orderDetails.price || '0'))}
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-red-600">
                  Payment Failed
                </span>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">
                What Happened?
              </h3>
            </div>
            <p className="text-red-700 text-center">
              {orderDetails.error}. This could be due to network issues,
              insufficient balance, or temporary service disruption.
            </p>
          </motion.div>

          {/* Troubleshooting Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">
                Troubleshooting Tips
              </h3>
            </div>
            <ul className="text-blue-700 space-y-2 text-left">
              <li>• Check your internet connection</li>
              <li>• Ensure sufficient balance in your payment method</li>
              <li>• Try using a different payment method</li>
              <li>• Clear your browser cache and try again</li>
              <li>• Contact us if the problem persists</li>
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Need Help?
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Our support team is here to help you resolve this issue quickly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleContact('whatsapp')}
                className="bg-green-500 hover:bg-green-600 text-white p-4 h-auto"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">WhatsApp</div>
                  <div className="text-sm opacity-90">
                    {contactInfo.whatsapp}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>

              <Button
                onClick={() => handleContact('telegram')}
                className="bg-blue-500 hover:bg-blue-600 text-white p-4 h-auto"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Telegram</div>
                  <div className="text-sm opacity-90">
                    {contactInfo.telegram}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>

              <Button
                onClick={() => handleContact('email')}
                className="bg-purple-500 hover:bg-purple-600 text-white p-4 h-auto"
              >
                <Mail className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Email</div>
                  <div className="text-sm opacity-90">{contactInfo.email}</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>

              <Button
                onClick={() => handleContact('phone')}
                className="bg-orange-500 hover:bg-orange-600 text-white p-4 h-auto"
              >
                <Phone className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Phone</div>
                  <div className="text-sm opacity-90">{contactInfo.phone}</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={handleRetry}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>

            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="border-gray-500 text-gray-600 hover:bg-gray-50 px-8 py-3"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>

            <Button
              onClick={() => handleContact('whatsapp')}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50 px-8 py-3"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
