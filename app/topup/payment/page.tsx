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
  const [receipt, setReceipt] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    idLabel = 'Netflix Email Address';
    idPlaceholder = 'Enter your Netflix email';
    idType = 'email';
  }

  // For Netflix, require email
  const handleSubmit = () => {
    if (!uid || !phone || !receipt) {
      toast.error('Please fill in all required fields and upload the receipt.');
      return;
    }

    if (data.platform === 'netflix' && !validateEmail(uid)) {
      toast.error('Please enter a valid email address for Netflix.');
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
        for <strong>रू {data.price}</strong>
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

      {/* UID or Email */}
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
