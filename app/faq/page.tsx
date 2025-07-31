'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is Topup Ghar?',
    answer:
      'Topup Ghar is an instant digital delivery platform for games, entertainment, and digital services. We offer Free Fire diamonds, PUBG UC, TikTok coins, Garena shells, Netflix, YouTube Premium, Facebook boosts, and more—securely and instantly, with local payment options.',
  },
  {
    question: 'How do I top up my game or buy a service?',
    answer:
      "Simply select your game or service, choose a package, and click 'Buy Now.' Fill out your details, upload your payment receipt, and submit. Our team will verify and deliver your product as soon as possible.",
  },
  {
    question: 'What payment methods are supported?',
    answer:
      'We accept payments via eSewa, Khalti, IME Pay, and bank transfer (NIC Asia). All payment options and QR codes are shown on the payment page after you select a package.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Most orders are delivered within 5–15 minutes during working hours (8AM–10PM). Memberships and accounts may take up to an hour. For orders placed late at night, delivery may occur early next morning.',
  },
  {
    question: 'Do I need to provide my password?',
    answer:
      'Most products only need your user ID (e.g. Free Fire UID, PUBG ID). However, for some products like TikTok Coins or Garena Shells, login ID and password may be required for direct top-up. We NEVER share or misuse your credentials and delete them after order fulfillment.',
  },
  {
    question: 'Is my information safe?',
    answer:
      'Yes. We only use your information to fulfill your order and never share it with third parties. Passwords and sensitive data are deleted after the top-up is completed.',
  },
  {
    question: 'What if I entered a wrong ID or sent the wrong amount?',
    answer:
      'Contact our support team as soon as possible via Facebook page, email, or phone. If the top-up hasn’t been processed, we’ll try to fix it. We are not responsible for losses due to incorrect information after fulfillment.',
  },
  {
    question: 'How do I contact support?',
    answer:
      'You can reach us via Facebook Messenger, email (Topup.ghar11@gmail.com), or phone (+35795676054). Support hours: 8AM–10PM every day.',
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">
        Frequently Asked Questions
      </h1>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border rounded-xl shadow-sm bg-white">
            <button
              className="flex items-center w-full px-5 py-4 text-left group focus:outline-none"
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
            >
              <span className="flex-1 text-lg font-semibold text-gray-800">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-6 h-6 text-purple-500 transition-transform duration-300 ${
                  open === idx ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`px-5 pb-4 text-gray-600 text-base transition-all duration-300 ${
                open === idx ? 'block' : 'hidden'
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center text-sm text-gray-400">
        Didn’t find your answer?{' '}
        <a
          href="mailto:topup.ghar11@gmail.com"
          className="text-purple-600 underline hover:text-purple-800"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
