'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { generateFailedOrderId } from '@/lib/order-utils';
import Link from 'next/link';
import {
  CheckoutFieldsForm,
  validateCheckoutFields,
  buildUidEmailForOrder,
  type CheckoutFieldValues,
} from '@/components/checkout/CheckoutFieldsForm';
import {
  DEFAULT_CHECKOUT,
  resolveCheckoutConfig,
  type ProductCheckoutConfig,
} from '@/lib/checkout-config';
import {
  PaymentMethodSelector,
  getSelectedPaymentMethodInstructions,
  getSelectedPaymentMethodLabel,
} from '@/components/payment/PaymentMethodSelector';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';

// Remove client-side token verification - will use API route instead

// Wallet Balance Check Component
function WalletBalanceCheck({
  finalPrice,
  walletBalance,
}: {
  finalPrice: number;
  walletBalance: number | null;
}) {
  if (walletBalance === null) {
    return (
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600">
            Checking wallet balance...
          </span>
        </div>
      </div>
    );
  }

  const isInsufficient = walletBalance < finalPrice;
  const shortfall = finalPrice - walletBalance;

  if (isInsufficient) {
    return (
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
            <svg
              className="w-3 h-3 text-white"
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
          <div className="flex-1">
            <h4 className="font-semibold text-amber-800 mb-2">
              Insufficient Wallet Balance
            </h4>
            <div className="space-y-2 text-sm text-amber-700">
              <p>
                Your current wallet balance:{' '}
                <span className="font-semibold">NPR {walletBalance}</span>
              </p>
              <p>
                Order total:{' '}
                <span className="font-semibold">NPR {finalPrice}</span>
              </p>
              <p>
                Additional amount needed:{' '}
                <span className="font-semibold text-red-600">
                  NPR {shortfall}
                </span>
              </p>
            </div>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <Link
                href="/wallet?tab=topup"
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                💰 Top Up Wallet
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                🔄 Choose Other Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
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
        <div>
          <h4 className="font-semibold text-green-800">
            Wallet Balance Sufficient
          </h4>
          <p className="text-sm text-green-700">
            Your wallet balance:{' '}
            <span className="font-semibold">NPR {walletBalance}</span>
            (Order total:{' '}
            <span className="font-semibold">NPR {finalPrice}</span>)
          </p>
          <p className="text-xs text-green-600 mt-1">
            Remaining balance after purchase:{' '}
            <span className="font-semibold">
              NPR {walletBalance - finalPrice}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TopupPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [data, setData] = useState({
    platform: '',
    uid_email: '',
    type: '',
    amount: '',
    price: '',
    duration: '',
    level: '',
    diamonds: '',
    storage: '',
    zone: '',
    konamiPassword: '',
    gameId: 'no',
    emailId: 'no',
  });

  const [checkout, setCheckout] =
    useState<ProductCheckoutConfig>(DEFAULT_CHECKOUT);
  const [checkoutFields, setCheckoutFields] = useState<CheckoutFieldValues>({
    uid: '',
    phone: '',
    password: '',
    servicePassword: '',
    loginId: '',
    tiktokPassword: '',
    loginMethod: '',
    zone: '',
  });
  const [quantity, setQuantity] = useState(1);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [referredBy, setReferredBy] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const { paymentMethods, loading: paymentMethodsLoading } = usePaymentMethods();

  // Promocode fields
  const [promocode, setPromocode] = useState('');
  const [appliedPromocode, setAppliedPromocode] = useState<any>(null);
  const [isValidatingPromocode, setIsValidatingPromocode] = useState(false);
  const [finalPrice, setFinalPrice] = useState(parseFloat(data.price || '0'));
  const [originalPrice, setOriginalPrice] = useState(
    parseFloat(data.price || '0'),
  );
  const [discountAmount, setDiscountAmount] = useState(0);
  const [baseDiscountAmount, setBaseDiscountAmount] = useState(0);
  const [baseOriginalPrice, setBaseOriginalPrice] = useState(0);

  const handleCheckoutFieldChange = (
    field: keyof CheckoutFieldValues,
    value: string,
  ) => {
    setCheckoutFields((prev) => ({ ...prev, [field]: value }));
  };

  // Authentication check
  useEffect(() => {
    if (status === 'loading') return; // Still loading, wait

    if (status === 'unauthenticated') {
      // Redirect to login page with return URL
      const currentUrl = window.location.href;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }
  }, [status, router]);

  // Fetch wallet balance when authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const fetchWalletBalance = async () => {
        try {
          console.log('Fetching wallet balance for user:', session.user.id);
          const response = await fetch('/api/wallet/balance');
          console.log('Wallet balance response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('Wallet balance data:', data);
            setWalletBalance(data.wallet.balance);
          } else {
            const errorData = await response.json();
            console.error('Wallet balance API error:', errorData);
          }
        } catch (error) {
          console.error('Failed to fetch wallet balance:', error);
        }
      };

      fetchWalletBalance();
    }
  }, [status, session?.user]);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Verify secure token via API route
      const verifyToken = async () => {
        try {
          const response = await fetch('/api/orders/verify-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const result = await response.json();
            const sessionData = result.data;

            console.log({ sessionData });

            setData({
              platform: sessionData.platform,
              uid_email: '',
              type: sessionData.type,
              amount: sessionData.amount,
              price: sessionData.price.toString(),
              duration: sessionData.duration,
              level: sessionData.level,
              diamonds: sessionData.diamonds,
              storage: sessionData.storage,
              zone: sessionData.zone,
              konamiPassword: '',
              gameId: sessionData.gameId || 'no',
              emailId: sessionData.emailId || 'no',
            });

            setCheckout(
              resolveCheckoutConfig({
                checkout: sessionData.checkout,
                platform: sessionData.platform,
                type: sessionData.type,
                gameId: sessionData.gameId,
                emailId: sessionData.emailId,
                zone: sessionData.zone,
              }),
            );

            setQuantity(sessionData.quantity || 1);

            // Initialize price states with quantity consideration
            // The sessionData.price should be the base price per unit
            const basePricePerUnit = sessionData.price;
            const quantityPrice =
              basePricePerUnit * (sessionData.quantity || 1);
            const originalPriceWithQuantity =
              (sessionData.originalPrice || sessionData.price) *
              (sessionData.quantity || 1);

            setOriginalPrice(originalPriceWithQuantity);
            setFinalPrice(Math.round(quantityPrice));

            if (
              sessionData.discountPercentage &&
              sessionData.discountPercentage > 0
            ) {
              // Store base original price per unit
              setBaseOriginalPrice(
                sessionData.originalPrice || sessionData.price,
              );
              // Calculate base discount amount (per unit)
              const baseDiscountPerUnit =
                (sessionData.originalPrice || sessionData.price) -
                sessionData.price;
              setBaseDiscountAmount(baseDiscountPerUnit);
              // Calculate total discount for current quantity
              const totalDiscountAmount =
                baseDiscountPerUnit * (sessionData.quantity || 1);
              setDiscountAmount(totalDiscountAmount);
              setFinalPrice(
                Math.round(originalPriceWithQuantity - totalDiscountAmount),
              );
            } else {
              // No discount, store base original price
              setBaseOriginalPrice(
                sessionData.originalPrice || sessionData.price,
              );
            }
            return;
          } else {
            console.error('Token verification failed:', response.statusText);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
        }
      };

      verifyToken();
      return;
    }

    // Fallback to URL parameters (for backward compatibility)
    const platform = searchParams.get('platform') || '';
    const type = searchParams.get('type') || '';
    const amount = searchParams.get('amount') || '';
    const price = searchParams.get('price') || '';

    setData({
      platform,
      uid_email: '',
      type,
      amount,
      price,
      duration: searchParams.get('duration') || '',
      level: searchParams.get('level') || '',
      diamonds: searchParams.get('diamonds') || '',
      storage: searchParams.get('storage') || '',
      zone: searchParams.get('zone') || '',
      konamiPassword: searchParams.get('konamiPassword') || '',
      gameId: searchParams.get('gameId') || 'no',
      emailId: searchParams.get('emailId') || 'no',
    });
    setReferredBy(searchParams.get('referredBy') || '');
    setCheckout(
      resolveCheckoutConfig({
        platform,
        type,
        gameId: searchParams.get('gameId') || 'no',
        emailId: searchParams.get('emailId') || 'no',
        zone: searchParams.get('zone') || 'no',
      }),
    );

    // Initialize price states (for fallback URL parameters)
    const priceNum = parseFloat(price || '0');
    setOriginalPrice(priceNum);
    setFinalPrice(Math.round(priceNum));
    // Set default quantity to 1 for fallback
    setQuantity(1);
  }, [searchParams]);

  // Recalculate price when quantity changes
  useEffect(() => {
    // Use base original price for calculations
    const baseOriginalPricePerUnit =
      baseOriginalPrice || parseFloat(data.price || '0');
    const originalPriceWithQuantity = baseOriginalPricePerUnit * quantity;

    // Update original price with quantity
    setOriginalPrice(originalPriceWithQuantity);

    // Update final price with quantity (considering promocode if applied)
    if (appliedPromocode) {
      // Recalculate promocode discount on the new quantity price
      const promocodeDiscountAmount =
        (originalPriceWithQuantity * appliedPromocode.discountPercentage) / 100;
      // Add base discount if exists
      const baseDiscountTotal = baseDiscountAmount * quantity;
      const totalDiscountAmount = promocodeDiscountAmount + baseDiscountTotal;
      setDiscountAmount(totalDiscountAmount);
      setFinalPrice(
        Math.round(originalPriceWithQuantity - totalDiscountAmount),
      );
    } else {
      // If no promocode, check if there's a base discount amount
      if (baseDiscountAmount > 0) {
        const totalDiscountAmount = baseDiscountAmount * quantity;
        setDiscountAmount(totalDiscountAmount);
        setFinalPrice(originalPriceWithQuantity - totalDiscountAmount);
      } else {
        setDiscountAmount(0);
        setFinalPrice(originalPriceWithQuantity);
      }
    }
  }, [quantity, baseOriginalPrice, appliedPromocode, baseDiscountAmount]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  const validatePromocode = async () => {
    if (!promocode.trim()) {
      toast.error('Please enter a promocode');
      return;
    }

    setIsValidatingPromocode(true);
    try {
      // Determine the base price for promocode calculation
      // Use the current final price (which includes quantity) for promocode calculation
      const basePriceForPromocode = finalPrice;

      const response = await fetch('/api/promocodes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promocodeName: promocode.trim(),
          orderAmount: basePriceForPromocode, // Use discounted price if available, otherwise original price
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.message || 'Invalid promocode');
        setAppliedPromocode(null);
        // Reset to the price without promocode
        // Use the base original price with quantity
        const baseOriginalPricePerUnit =
          baseOriginalPrice || parseFloat(data.price || '0');
        const originalPriceWithQuantity = baseOriginalPricePerUnit * quantity;
        // Reset promocode discount but keep product discount if any
        if (baseDiscountAmount > 0) {
          const totalDiscountAmount = baseDiscountAmount * quantity;
          setDiscountAmount(totalDiscountAmount);
          setFinalPrice(
            Math.round(originalPriceWithQuantity - totalDiscountAmount),
          );
        } else {
          setDiscountAmount(0);
          setFinalPrice(Math.round(originalPriceWithQuantity));
        }
        return;
      }

      // Apply promocode discount to the base price (discounted or original)
      setAppliedPromocode(responseData.promocode);
      // Add promocode discount to existing base discount
      const baseDiscountTotal = baseDiscountAmount * quantity;
      const totalDiscountAmount =
        responseData.calculation.discountAmount + baseDiscountTotal;
      setDiscountAmount(totalDiscountAmount);
      // Recalculate final price with combined discounts
      const baseOriginalPricePerUnit =
        baseOriginalPrice || parseFloat(data.price || '0');
      const originalPriceWithQuantity = baseOriginalPricePerUnit * quantity;
      setFinalPrice(
        Math.round(originalPriceWithQuantity - totalDiscountAmount),
      );
      toast.success(
        `Promocode applied! ${responseData.promocode.discountPercentage}% discount`,
      );
    } catch (error) {
      toast.error('Failed to validate promocode');
      setAppliedPromocode(null);
      // Reset to the price without promocode
      // Use the base original price with quantity
      const baseOriginalPricePerUnit =
        baseOriginalPrice || parseFloat(data.price || '0');
      const originalPriceWithQuantity = baseOriginalPricePerUnit * quantity;
      // Reset promocode discount but keep product discount if any
      if (baseDiscountAmount > 0) {
        const totalDiscountAmount = baseDiscountAmount * quantity;
        setDiscountAmount(totalDiscountAmount);
        setFinalPrice(originalPriceWithQuantity - totalDiscountAmount);
      } else {
        setDiscountAmount(0);
        setFinalPrice(originalPriceWithQuantity);
      }
    } finally {
      setIsValidatingPromocode(false);
    }
  };

  const removePromocode = () => {
    setPromocode('');
    setAppliedPromocode(null);
    // Reset to the price without promocode
    // Use the base original price with quantity
    const baseOriginalPricePerUnit =
      baseOriginalPrice || parseFloat(data.price || '0');
    const originalPriceWithQuantity = baseOriginalPricePerUnit * quantity;
    // Reset promocode discount but keep product discount if any
    if (baseDiscountAmount > 0) {
      const totalDiscountAmount = baseDiscountAmount * quantity;
      setDiscountAmount(totalDiscountAmount);
      setFinalPrice(
        Math.round(originalPriceWithQuantity - totalDiscountAmount),
      );
    } else {
      setDiscountAmount(0);
      setFinalPrice(Math.round(originalPriceWithQuantity));
    }
    toast.success('Promocode removed');
  };

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    // Check if user is authenticated
    if (!session?.user) {
      toast.error('You must be logged in to make a purchase');
      router.push(
        `/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
      );
      return;
    }

    // Validation (your validation logic)
    if (!isAgeConfirmed) {
      toast.error("You must confirm you're 16 or older.");
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method.');
      return;
    }

    const checkoutError = validateCheckoutFields(checkout, checkoutFields);
    if (checkoutError) {
      toast.error(checkoutError);
      return;
    }

    if (selectedPaymentMethod !== 'wallet' && !receipt) {
      toast.error('Please upload your payment receipt.');
      return;
    }

    // Check wallet balance if wallet payment is selected
    if (selectedPaymentMethod === 'wallet') {
      if (walletBalance === null) {
        toast.error('Unable to verify wallet balance. Please try again.');
        return;
      }
      if (walletBalance < finalPrice) {
        toast.error(
          `Insufficient wallet balance. You have ${walletBalance} NPR but need ${finalPrice} NPR. Please top up your wallet or choose another payment method.`,
        );
        return;
      }
    }

    const finalUidEmail = buildUidEmailForOrder(checkout, checkoutFields);

    const formData = new FormData();
    formData.append('uid_email', finalUidEmail);
    formData.append('phone', checkoutFields.phone);
    formData.append('platform', data.platform);
    formData.append('type', data.type);
    if (data.amount) formData.append('amount', data.amount);
    if (data.price) formData.append('price', data.price);
    // Add quantity
    formData.append('quantity', quantity.toString());
    // Add original price for proper discount calculation
    formData.append('originalPrice', originalPrice.toString());
    if (data.duration) formData.append('duration', data.duration);
    if (data.level) formData.append('level', data.level);
    if (data.diamonds) formData.append('diamonds', data.diamonds);
    if (data.storage) formData.append('storage', data.storage);
    if (checkoutFields.zone) formData.append('zone', checkoutFields.zone);

    if (referredBy.trim()) formData.append('referredBy', referredBy.trim());
    formData.append('paymentMethod', selectedPaymentMethod);

    if (appliedPromocode) {
      formData.append('promocode', appliedPromocode.name);
    }

    if (checkout.requiresAccountPassword && checkoutFields.password) {
      formData.append('password', checkoutFields.password);
      formData.append('garenaPassword', checkoutFields.password);
    }
    if (checkout.requiresServicePassword && checkoutFields.servicePassword) {
      formData.append('password', checkoutFields.servicePassword);
    }
    if (checkout.requiresSocialLogin) {
      formData.append('tiktokPassword', checkoutFields.tiktokPassword);
      formData.append('loginMethod', checkoutFields.loginMethod);
    }
    if (receipt && selectedPaymentMethod !== 'wallet') {
      formData.append('receipt', receipt);
    }

    try {
      setIsSubmitting(true);
      console.log(
        'Submitting order with payment method:',
        selectedPaymentMethod,
      );
      console.log('Wallet balance at submission:', walletBalance);
      console.log('Final price:', finalPrice);

      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });

      console.log('Order creation response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Order creation error:', errorData);
        toast.error(errorData.message || 'Failed to create order');
        setIsSubmitting(false);
        return; // Important! Do not redirect if error
      }

      // Get the created order data from response
      const orderData = await response.json();

      // Redirect to success page with order details
      const successParams = new URLSearchParams({
        platform: data.platform,
        type: data.type,
        amount: data.amount,
        price: Math.round(finalPrice).toString(),
        orderId: orderData.orderId || orderData._id,
        quantity: quantity.toString(),
      });

      router.push(`/topup/payment/success?${successParams}`);
      console.log(formData.get('uid_email'));
    } catch (error) {
      // Redirect to failure page with error details
      const failureParams = new URLSearchParams({
        platform: data.platform,
        type: data.type,
        amount: data.amount,
        price: Math.round(finalPrice).toString(),
        orderId: generateFailedOrderId(),
        error:
          error instanceof Error ? error.message : 'Payment processing failed',
      });

      router.push(`/topup/payment/failure?${failureParams}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render the page if user is not authenticated
  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  if (!data.platform) return null;

  // -------- Summary Logic ----------
  let summary;
  if (data.platform === 'netflix' || data.platform === 'youtube-premium') {
    summary = (
      <>
        You're buying{' '}
        <strong>
          {data.platform === 'netflix' ? 'Netflix' : 'YouTube Premium'} account
          for {data.duration}
        </strong>{' '}
        for <strong>₹ {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'tiktok' && data.type === 'coins') {
    summary = (
      <>
        You're buying <strong>{data.amount} TikTok Coins</strong> x {quantity}{' '}
        for <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'tiktok' && data.type !== 'coins') {
    summary = (
      <>
        You're buying{' '}
        <strong>
          {data.amount} TikTok {data.type}
        </strong>{' '}
        x {quantity} for <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (
    data.platform === 'freefire' &&
    data.type === 'weekly-membership'
  ) {
    summary = (
      <>
        You're buying{' '}
        <strong> Weekly Membership({data.amount} diamonds )</strong> for{' '}
        <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (
    data.platform === 'freefire' &&
    data.type === 'monthly-membership'
  ) {
    summary = (
      <>
        You're buying{' '}
        <strong> Monthly Membership({data.amount} diamonds )</strong> for{' '}
        <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'freefire' && data.type === 'airdrop') {
    summary = (
      <>
        You're buying <strong> AirDrop</strong> for{' '}
        <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'freefire' && data.type === 'level-up') {
    summary = (
      <>
        You're buying <strong> Level {data.level} Level-Up Package</strong> with{' '}
        {data.diamonds} diamonds for <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'freefire' && data.type === 'diamonds') {
    // Extract the number from the label (e.g., "25💎" -> "25")
    let diamondCount = data.amount ? data.amount.replace(/[^\d]/g, '') : '';

    // Fallback: if amount is not available, try to extract from duration
    if (!diamondCount && data.duration) {
      diamondCount = data.duration.replace(/[^\d]/g, '');
    }

    summary = (
      <>
        You're buying <strong>{diamondCount} diamonds</strong> x {quantity} for{' '}
        <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'chatgpt') {
    summary = (
      <>
        You're buying{' '}
        <strong>1 Month {data.type.toUpperCase()} ChatGPT Plus Account </strong>{' '}
        for <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'chatgpt-one-year') {
    summary = (
      <>
        You're buying{' '}
        <strong>1 Year {data.type.toUpperCase()} ChatGPT Plus Account </strong>{' '}
        for <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'perplexity') {
    summary = (
      <>
        You're buying <strong>{data.duration} Perplexity AI Pro </strong> for{' '}
        <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'prime-video') {
    summary = (
      <>
        You're buying{' '}
        <strong className="text-sm">
          {data.duration} Prime Video 4K HD Subscription (5 Device Access){' '}
        </strong>{' '}
        for <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'netflix 4k hd') {
    summary = (
      <>
        You're buying{' '}
        <strong className="text-sm">
          1 Month 4K HD {data.type} Netflix Subscription
        </strong>{' '}
        for <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'adobe' && data.type === 'creative-cloud') {
    summary = (
      <>
        <strong className="text-sm">
          You're buying {data.duration} Adobe Creative Cloud for NPR{' '}
          {data.price}
        </strong>
      </>
    );
  } else if (data.platform === 'microsoft-365') {
    summary = (
      <>
        <strong className="text-sm">
          You're buying {data.duration} Microsoft 365 for NPR {finalPrice} with{' '}
          {data.storage} storage
        </strong>
      </>
    );
  } else if (data.platform === 'coursera') {
    summary = (
      <>
        <strong className="text-sm">
          You're buying {data.duration} Coursera Plus for NPR {finalPrice}
        </strong>
      </>
    );
  } else if (data.platform === 'canva') {
    summary = (
      <>
        You're buying <strong>{data.duration} Canva Pro Account</strong> for{' '}
        <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'freefire' && data.type === 'evo-access') {
    summary = (
      <strong>
        You're buying <strong>Evo Access for {data.duration}</strong> for{' '}
        <strong>NPR {finalPrice}</strong>
      </strong>
    );
  } else if (
    data.platform === 'linkedin' ||
    data.platform === 'figma' ||
    data.platform === 'you.com' ||
    data.platform === 'nordvpn'
  ) {
    summary = (
      <>
        <strong className="text-sm">
          {data.platform === 'linkedin'
            ? 'You are buying LinkedIn Premium of 1 Year for NPR'
            : data.platform === 'figma'
              ? 'You are buying Figma Professional of 1 Year for NPR'
              : data.platform === 'you.com'
                ? 'You are buying You.com subscription of 1 Year for NPR'
                : data.platform === 'nordvpn'
                  ? `You are buying NordVPN subscription of ${data.duration} for NPR`
                  : ''}{' '}
          {data.price}
        </strong>
      </>
    );
  } else if (data.platform === 'instagram') {
    summary = (
      <>
        You're buying{' '}
        <strong>
          {data.amount}{' '}
          {data.type == 'followers'
            ? 'Followers'
            : data.type === 'views'
              ? 'Views'
              : 'Likes'}
        </strong>{' '}
        x {quantity} for <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'facebook') {
    summary = (
      <>
        You're buying{' '}
        <strong>
          {data.amount}{' '}
          {data.type == 'followers'
            ? 'Followers'
            : data.type === 'views'
              ? 'Views'
              : 'Likes'}
        </strong>{' '}
        x {quantity} for <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'youtube' && data.type === 'subscribers') {
    summary = (
      <>
        You're buying{' '}
        <strong>
          {data.amount} {data.type == 'subscribers' ? 'Subscribers' : 'Views'}
        </strong>{' '}
        x {quantity} for <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform == 'Pieces' && data.type == 'account') {
    summary = (
      <>
        You're buying <strong>{data.amount} Pieces Unipin Voucher</strong> for{' '}
        <strong>NPR {finalPrice}</strong>
      </>
    );
  } else {
    summary = (
      <>
        You're buying{' '}
        <strong>
          {data.amount}{' '}
          {data.type === 'uc'
            ? 'UC'
            : data.type === 'shell'
              ? 'Shells'
              : data.type === 'followers'
                ? 'Followers'
                : data.type === 'usd'
                  ? 'USD'
                  : data.type}
        </strong>{' '}
        x {quantity} for <strong>NPR {finalPrice}</strong>
      </>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* User Authentication Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
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
          <div>
            <p className="font-semibold text-green-800">Authenticated User</p>
            <p className="text-sm text-green-600">
              Logged in as:{' '}
              {session?.user?.email || session?.user?.name || 'User'}
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-purple-700 text-center capitalize">
        {data.platform == 'Pieces' ? 'Unipin' : data.platform}{' '}
        {data.type === 'usd' ? data.type.toUpperCase() : data.type} Payment
      </h1>

      <div className="mx-auto max-w-3xl rounded-3xl border border-blue-200 bg-gradient-to-r from-sky-50 to-blue-50 p-4 mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          Get 2% Cashback on purchases of Rs. 500 or more!
        </p>
        <p className="text-sm text-blue-700 mt-1">
          Eligible cashback is added automatically to your wallet after your
          order is completed.
        </p>
      </div>

      <p className="text-center text-lg mb-2">{summary}</p>

      <p className="text-sm text-center text-gray-500 italic">
        ⚠️ Please double-check all your details before submitting. Incorrect
        info may delay your delivery.
      </p>

      <CheckoutFieldsForm
        checkout={checkout}
        values={checkoutFields}
        onChange={handleCheckoutFieldChange}
      />

      {/* Quantity */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Quantity <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center text-gray-700 font-bold transition-colors"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(1, Math.min(10, parseInt(e.target.value) || 1)),
              )
            }
            className="w-20 text-center px-3 py-2 border rounded-lg font-semibold"
          />
          <button
            type="button"
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center text-white font-bold transition-colors"
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Select quantity (1-10). Total price will be updated automatically.
        </p>
      </div>

      {/* Referred By (optional) */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Referred By <span className="text-xs text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="Referral code or name (if any)"
          value={referredBy}
          onChange={(e) => setReferredBy(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Promocode Section */}
      <div className="space-y-3">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Promocode <span className="text-xs text-gray-400">(optional)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter promocode"
              value={promocode}
              onChange={(e) => setPromocode(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-2 border rounded-lg"
              disabled={isValidatingPromocode}
            />
            <Button
              onClick={validatePromocode}
              disabled={!promocode.trim() || isValidatingPromocode}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isValidatingPromocode ? 'Validating...' : 'Apply'}
            </Button>
          </div>
        </div>

        {/* Applied Promocode Display */}
        {appliedPromocode && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">
                  Promocode Applied: {appliedPromocode.name}
                </p>
                <p className="text-xs text-green-600">
                  {appliedPromocode.discountPercentage}% discount
                </p>
              </div>
              <Button
                onClick={removePromocode}
                className="text-xs px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded"
              >
                Remove
              </Button>
            </div>
          </div>
        )}

        {/* Price Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Original Price:</span>
              <span className="font-medium">
                NPR {Math.round(originalPrice)}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>- NPR {Math.round(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-1">
              <span className="font-semibold">Final Price:</span>
              <span className="font-bold text-lg">
                NPR {Math.round(finalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nepali Warning Message */}
      <div className="bg-red-50 border border-red-400 rounded-lg p-4 mb-4 text-red-800 text-sm font-semibold flex items-center gap-3">
        <svg
          className="w-5 h-5 text-red-500 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-4v4"
          ></path>
        </svg>
        <span>
          कृपया <span className="font-bold text-red-600">Payment Remarks</span>{' '}
          वा <span className="font-bold text-red-600">Purpose</span> मा{' '}
          <span className="font-bold text-red-600">Product नाम</span> (जस्तै
          "Free Fire", "TikTok", Topup, आदि){' '}
          <span className="font-bold">नलेख्नुहोस्</span>। यदि लेखिएको पाइयो भने{' '}
          <span className="font-bold text-red-600">
            तपाईंको भुक्तानी अस्वीकृत (discard) गरिनेछ।
          </span>
        </span>
      </div>

      {/* Payment Methods */}
      <div>
        <p className="text-center text-lg font-semibold text-gray-700 mb-4">
          Choose your payment method <span className="text-red-500">*</span>
        </p>
        <PaymentMethodSelector
          methods={paymentMethods}
          selectedSlug={selectedPaymentMethod}
          onSelect={setSelectedPaymentMethod}
          includeWallet={!!session?.user?.id}
          variant="checkout"
          loading={paymentMethodsLoading}
        />

        {/* Selected Payment Method Info */}
        {selectedPaymentMethod && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Selected:</span>{' '}
              {getSelectedPaymentMethodLabel(
                paymentMethods,
                selectedPaymentMethod,
              )}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {getSelectedPaymentMethodInstructions(
                paymentMethods,
                selectedPaymentMethod,
              )}
            </p>
            {selectedPaymentMethod === 'wallet' && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
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
                  <div className="text-xs text-amber-800">
                    <p className="font-medium">Important:</p>
                    <p>
                      Wallet payments require admin approval. If your order is
                      rejected, your payment will be automatically refunded to
                      your wallet.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wallet Balance Check */}
        {selectedPaymentMethod === 'wallet' && (
          <WalletBalanceCheck
            finalPrice={finalPrice}
            walletBalance={walletBalance}
          />
        )}
      </div>

      {/* Receipt Upload - Only for non-wallet payments */}
      {selectedPaymentMethod !== 'wallet' && (
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Upload Payment Receipt <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {receipt && (
            <p className="mt-2 text-sm text-green-600">
              Uploaded: {receipt.name}
            </p>
          )}
        </div>
      )}

      {/* Submit */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Checkbox
            id="age-confirm"
            onCheckedChange={(checked) => setIsAgeConfirmed(checked as boolean)}
          />
          <label
            htmlFor="age-confirm"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            By continuing, you confirm you are 16 years or older. Orders from
            users under 16 may be canceled.
          </label>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={
            !isAgeConfirmed ||
            isSubmitting ||
            (selectedPaymentMethod === 'wallet' &&
              walletBalance !== null &&
              walletBalance < finalPrice)
          }
          className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
        </Button>
        {selectedPaymentMethod === 'wallet' &&
          walletBalance !== null &&
          walletBalance < finalPrice && (
            <p className="text-sm text-red-600 mt-2">
              ⚠️ Cannot proceed with wallet payment due to insufficient balance.
              Please top up your wallet or choose another payment method.
            </p>
          )}
      </div>
    </div>
  );
}
