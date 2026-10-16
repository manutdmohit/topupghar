import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund & Replacement Policy | Topup Ghar',
  description:
    'Learn about refund and replacement eligibility, support requests, and resolution times at Topup Ghar.',
};

const sections = [
  {
    title: '1. Nature of Digital Services',
    content: (
      <p>
        Most of our products are delivered digitally or activated online. Once
        a service has been delivered, activated, or account access has been
        provided, cancellation or refund may not be possible.
      </p>
    ),
  },
  {
    title: '2. Refund & Replacement Requests',
    content: (
      <>
        <p>
          We review refund and replacement requests case by case. Depending on
          the circumstances, we may provide a refund, replacement, store credit,
          or another appropriate solution when there is a verified issue,
          including:
        </p>
        <ul>
          <li>Activation failure caused by Topup Ghar</li>
          <li>Incorrect product or service delivered by Topup Ghar</li>
          <li>Duplicate payment</li>
          <li>Delivery failure caused by Topup Ghar</li>
          <li>Other verified service-related issues</li>
        </ul>
      </>
    ),
  },
  {
    title: '3. Situations Generally Not Eligible',
    content: (
      <>
        <p>Refunds or replacements are generally not available for:</p>
        <ul>
          <li>
            Incorrect information provided by the customer, such as UID, email
            address, username, or account details
          </li>
          <li>Change of mind after delivery or activation</li>
          <li>Unsupported devices, platforms, or compatibility issues</li>
          <li>Changes to third-party platform policies or restrictions</li>
          <li>
            Account restrictions, suspensions, or bans caused by customer
            activity
          </li>
          <li>Misuse of an account or service after access has been provided</li>
          <li>Failure to use a service within its stated validity period</li>
        </ul>
      </>
    ),
  },
  {
    title: '4. Shared & Private Accounts',
    content: (
      <>
        <p>
          Some subscription plans may be shared, while others may be
          private/personal accounts. Customers are advised to carefully check
          the product description before placing an order.
        </p>
        <p>
          If the account type is important to you, please confirm the details
          with us on WhatsApp before making payment.
        </p>
      </>
    ),
  },
  {
    title: '5. How to Request Support',
    content: (
      <>
        <p>
          If you experience a problem with your order, please contact us as soon
          as possible and provide:
        </p>
        <ul>
          <li>Order number or order details</li>
          <li>Name of the affected product or service</li>
          <li>Clear description of the issue</li>
          <li>Screenshots or other information required for verification</li>
        </ul>
        <p>
          Reporting an issue promptly helps us investigate and resolve it more
          efficiently.
        </p>
      </>
    ),
  },
  {
    title: '6. Resolution Time',
    content: (
      <p>
        We aim to review valid requests as quickly as possible during our
        support hours. Resolution times may vary depending on the product,
        third-party provider, order status, and information required for
        verification.
      </p>
    ),
  },
];

export default function RefundReplacementPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="mb-10 border-b border-gray-200 pb-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-purple-700">
          Customer Support
        </p>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Refund &amp; Replacement Policy
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
          At Topup Ghar, most of our products are digital subscriptions, game
          top-ups, digital currencies, and online activation services. Because
          digital products may be delivered or activated immediately after
          payment, refunds are not automatically available once an order has
          been processed.
        </p>
      </header>

      <div className="space-y-8 text-base leading-7 text-gray-700 [&_li]:pl-1 [&_p+p]:mt-4 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              {section.title}
            </h2>
            {section.content}
          </section>
        ))}

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            7. Contact Us
          </h2>
          <p>
            For refund, replacement, or order-related support, please contact
            Topup Ghar through our available support channels.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-6">
            <a
              href="mailto:topup.ghar11@gmail.com"
              className="inline-flex items-center gap-2 font-medium text-purple-700 hover:text-purple-900"
            >
              <Mail aria-hidden="true" className="h-5 w-5" />
              topup.ghar11@gmail.com
            </a>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 font-medium text-purple-700 hover:text-purple-900"
            >
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              Contact us through WhatsApp
            </Link>
          </div>
        </section>

        <p className="border-t border-gray-200 pt-6 text-sm text-gray-600">
          Topup Ghar reserves the right to verify each request and determine the
          appropriate resolution based on the circumstances of the order.
        </p>
        <p className="font-medium text-gray-900">
          Thank you for choosing Topup Ghar, your trusted partner in the digital
          world.
        </p>
      </div>
    </main>
  );
}