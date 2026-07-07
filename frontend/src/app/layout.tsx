import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import WalletConnect from '@/components/WalletConnect';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'LumoPay — Cross-Border Milestone Payments on Stellar',
  description: 'Structured milestone payments and portable earnings records for independent workers. Powered by Stellar and Soroban.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav-blur sticky top-0 z-50 border-b" style={{ backgroundColor: 'rgba(5,11,24,0.85)', borderColor: 'rgba(30,41,59,0.6)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #F5A623 0%, #FBBF24 100%)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="rgba(5,11,24,0.9)" />
                  <path d="M8 12h8M12 8v8" stroke="rgba(5,11,24,0.9)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>LumoPay</span>
              <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full" style={{ color: '#475569', backgroundColor: 'rgba(13,27,46,0.8)', border: '1px solid rgba(30,41,59,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>testnet</span>
            </Link>
            <div className="flex items-center gap-5">
              <Link href="/create" className="hidden sm:block text-sm transition-colors" style={{ color: '#64748B', fontFamily: 'Space Grotesk, sans-serif' }}>
                New Agreement
              </Link>
              <a href="https://github.com/gopichandchalla16/lumopay" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 text-xs transition-colors" style={{ color: '#334155' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <WalletConnect />
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
          {children}
        </main>

        <footer className="border-t py-8 mt-16" style={{ borderColor: 'rgba(30,41,59,0.4)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: '#334155', fontFamily: 'Space Grotesk, sans-serif' }}>LumoPay · Stellar Journey to Mastery Level 4</p>
            <div className="flex items-center gap-4">
              <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="text-xs transition-colors" style={{ color: '#334155' }}>Stellar</a>
              <a href="https://github.com/gopichandchalla16/lumopay" target="_blank" rel="noopener noreferrer" className="text-xs transition-colors" style={{ color: '#334155' }}>GitHub</a>
              <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" className="text-xs transition-colors" style={{ color: '#334155' }}>Freighter</a>
            </div>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
