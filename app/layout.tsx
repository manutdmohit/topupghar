import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import HeaderSection from '@/components/header';
import FooterSection from '@/components/FooterSection';

export const metadata: Metadata = {
  title: 'Topup Ghar || Instant Game Topups and Digital Services',
  description:
    'Topup Ghar is a platform for seamless payments and easy transactions for games and digital services. Topup Ghar offers a wide range of digital products, including game top-ups, premium accounts, gift cards, streaming services, mobile credits, and console games. With Topup Ghar, you can easily purchase and redeem these products with just a few clicks.',
  generator: 'Topup Ghar',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <main>
          <HeaderSection />
          {children}
          <FooterSection />
        </main>
      </body>
    </html>
  );
}
