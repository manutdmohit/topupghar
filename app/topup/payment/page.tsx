'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function TopupPaymentPage() {
  const searchParams = useSearchParams();

  const [data, setData] = useState({
    platform: '',
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

  // TikTok fields
  const [loginId, setLoginId] = useState('');
  const [tiktokPassword, setTiktokPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'google' | 'facebook' | ''>(
    ''
  );

  // Garena
  const [password, setPassword] = useState('');

  // Facebook
  const [facebookLink, setFacebookLink] = useState('');

  useEffect(() => {
    setData({
      platform: searchParams.get('platform') || '',
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
  } else if (data.platform === 'spotify') {
    idLabel = 'Spotify Username';
    idPlaceholder = 'Enter your Spotify username';
    idType = 'text';
  } else if (data.platform === 'youtube-premium') {
    idLabel = 'Gmail Account ID';
    idPlaceholder = 'Enter your Google Account ID';
    idType = 'email';
  } else if (data.platform === 'poppo') {
    idLabel = 'Poppo ID';
    idPlaceholder = 'Enter your Poppo ID';
    idType = 'text';
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
        ? 'Enter your Instagram username(Paste your username)'
        : 'Enter your Instagram post link(Paste your post link)';
    idType = 'text';
  } else if (data.platform === 'facebook') {
    idLabel =
      data.type === 'followers' ? 'Facebook Username' : 'Facebook Post Link';
    idPlaceholder =
      data.type === 'followers'
        ? 'Enter your Facebook username(Paste your username)'
        : 'Enter your Facebook post link(Paste your post link)';
    idType = 'text';
  }

  // ----------- Submission Logic -----------
  const handleSubmit = () => {
    // TikTok validation
    if (data.platform === 'tiktok') {
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
    } else if (data.platform === 'facebook') {
      if (!facebookLink || !phone || !receipt) {
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
        !uid ||
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

    // Simulated submission logic
    console.log({
      id:
        data.platform === 'tiktok'
          ? loginId
          : data.platform === 'facebook'
          ? facebookLink
          : uid,
      password: data.platform === 'garena' ? password : undefined,
      tiktokPassword: data.platform === 'tiktok' ? tiktokPassword : undefined,
      loginMethod: data.platform === 'tiktok' ? loginMethod : undefined,
      facebookLink: data.platform === 'facebook' ? facebookLink : undefined,
      phone,
      platform: data.platform,
      amount: data.amount,
      type: data.type,
      price: data.price,
      duration: data.duration,
      receipt,
      referredBy: referredBy.trim(),
    });

    toast.success(
      `🎉 Order placed for ${
        data.platform === 'netflix'
          ? `${data.duration} Netflix account`
          : data.platform === 'youtube-premium'
          ? `${data.duration} YouTube Premium account`
          : data.platform === 'tiktok'
          ? `${data.amount} TikTok coins`
          : data.platform === 'facebook'
          ? `${data.amount} Facebook boost`
          : `${data.amount} ${data.type}`
      }. Admin will verify it soon.`
    );

    // Reset form
    setUid('');
    setPassword('');
    setTiktokPassword('');
    setLoginId('');
    setLoginMethod('');
    setPhone('');
    setFacebookLink('');
    setReceipt(null);
    setReferredBy('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    setTimeout(() => {
      window.location.reload();
    }, 2000);
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
  } else if (data.platform === 'tiktok') {
    summary = (
      <>
        You're buying <strong>{data.amount} TikTok Coins</strong> for{' '}
        <strong>NPR {data.price}</strong>
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
  } else if (data.platform === 'prime video') {
    summary = (
      <>
        You're buying{' '}
        <strong className="text-sm">
          {data.duration} Prime Video 4K HD Subscription(5 device Access){' '}
        </strong>{' '}
        for <strong>NPR {data.price}</strong>
      </>
    );
  } else if (data.platform === 'netflix 4k hd') {
    summary = (
      <>
        You're buying{' '}
        <strong className="text-sm">
          1 Month {data.type === 'full' ? '4K Full Account' : '4K 1 Screen'}{' '}
          Netflix
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
  } else if (
    data.platform === 'linkedin' ||
    data.platform === 'figma' ||
    data.platform === 'you.com' ||
    data.platform === 'nordvpn'
  ) {
    // Add your platform here
    summary = // Add your platform here
      (
        <>
          <strong className="text-sm">
            {data.platform === 'linkedin'
              ? 'You are buying LinkedIn Premium of 1 Year for NPR'
              : data.platform === 'figma'
              ? 'You are buying Figma Professional of 1 Year for NPR'
              : data.platform === 'you.com'
              ? 'You are buying You.com subsscription of 1 Year for NPR'
              : data.platform === 'nordvpn'
              ? `You are buying NordVPN subscription of ${data.duration}  for NPR`
              : 'You are buying LinkedIn Premium for NPR'}{' '}
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

      {/* TikTok Login Fields */}
      {data.platform === 'tiktok' && (
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

      {/* Facebook Link Field */}
      {/* {data.platform === 'facebook' && (
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Facebook Link <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            placeholder="https://facebook.com/yourpage"
            value={facebookLink}
            onChange={(e) => setFacebookLink(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
      )} */}

      {/* UID or Email (hide for TikTok/Facebook) */}
      {data.platform !== 'tiktok' && (
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
            { label: 'eSewa', id: '9860000000' },
            { label: 'Khalti', id: 'khalti@yourname' },
            {
              label: 'Bank Transfer',
              id: '1234567890',
              extra: 'NIC Asia | Bijay Ghimire',
            },
            { label: 'IME Pay', id: '9800000000' },
          ].map((method, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-4 text-center bg-white shadow-sm"
            >
              <Image
                src="/free-fire.jpg"
                alt={`${method.label} QR`}
                width={180}
                height={180}
                className="mx-auto mb-2"
              />
              <p className="font-medium text-gray-700">{method.label}</p>
              <p className="text-sm text-gray-500">ID: {method.id}</p>
              {method.extra && (
                <p className="text-sm text-gray-500">{method.extra}</p>
              )}
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
        <Button
          onClick={handleSubmit}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700"
        >
          Submit for Verification
        </Button>
      </div>
    </div>
  );
}
