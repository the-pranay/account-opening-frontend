import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Bank Account Opening System | Enterprise Banking',
  description: 'Enterprise-grade Bank Account Opening System for bank executives to open and manage customer accounts.',
  keywords: ['banking', 'account opening', 'savings', 'current', 'enterprise', 'core banking'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
