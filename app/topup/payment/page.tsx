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
  let idLabel = 'Your Game UID';
  let idPlaceholder = 'Enter your game UID';
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
  } else if (data.platform === 'facebook' && data.type === 'followers') {
    summary = (
      <>
        You're buying <strong>{data.amount} Facebook Followers</strong> for{' '}
        <strong>NPR {data.price}</strong>
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
            : data.type}
        </strong>{' '}
        for <strong>NPR {data.price}</strong>
      </>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-purple-700 text-center capitalize">
        {data.platform} {data.type} Payment
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
      {data.platform === 'facebook' && (
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Facebook को Profile वा Page को Link{' '}
            <span className="text-red-500">*</span>
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
      )}

      {/* UID or Email (hide for TikTok/Facebook) */}
      {data.platform !== 'tiktok' && data.platform !== 'facebook' && (
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
