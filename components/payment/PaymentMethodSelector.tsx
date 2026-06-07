'use client';

import Image from 'next/image';
import type { PaymentMethodDto } from '@/lib/payment-methods';

const WALLET_METHOD = {
  slug: 'wallet',
  name: 'Wallet Balance',
  qrImage: '/wallet.svg',
  description:
    'Your wallet balance will be deducted immediately and the order will be pending admin review.',
};

interface PaymentMethodSelectorProps {
  methods: PaymentMethodDto[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
  includeWallet?: boolean;
  variant?: 'checkout' | 'wallet';
  loading?: boolean;
}

export function PaymentMethodSelector({
  methods,
  selectedSlug,
  onSelect,
  includeWallet = false,
  variant = 'checkout',
  loading = false,
}: PaymentMethodSelectorProps) {
  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading payment methods...
      </div>
    );
  }

  const displayMethods = includeWallet
    ? [
        {
          _id: 'wallet',
          slug: WALLET_METHOD.slug,
          name: WALLET_METHOD.name,
          qrImage: WALLET_METHOD.qrImage,
          description: WALLET_METHOD.description,
          isActive: true,
          sortOrder: -1,
        },
        ...methods,
      ]
    : methods;

  if (displayMethods.length === 0) {
    return (
      <div className="text-center py-8 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
        No payment methods are currently available. Please contact support.
      </div>
    );
  }

  const isCheckout = variant === 'checkout';

  return (
    <div
      className={
        isCheckout
          ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'
          : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'
      }
    >
      {displayMethods.map((method) => {
        const isSelected = selectedSlug === method.slug;

        return (
          <button
            key={method.slug}
            type="button"
            onClick={() => onSelect(method.slug)}
            className={`relative text-left transition-all duration-300 transform hover:scale-[1.02] ${
              isSelected
                ? 'border-2 border-blue-500 shadow-lg scale-[1.02] bg-blue-50'
                : 'border-2 border-gray-200 hover:border-gray-400 bg-white shadow-sm'
            } rounded-xl p-4 lg:p-6`}
          >
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            <p className="font-semibold text-gray-800 mb-3 text-base lg:text-lg text-center">
              {method.name}
            </p>

            <div
              className={`mx-auto mb-4 flex items-center justify-center ${
                isCheckout
                  ? 'w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64'
                  : 'w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40'
              }`}
            >
              <Image
                src={method.qrImage}
                alt={`${method.name} QR`}
                width={256}
                height={256}
                className="object-contain w-full h-full rounded-lg"
              />
            </div>

            {method.description && (
              <p className="text-xs text-gray-600 text-center hidden sm:block">
                {method.description}
              </p>
            )}

            <div
              className={`text-sm lg:text-base font-medium text-center mt-3 ${
                isSelected ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {isSelected ? '✓ Selected' : 'Click to select'}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function getSelectedPaymentMethodLabel(
  methods: PaymentMethodDto[],
  selectedSlug: string,
) {
  if (selectedSlug === 'wallet') return WALLET_METHOD.name;
  return methods.find((method) => method.slug === selectedSlug)?.name || selectedSlug;
}

export function getSelectedPaymentMethodInstructions(
  methods: PaymentMethodDto[],
  selectedSlug: string,
) {
  if (selectedSlug === 'wallet') return WALLET_METHOD.description;
  return (
    methods.find((method) => method.slug === selectedSlug)?.instructions ||
    'Please scan the QR code above and upload your payment receipt after completing the transaction.'
  );
}
