import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import WalletConnect from '@/components/WalletConnect';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LumoPay — Cross-Border Milestone Payments on Stellar',
  description:
    'Structured cross-border payments and portable earnings records for independent workers. Powered by Stellar and Soroban.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">L</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight group-hover:text-indigo-400 transition-colors">
                LumoPay
              </span>
              <span className="hidden sm:inline text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                Testnet
              </span>
            </Link>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/create"
                className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors"
              >
                New Agreement
              </Link>
              <WalletConnect />
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-140px)]">
          {children}
        </main>

        <footer className="border-t border-gray-800/60 py-6 mt-16">
          <p className="text-center text-gray-600 text-xs">
            LumoPay · Built on Stellar Testnet · Stellar Journey to Mastery Level 4 ·{' '}
            <a
              href="https://github.com/gopichandchalla16/lumopay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-400 transition-colors"
            >
              GitHub
            </a>
          </p>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
