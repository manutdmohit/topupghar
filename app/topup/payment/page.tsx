'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function TopupPaymentPage() {
  const searchParams = useSearchParams();

  const [data, setData] = useState({
    platform: '',
    type: '',
    amount: '',
    price: '',
  });

  const [uid, setUid] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);

  useEffect(() => {
    setData({
      platform: searchParams.get('platform') || '',
      type: searchParams.get('type') || '',
      amount: searchParams.get('amount') || '',
      price: searchParams.get('price') || '',
    });
  }, [searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!uid || !email || !phone || !receipt) {
      alert(
        'Please fill in all fields and upload a receipt before submitting.'
      );
      return;
    }

    // TODO: Send data to backend or store in database
    console.log({
      uid,
      email,
      phone,
      platform: data.platform,
      amount: data.amount,
      type: data.type,
      price: data.price,
      receipt,
    });

    alert('Order submitted successfully. Admin will verify your payment.');
  };

  if (!data.platform) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-8">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-purple-700 text-center capitalize">
        {data.platform} {data.type} Payment
      </h1>

      {/* Summary */}
      <p className="text-center text-lg">
        You're buying <strong>{data.amount}</strong> {data.type} for{' '}
        <strong>रू {Number(data.price).toLocaleString('ne-NP')}</strong>
      </p>

      {/* UID */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Free Fire UID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter your Free Fire UID"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
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
          required
        />
      </div>

      {/* Payment Methods */}
      <div>
        <p className="text-center text-lg font-semibold text-gray-700 mb-4">
          Choose any method below to make payment
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {/* eSewa */}
          <div className="border rounded-xl p-4 text-center bg-white shadow-sm">
            <Image
              src="/free-fire.jpg" // your QR or logo
              alt="eSewa QR"
              width={180}
              height={180}
              className="mx-auto mb-2"
            />
            <p className="font-medium text-gray-700">eSewa</p>
            <p className="text-sm text-gray-500">ID: 9860000000</p>
          </div>

          {/* Khalti */}
          <div className="border rounded-xl p-4 text-center bg-white shadow-sm">
            <Image
              src="/free-fire.jpg"
              alt="Khalti QR"
              width={180}
              height={180}
              className="mx-auto mb-2"
            />
            <p className="font-medium text-gray-700">Khalti</p>
            <p className="text-sm text-gray-500">ID: khalti@yourname</p>
          </div>

          {/* Bank Transfer */}
          <div className="border rounded-xl p-4 text-center bg-white shadow-sm">
            <Image
              src="/free-fire.jpg"
              alt="Bank QR"
              width={180}
              height={180}
              className="mx-auto mb-2"
            />
            <p className="font-medium text-gray-700">Bank Transfer</p>
            <p className="text-sm text-gray-500">Account: 1234567890</p>
            <p className="text-sm text-gray-500">NIC Asia | Bijay Ghimire</p>
          </div>

          {/* IME Pay (optional) */}
          <div className="border rounded-xl p-4 text-center bg-white shadow-sm">
            <Image
              src="/free-fire.jpg"
              alt="IME Pay QR"
              width={180}
              height={180}
              className="mx-auto mb-2"
            />
            <p className="font-medium text-gray-700">IME Pay</p>
            <p className="text-sm text-gray-500">ID: 9800000000</p>
          </div>
        </div>
      </div>

      {/* Receipt Upload */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Upload Payment Receipt <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
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
