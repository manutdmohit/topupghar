'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { generateFailedOrderId } from '@/lib/order-utils';
// Remove client-side token verification - will use API route instead

export default function TopupPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
  });

  // Common fields
  const [uid, setUid] = useState('');
  const [phone, setPhone] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [referredBy, setReferredBy] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Promocode fields
  const [promocode, setPromocode] = useState('');
  const [appliedPromocode, setAppliedPromocode] = useState<any>(null);
  const [isValidatingPromocode, setIsValidatingPromocode] = useState(false);
  const [finalPrice, setFinalPrice] = useState(parseFloat(data.price || '0'));
  const [originalPrice, setOriginalPrice] = useState(
    parseFloat(data.price || '0')
  );
  const [discountAmount, setDiscountAmount] = useState(0);

  // TikTok login fields (for coins only)
  const [loginId, setLoginId] = useState('');
  const [tiktokPassword, setTiktokPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'google' | 'facebook' | ''>(
    ''
  );

  // Garena
  const [password, setPassword] = useState('');

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

            console.log('Secure session data:', sessionData);

            setData({
              platform: sessionData.platform,
              uid_email: uid || '',
              type: sessionData.type,
              amount: sessionData.amount,
              price: sessionData.price.toString(),
              duration: sessionData.duration,
              level: sessionData.level,
              diamonds: sessionData.diamonds,
              storage: sessionData.storage,
            });

            // Initialize price states
            setOriginalPrice(sessionData.price);
            setFinalPrice(sessionData.price);
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

    console.log('URL Parameters Debug (fallback):', {
      platform,
      type,
      amount,
      price,
      allParams: Object.fromEntries(searchParams.entries()),
    });

    setData({
      platform,
      uid_email: uid || '',
      type,
      amount,
      price,
      duration: searchParams.get('duration') || '',
      level: searchParams.get('level') || '',
      diamonds: searchParams.get('diamonds') || '',
      storage: searchParams.get('storage') || '',
    });
    setReferredBy(searchParams.get('referredBy') || '');

    // Initialize price states
    const priceNum = parseFloat(price || '0');
    setOriginalPrice(priceNum);
    setFinalPrice(priceNum);
  }, [searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  const validatePhone = (phone: string) => /^(97|98)\d{8}$/.test(phone);
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePromocode = async () => {
    if (!promocode.trim()) {
      toast.error('Please enter a promocode');
      return;
    }

    setIsValidatingPromocode(true);
    try {
      const response = await fetch('/api/promocodes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promocodeName: promocode.trim(),
          orderAmount: originalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Invalid promocode');
        setAppliedPromocode(null);
        setFinalPrice(originalPrice);
        setDiscountAmount(0);
        return;
      }

      // Apply promocode
      setAppliedPromocode(data.promocode);
      setDiscountAmount(data.calculation.discountAmount);
      setFinalPrice(data.calculation.finalAmount);
      toast.success(
        `Promocode applied! ${data.promocode.discountPercentage}% discount`
      );
    } catch (error) {
      toast.error('Failed to validate promocode');
      setAppliedPromocode(null);
      setFinalPrice(originalPrice);
      setDiscountAmount(0);
    } finally {
      setIsValidatingPromocode(false);
    }
  };

  const removePromocode = () => {
    setPromocode('');
    setAppliedPromocode(null);
    setFinalPrice(originalPrice);
    setDiscountAmount(0);
    toast.success('Promocode removed');
  };

  // UID/Email label and placeholder logic
  let idLabel = 'Email Address';
  let idPlaceholder = 'Enter your email address';
  let idType: 'text' | 'email' = 'text';

  if (data.platform === 'freefire') {
    idLabel = 'Free Fire UID';
    idPlaceholder = 'Enter your Free Fire UID';
  } else if (data.platform === 'pubg') {
    idLabel = 'PUBG ID / Player ID';
    idPlaceholder = 'Enter your PUBG Player ID';
  } else if (data.platform === 'garena') {
    idLabel = 'Garena Account ID';
    idPlaceholder = 'Enter your Garena Account ID';
  } else if (data.platform === 'netflix') {
    idLabel = 'Email Address';
    idPlaceholder = 'Enter your email address';
    idType = 'email';
  } else if (data.platform === 'prime-video') {
    idLabel = 'Email Address';
    idPlaceholder = 'Enter your email address';
    idType = 'email';
  } else if (data.platform === 'spotify') {
    idLabel = 'Spotify Username';
    idPlaceholder = 'Enter your Spotify username';
  } else if (data.platform === 'youtube-premium') {
    idLabel = 'Gmail Account ID';
    idPlaceholder = 'Enter your Google Account ID';
    idType = 'email';
  } else if (data.platform === 'poppo') {
    idLabel = 'Poppo ID';
    idPlaceholder = 'Enter your Poppo ID';
  } else if (data.platform === 'canva' && data.type === 'pro') {
    idLabel = 'Email Address';
    idPlaceholder = 'Enter your email address';
    idType = 'email';
  } else if (data.platform === 'paypal') {
    idLabel = 'PayPal Email';
    idPlaceholder = 'Enter your PayPal email';
    idType = 'email';
  } else if (data.platform === 'skrill') {
    idLabel = 'Skrill Email';
    idPlaceholder = 'Enter your Skrill email';
    idType = 'email';
  } else if (
    data.platform === 'chatgpt' ||
    data.platform === 'chatgpt-one-year'
  ) {
    idLabel = 'Enter your email address';
    idPlaceholder = 'Enter your email address';
    idType = 'email';
  } else if (data.platform === 'instagram') {
    idLabel =
      data.type === 'followers' ? 'Instagram Username' : 'Instagram Post Link';
    idPlaceholder =
      data.type === 'followers'
        ? 'Enter your Instagram username (Paste your username)'
        : 'Enter your Instagram post link (Paste your post link)';
  } else if (data.platform === 'facebook') {
    idLabel =
      data.type === 'followers' ? 'Facebook Username' : 'Facebook Post Link';
    idPlaceholder =
      data.type === 'followers'
        ? 'Enter your Facebook username (Paste your username)'
        : 'Enter your Facebook post link (Paste your post link)';
  } else if (data.platform === 'youtube') {
    idLabel = 'YouTube Channel URL';
    idPlaceholder = 'Enter your YouTube channel URL';
  } else if (data.platform === 'tiktok' && data.type !== 'coins') {
    idLabel =
      data.type === 'followers' ? 'TikTok Username' : 'TikTok Post Link';
    idPlaceholder =
      data.type === 'followers'
        ? 'Enter your TikTok username (Paste your username)'
        : 'Enter your TikTok post link (Paste your post link)';
  }

  // ----------- Submission Logic -----------
  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    // Validation (your validation logic)
    if (!isAgeConfirmed) {
      toast.error("You must confirm you're 16 or older.");
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method.');
      return;
    }

    if (data.platform === 'tiktok' && data.type === 'coins') {
      if (!loginId || !tiktokPassword || !loginMethod || !phone || !receipt) {
        toast.error(
          'Please fill in all required TikTok fields and upload the receipt.'
        );
        return;
      }
      if (!validatePhone(phone)) {
        toast.error('Please enter a valid Nepali phone number.');
        return;
      }
    } else if (data.platform === 'facebook' && data.type !== 'followers') {
      if (!uid || !phone || !receipt) {
        toast.error(
          'कृपया Facebook को Profile वा Page को Link, फोन, र Receipt अपलोड गर्नुहोस्।'
        );
        return;
      }
      if (!validatePhone(phone)) {
        toast.error('Please enter a valid Nepali phone number.');
        return;
      }
    } else {
      if (
        (!uid && !(data.platform === 'tiktok' && data.type === 'coins')) ||
        !phone ||
        !receipt ||
        (data.platform === 'garena' && !password)
      ) {
        toast.error(
          'Please fill in all required fields and upload the receipt.'
        );
        return;
      }
      if (data.platform === 'netflix' && !validateEmail(uid)) {
        toast.error('Please enter a valid email address for Netflix.');
        return;
      }
      if (data.platform === 'youtube-premium' && !validateEmail(uid)) {
        toast.error('Please enter a valid Gmail address for YouTube Premium.');
        return;
      }
      if (!validatePhone(phone)) {
        toast.error('Please enter a valid Nepali phone number.');
        return;
      }
    }

    // Build FormData for file upload
    const formData = new FormData();
    formData.append(
      'uid_email',
      data.platform === 'tiktok' && data.type === 'coins' ? loginId : uid
    );
    formData.append('phone', phone);
    formData.append('platform', data.platform);
    formData.append('type', data.type);
    if (data.amount) formData.append('amount', data.amount);
    if (data.price) formData.append('price', data.price);
    if (data.duration) formData.append('duration', data.duration);
    if (data.level) formData.append('level', data.level);
    if (data.diamonds) formData.append('diamonds', data.diamonds);
    if (data.storage) formData.append('storage', data.storage);
    if (referredBy.trim()) formData.append('referredBy', referredBy.trim());
    formData.append('paymentMethod', selectedPaymentMethod);

    // Add promocode data if applied
    if (appliedPromocode) {
      formData.append('promocode', appliedPromocode.name);
    }

    if (data.platform === 'garena' && password) {
      formData.append('password', password);
    }
    if (data.platform === 'tiktok' && data.type === 'coins') {
      formData.append('tiktokPassword', tiktokPassword);
      formData.append('loginMethod', loginMethod);
    }
    if (receipt) {
      formData.append('receipt', receipt);
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
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
        price: data.price,
        orderId: orderData.orderId || orderData._id,
      });

      router.push(`/topup/payment/success?${successParams}`);
    } catch (error) {
      // Redirect to failure page with error details
      const failureParams = new URLSearchParams({
        platform: data.platform,
        type: data.type,
        amount: data.amount,
        price: data.price,
        orderId: generateFailedOrderId(),
        error:
          error instanceof Error ? error.message : 'Payment processing failed',
      });

      router.push(`/topup/payment/failure?${failureParams}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        You're buying <strong>{data.amount} TikTok Coins</strong> for{' '}
        <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'tiktok' && data.type !== 'coins') {
    summary = (
      <>
        You're buying{' '}
        <strong>
          {data.amount} TikTok {data.type}
        </strong>{' '}
        for <strong>NPR {finalPrice}</strong>
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

    console.log('Free Fire Diamonds Debug:', {
      platform: data.platform,
      type: data.type,
      amount: data.amount,
      duration: data.duration,
      diamondCount: diamondCount,
      finalPrice: finalPrice,
    });
    summary = (
      <>
        You're buying <strong>{diamondCount} diamonds</strong> for{' '}
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
        for <strong>NPR {finalPrice}</strong>
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
        for <strong>NPR {finalPrice}</strong>
      </>
    );
  } else if (data.platform === 'youtube' && data.type === 'subscribers') {
    summary = (
      <>
        You're buying{' '}
        <strong>
          {data.amount} {data.type == 'subscribers' ? 'Subscribers' : 'Views'}
        </strong>{' '}
        for <strong>NPR {finalPrice}</strong>
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
        for <strong>NPR {finalPrice}</strong>
      </>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-purple-700 text-center capitalize">
        {data.platform}{' '}
        {data.type === 'usd' ? data.type.toUpperCase() : data.type} Payment
      </h1>

      <p className="text-center text-lg mb-2">{summary}</p>

      <p className="text-sm text-center text-gray-500 italic">
        ⚠️ Please double-check all your details before submitting. Incorrect
        info may delay your delivery.
      </p>

      {/* TikTok Coin Purchase: Login Fields */}
      {data.platform === 'tiktok' && data.type === 'coins' && (
        <div className="space-y-3">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              TikTok Login ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your TikTok Login ID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              TikTok Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter your TikTok password"
              value={tiktokPassword}
              onChange={(e) => setTiktokPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Login Method <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  value="google"
                  checked={loginMethod === 'google'}
                  onChange={() => setLoginMethod('google')}
                  className="accent-[#ff0050]"
                />
                Google
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  value="facebook"
                  checked={loginMethod === 'facebook'}
                  onChange={() => setLoginMethod('facebook')}
                  className="accent-[#1877f2]"
                />
                Facebook
              </label>
            </div>
          </div>
        </div>
      )}

      {/* UID or Email Field (not for TikTok coins) */}
      {!(data.platform === 'tiktok' && data.type === 'coins') && (
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            {idLabel} <span className="text-red-500">*</span>
          </label>
          <input
            type={idType}
            placeholder={idPlaceholder}
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      )}

      {/* Garena Password */}
      {data.platform === 'garena' && (
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Garena Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            placeholder="Enter your Garena password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            autoComplete="current-password"
          />
        </div>
      )}

      {/* Phone */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          placeholder="9800000000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
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
              <span className="font-medium">NPR {originalPrice}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>- NPR {discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-1">
              <span className="font-semibold">Final Price:</span>
              <span className="font-bold text-lg">NPR {finalPrice}</span>
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
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              id: 'esewa',
              label: 'eSewa',
              qrImage: '/esewa.jpg',
              color: 'from-orange-400 to-orange-600',
              borderColor: 'border-orange-300',
              selectedBorderColor: 'border-orange-500',
              icon: '💳',
            },
            {
              id: 'khalti',
              label: 'Khalti/IME',
              qrImage: '/khalti.jpg',
              color: 'from-purple-400 to-purple-600',
              borderColor: 'border-purple-300',
              selectedBorderColor: 'border-purple-500',
              icon: '📱',
            },
            {
              id: 'bank',
              label: 'Bank Transfer',
              qrImage: '/bank.jpg',
              color: 'from-green-400 to-green-600',
              borderColor: 'border-green-300',
              selectedBorderColor: 'border-green-500',
              icon: '🏦',
            },
          ].map((method) => (
            <div
              key={method.id}
              onClick={() => setSelectedPaymentMethod(method.id)}
              className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedPaymentMethod === method.id
                  ? `${method.selectedBorderColor} border-2 shadow-lg scale-105`
                  : `${method.borderColor} border-2 hover:border-gray-400`
              } rounded-xl p-4 text-center bg-white shadow-sm`}
            >
              {/* Selection Indicator */}
              {selectedPaymentMethod === method.id && (
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

              {/* Method Icon */}
              <div className="text-3xl mb-2">{method.icon}</div>

              {/* Method Label */}
              <p className="font-semibold text-gray-800 mb-3">{method.label}</p>

              {/* QR Code */}
              <div className="w-64 h-64 mx-auto mb-3 flex items-center justify-center">
                <Image
                  src={method.qrImage}
                  alt={`${method.label} QR`}
                  width={256}
                  height={256}
                  className="object-contain w-full h-full"
                />
              </div>

              {/* Selection Status */}
              <div
                className={`text-sm font-medium ${
                  selectedPaymentMethod === method.id
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                {selectedPaymentMethod === method.id
                  ? '✓ Selected'
                  : 'Click to select'}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Payment Method Info */}
        {selectedPaymentMethod && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Selected:</span>{' '}
              {selectedPaymentMethod === 'esewa'
                ? 'eSewa'
                : selectedPaymentMethod === 'khalti'
                ? 'Khalti/IME'
                : selectedPaymentMethod === 'bank'
                ? 'Bank Transfer'
                : ''}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Please scan the QR code above and upload your payment receipt
              after completing the transaction.
            </p>
          </div>
        )}
      </div>

      {/* Receipt Upload */}
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
          disabled={!isAgeConfirmed || isSubmitting}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
        </Button>
      </div>
    </div>
  );
}
