'use client';
import { useWallet } from '@/hooks/useWallet';
import { shortenAddress } from '@/lib/stellar';

export default function WalletConnect() {
  const { publicKey, connecting, error, connect, disconnect } = useWallet();

  if (publicKey) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(30,41,59,0.6)' }}>
          <span className="w-2 h-2 bg-green-400 rounded-full" style={{ animation: 'pulse 3s infinite' }} />
          <span className="font-mono-data text-xs" style={{ color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>
            {shortenAddress(publicKey)}
          </span>
        </div>
        <button onClick={disconnect} className="text-xs transition-colors" style={{ color: '#475569' }}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button onClick={connect} disabled={connecting} className="btn-primary text-sm">
        {connecting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Connecting
          </span>
        ) : 'Connect Wallet'}
      </button>
      {error && <p className="text-xs max-w-[220px] text-right leading-tight" style={{ color: '#EF4444' }}>{error}</p>}
    </div>
  );
}
