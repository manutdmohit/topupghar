'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  MessageCircle,
  Mail,
  Facebook,
  Home,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { generateTempOrderId, formatOrderId } from '@/lib/order-utils';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState({
    platform: '',
    type: '',
    amount: '',
    price: '',
    orderId: '',
  });

  useEffect(() => {
    // Get order details from URL params or localStorage
    const platform = searchParams.get('platform') || '';
    const type = searchParams.get('type') || '';
    const amount = searchParams.get('amount') || '';
    const price = searchParams.get('price') || '';
    const orderId = searchParams.get('orderId') || generateTempOrderId();

    setOrderDetails({ platform, type, amount, price, orderId });
  }, [searchParams]);

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
          )}?text=Hi, I need help with my order ${orderDetails.orderId}`,
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
          `mailto:${contactInfo.email}?subject=Order Support - ${orderDetails.orderId}`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(contactInfo.facebook, '_blank');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Thank You for Your Order! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Your payment has been received successfully. We're processing your
            order and will deliver your service as soon as possible.
          </motion.p>

          {/* Order Details */}
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

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Total Paid:</span>
                <span className="font-bold text-green-600 text-lg">
                  NPR {orderDetails.price}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Processing Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">
                Processing Your Order
              </h3>
            </div>
            <p className="text-blue-700 text-center">
              Our team is verifying your payment and will process your order
              within 1-2 hours. You'll receive a confirmation once your service
              is delivered.
            </p>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Need Help?
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Contact us if you don't receive your service within 2 hours or
              have any questions.
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
                onClick={() => handleContact('facebook')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 h-auto"
              >
                <Facebook className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Facebook</div>
                  <div className="text-sm opacity-90">Visit our page</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>
            </div>
          </motion.div>

          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Important Notes:
                </h3>
                <ul className="text-yellow-700 space-y-1 text-sm">
                  <li>• Keep your Order ID safe for reference</li>
                  <li>• Service delivery time: 1-2 hours (usually faster)</li>
                  <li>• Contact us immediately if you face any issues</li>
                </ul>
              </div>
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
              onClick={() => router.push('/')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
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
