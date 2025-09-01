'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Wallet, CreditCard } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  image: string;
  description?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'esewa',
    name: 'eSewa',
    image: '/esewa.jpg',
    description: 'Digital wallet & payment gateway',
  },
  {
    id: 'khalti',
    name: 'Khalti',
    image: '/khalti.jpg',
    description: 'Digital wallet & payment solution',
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    image: '/bank.jpg',
    description: 'Direct bank transfer',
  },
];

export default function WalletTopup() {
  const { data: session } = useSession();
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      setReceipt(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error('Please login to continue');
      return;
    }

    if (!amount || !selectedPaymentMethod) {
      toast.error('Please enter amount and select a payment method');
      return;
    }

    if (!receipt) {
      toast.error('Please upload your payment receipt');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    setIsSubmitting(true);

    try {
      // First upload the receipt
      const formData = new FormData();
      // API expects the field name to be 'image'
      formData.append('image', receipt);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadData?.error || 'Failed to upload receipt');
      }
      const receiptUrl = uploadData.url;

      // Then submit the topup request
      const topupResponse = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: numAmount,
          paymentMethod: selectedPaymentMethod,
          receiptUrl,
        }),
      });

      const topupData = await topupResponse.json();

      if (topupResponse.ok) {
        toast.success(topupData.message);
        // Reset form
        setAmount('');
        setSelectedPaymentMethod('');
        setReceipt(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(topupData.error || 'Failed to submit topup request');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      amount.trim() &&
      parseFloat(amount) > 0 &&
      selectedPaymentMethod &&
      receipt
    );
  };

  if (!session?.user?.id) {
    return (
      <div className="text-center py-8">
        <Wallet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Login Required
        </h3>
        <p className="text-gray-500">Please login to access your wallet</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <Wallet className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-blue-600 mb-3" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Top Up Wallet
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Add funds to your wallet for quick payments
        </p>
      </div>

      {/* Payment Method Selection Grid */}
      <div>
        <Label className="text-sm sm:text-base font-medium text-gray-700 mb-3 block flex items-center gap-2">
          Choose Payment Method
          {selectedPaymentMethod && (
            <span className="text-green-600 text-sm">✓</span>
          )}
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedPaymentMethod(method.id)}
              className={`p-4 sm:p-6 lg:p-10 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                selectedPaymentMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <img
                  src={method.image}
                  alt={method.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain mx-auto mb-3 rounded-lg"
                />
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {method.name}
                </p>
                <p className="text-xs text-gray-600 mt-1 hidden sm:block">
                  {method.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Form Completion
          </span>
          <span className="text-sm text-gray-500">
            {
              [
                amount.trim() && parseFloat(amount) > 0,
                selectedPaymentMethod,
                receipt,
              ].filter(Boolean).length
            }
            /3
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ([
                  amount.trim() && parseFloat(amount) > 0,
                  selectedPaymentMethod,
                  receipt,
                ].filter(Boolean).length /
                  3) *
                100
              }%`,
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Complete all fields to enable submission
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <Label
            htmlFor="amount"
            className="flex items-center gap-2 text-sm sm:text-base"
          >
            Amount (NPR)
            {amount.trim() && parseFloat(amount) > 0 && (
              <span className="text-green-600 text-sm">✓</span>
            )}
          </Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="1"
            required
            className={`mt-1 text-sm sm:text-base ${
              amount.trim() && parseFloat(amount) > 0
                ? 'border-green-500 focus:border-green-500'
                : amount.trim() && parseFloat(amount) <= 0
                ? 'border-red-500 focus:border-red-500'
                : ''
            }`}
          />
          {amount.trim() && parseFloat(amount) <= 0 && (
            <p className="text-red-500 text-sm mt-1">
              Amount must be greater than 0
            </p>
          )}
        </div>

        {/* Receipt Upload */}
        <div>
          <Label
            htmlFor="receipt"
            className="flex items-center gap-2 text-sm sm:text-base"
          >
            Payment Receipt
            {receipt && <span className="text-green-600 text-sm">✓</span>}
          </Label>
          <div className="mt-1">
            <Input
              id="receipt"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              required
              className={`cursor-pointer text-sm sm:text-base ${
                receipt ? 'border-green-500 focus:border-green-500' : ''
              }`}
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Upload screenshot or PDF of your payment receipt (max 5MB)
            </p>
            {receipt && (
              <p className="text-green-600 text-xs sm:text-sm mt-1">
                ✓ Receipt uploaded: {receipt.name}
              </p>
            )}
          </div>
        </div>

        {/* Selected Payment Method Display */}
        {selectedPaymentMethod && (
          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Selected Payment Method:
            </p>
            <div className="flex items-center gap-3">
              <img
                src={
                  paymentMethods.find((m) => m.id === selectedPaymentMethod)
                    ?.image
                }
                alt={
                  paymentMethods.find((m) => m.id === selectedPaymentMethod)
                    ?.name
                }
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg border bg-white p-1"
              />
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {
                    paymentMethods.find((m) => m.id === selectedPaymentMethod)
                      ?.name
                  }
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {
                    paymentMethods.find((m) => m.id === selectedPaymentMethod)
                      ?.description
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !isFormValid()}
          className={`w-full text-sm sm:text-base ${
            isFormValid()
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Submit Topup Request
            </div>
          )}
        </Button>

        {/* Validation Status */}
        {!isFormValid() && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-xs sm:text-sm text-amber-800">
                <p className="font-medium mb-1">
                  Please complete all required fields:
                </p>
                <ul className="list-disc list-inside space-y-1 text-amber-700">
                  {!amount.trim() && <li>Enter a valid amount</li>}
                  {amount.trim() && parseFloat(amount) <= 0 && (
                    <li>Amount must be greater than 0</li>
                  )}
                  {!selectedPaymentMethod && <li>Select a payment method</li>}
                  {!receipt && <li>Upload payment receipt</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Info Box */}
      <div className="mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-white text-xs">ℹ</span>
          </div>
          <div className="text-xs sm:text-sm text-blue-800">
            <p className="font-medium mb-1">How it works:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>Enter amount and select payment method</li>
              <li>Upload your payment receipt</li>
              <li>Admin will verify and approve within 24 hours</li>
              <li>Funds will be added to your wallet</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
