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

  const [uid, setUid] = useState('');
  const [phone, setPhone] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [is18Plus, setIs18Plus] = useState(false);
  const [showAgeError, setShowAgeError] = useState(false);

  useEffect(() => {
    setData({
      platform: searchParams.get('platform') || '',
      type: searchParams.get('type') || '',
      amount: searchParams.get('amount') || '',
      price: searchParams.get('price') || '',
      duration: searchParams.get('duration') || '',
    });
  }, [searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  const validatePhone = (phone: string) => /^(97|98)\d{8}$/.test(phone);

  // Label logic
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
    idLabel = 'Netflix Email Address';
    idPlaceholder = 'Enter your Netflix email';
    idType = 'email';
  } else if (data.platform === 'facebook') {
    idLabel = 'Facebook Account/Page Link';
    idPlaceholder = 'Paste your Facebook profile or page link here';
  }

  const isUidValid = () => {
    if (!uid) return false;
    if (data.platform === 'netflix')
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(uid);
    if (data.platform === 'facebook') return uid.startsWith('http'); // simple check for a link
    return true;
  };

  const isPhoneValid = () => validatePhone(phone);

  const isFormReady = is18Plus && isUidValid() && isPhoneValid() && !!receipt;

  const handleSubmit = () => {
    if (!is18Plus) {
      setShowAgeError(true);
      toast.error('You must confirm you are 18 or older to proceed.');
      return;
    }
    setShowAgeError(false);

    if (!uid || !phone || !receipt) {
      toast.error('Please fill in all required fields and upload the receipt.');
      return;
    }

    if (
      data.platform === 'netflix' &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(uid)
    ) {
      toast.error('Please enter a valid email address for Netflix.');
      return;
    }

    if (data.platform === 'facebook' && !uid.startsWith('http')) {
      toast.error('Please enter a valid Facebook profile or page link.');
      return;
    }

    if (!validatePhone(phone)) {
      toast.error('Please enter a valid Nepali phone number.');
      return;
    }

    // Simulated submission logic
    console.log({
      id: uid,
      phone,
      platform: data.platform,
      amount: data.amount,
      type: data.type,
      price: data.price,
      duration: data.duration,
      receipt,
    });

    toast.success(
      `🎉 Order placed for ${
        data.platform === 'netflix'
          ? `${data.duration} Netflix account`
          : `${data.amount} ${data.type}`
      }. Admin will verify it soon.`
    );

    // Reset form
    setUid('');
    setPhone('');
    setReceipt(null);
    setIs18Plus(false);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  if (!data.platform) return null;

  // -------- Summary Logic ----------
  let summary;
  if (data.platform === 'netflix') {
    summary = (
      <>
        You're buying <strong>Netflix account for {data.duration}</strong> for{' '}
        <strong>₹ {data.price}</strong>
      </>
    );
  } else if (data.platform === 'facebook') {
    summary = (
      <>
        You're buying <strong>{data.amount} Facebook followers</strong> for{' '}
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

      {/* UID / Email / Facebook Link */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          {idLabel} <span className="text-red-500">*</span>
        </label>
        <input
          type={idType}
          placeholder={idPlaceholder}
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg ${
            !isUidValid() ? 'border-red-400' : ''
          }`}
        />
        {data.platform === 'netflix' &&
          uid &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(uid) && (
            <span className="text-red-500 text-sm">
              Please enter a valid email address.
            </span>
          )}
        {data.platform === 'facebook' && uid && !uid.startsWith('http') && (
          <span className="text-red-500 text-sm">
            Please enter a valid Facebook profile or page link.
          </span>
        )}
      </div>

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
          className={`w-full px-4 py-2 border rounded-lg outline-none ${
            phone && !validatePhone(phone) ? 'border-red-400' : ''
          }`}
        />
        {phone && !validatePhone(phone) && (
          <span className="text-red-500 text-sm">
            Enter a valid Nepali phone (98xxxxxxxx or 97xxxxxxxx)
          </span>
        )}
      </div>

      {/* Referred By */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Referred By{' '}
        </label>
        <input
          type="text"
          placeholder="Referred By"
          value={referredBy}
          onChange={(e) => setReferredBy(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 ${
            referredBy ? 'border-purple-500' : 'border-gray-300'
          } ${referredBy ? 'focus:border-purple-500' : 'focus:border-gray-300'}
            ${referredBy ? '' : 'border-gray-300'}`}
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

      {/* Are you 18+ Checkbox */}
      <div className="flex items-center justify-center mt-2">
        <input
          id="age-check"
          type="checkbox"
          checked={is18Plus}
          onChange={(e) => {
            setIs18Plus(e.target.checked);
            setShowAgeError(false);
          }}
          className="w-5 h-5 mr-2 accent-purple-600"
        />
        <label
          htmlFor="age-check"
          className="text-base text-gray-700 select-none"
        >
          I confirm that I am 18 years old or above
        </label>
      </div>
      {showAgeError && (
        <div className="text-center text-red-600 mt-2 font-medium">
          You must confirm you are 18 or older to proceed.
        </div>
      )}

      {/* Submit */}
      <div className="text-center">
        <Button
          onClick={handleSubmit}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700"
          disabled={!isFormReady}
        >
          Submit for Verification
        </Button>
      </div>
    </div>
  );
}
