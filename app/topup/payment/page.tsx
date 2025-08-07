'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { generateFailedOrderId } from '@/lib/order-utils';

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TikTok login fields (for coins only)
  const [loginId, setLoginId] = useState('');
  const [tiktokPassword, setTiktokPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'google' | 'facebook' | ''>(
    ''
  );

  // Garena
  const [password, setPassword] = useState('');

  useEffect(() => {
    setData({
      platform: searchParams.get('platform') || '',
      uid_email: uid || '',
      type: searchParams.get('type') || '',
      amount: searchParams.get('amount') || '',
      price: searchParams.get('price') || '',
      duration: searchParams.get('duration') || '',
      level: searchParams.get('level') || '',
      diamonds: searchParams.get('diamonds') || '',
      storage: searchParams.get('storage') || '',
    });
    setReferredBy(searchParams.get('referredBy') || '');
  }, [searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  const validatePhone = (phone: string) => /^(97|98)\d{8}$/.test(phone);
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
        for <strong>₹ {data.price}</strong>
      </>
    );
  } else if (data.platform === 'tiktok' && data.type === 'coins') {
    summary = (
      <>
        You're buying <strong>{data.amount} TikTok Coins</strong> for{' '}
        <strong>NPR {data.price}</strong>
      </>
    );
  } else if (data.platform === 'tiktok' && data.type !== 'coins') {
    summary = (
      <>
        You're buying{' '}
        <strong>
          {data.amount} TikTok {data.type}
        </strong>{' '}
        for <strong>NPR {data.price}</strong>
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
        <strong>NPR {data.price}</strong>
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
        <strong>NPR {data.price}</strong>
      </>
    );
  } else if (data.platform === 'freefire' && data.type === 'airdrop') {
    summary = (
      <>
        You're buying <strong> AirDrop</strong> for{' '}
        <strong>NPR {data.price}</strong>
      </>
    );
  } else if (data.platform === 'freefire' && data.type === 'level-up') {
    summary = (
      <>
        You're buying <strong> Level {data.level} Level-Up Package</strong> with{' '}
        {data.diamonds} diamonds for <strong>NPR {data.price}</strong>
      </>
    );
  } else if (data.platform === 'chatgpt') {
    summary = (
      <>
        You're buying{' '}
        <strong>1 Month {data.type.toUpperCase()} ChatGPT Plus Account </strong>{' '}
        for <strong>NPR {data.price}</strong>
      </>
    );
  } else if (data.platform === 'chatgpt-one-year') {
    summary = (
      <>
        You're buying{' '}
        <strong>1 Year {data.type.toUpperCase()} ChatGPT Plus Account </strong>{' '}
        for <strong>NPR {data.price}</strong>
      </>
    );
  } else if (data.platform === 'perplexity') {
    summary = (
      <>
        You're buying <strong>{data.duration} Perplexity AI Pro </strong> for{' '}
        <strong>NPR {data.price}</strong>
      </>
    );
  } else if (data.platform === 'prime-video') {
    summary = (
      <>
        You're buying{' '}
        <strong className="text-sm">
          {data.duration} Prime Video 4K HD Subscription (5 Device Access){' '}
        </strong>{' '}
        for <strong>NPR {data.price}</strong>
      </>
    );
  } else if (data.platform === 'netflix 4k hd') {
    summary = (
      <>
        You're buying{' '}
        <strong className="text-sm">
          1 Month 4K HD {data.type} Netflix Subscription
        </strong>{' '}
        for <strong>NPR {data.price}</strong>
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
          You're buying {data.duration} Microsoft 365 for NPR {data.price} with{' '}
          {data.storage} storage
        </strong>
      </>
    );
  } else if (data.platform === 'coursera') {
    summary = (
      <>
        <strong className="text-sm">
          You're buying {data.duration} Coursera Plus for NPR {data.price}
        </strong>
      </>
    );
  } else if (data.platform === 'freefire' && data.type === 'evo-access') {
    summary = (
      <strong>
        You're buying <strong>Evo Access for {data.duration}</strong> for{' '}
        <strong>NPR {data.price}</strong>
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
        for <strong>NPR {data.price}</strong>
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
        for <strong>NPR {data.price}</strong>
      </>
    );
  } else if (data.platform === 'youtube' && data.type === 'subscribers') {
    summary = (
      <>
        You're buying{' '}
        <strong>
          {data.amount} {data.type == 'subscribers' ? 'Subscribers' : 'Views'}
        </strong>{' '}
        for <strong>NPR {data.price}</strong>
      </>
    );
  } else {
    summary = (
      <>
        You're buying{' '}
        <strong>
          {data.amount}
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
        for <strong>NPR {data.price}</strong>
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
          Choose any method below to make payment
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              label: 'eSewa',
              qrImage: '/esewa.jpg',
            },
            {
              label: 'Khalti/IME',
              qrImage: '/khalti.jpg',
            },
            {
              label: 'Bank Transfer',
              id: '1234567890',
              qrImage: '/bank.jpg',
            },
          ].map((method, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-4 text-center bg-white shadow-sm"
            >
              <div className="w-48 h-48 mx-auto mb-2 flex items-center justify-center">
                <Image
                  src={method.qrImage}
                  alt={`${method.label} QR`}
                  width={180}
                  height={180}
                  className="object-contain w-full h-full"
                />
              </div>
              <p className="font-medium text-gray-700">{method.label}</p>
            </div>
          ))}
        </div>
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
