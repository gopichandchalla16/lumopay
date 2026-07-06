'use client';
import { useWallet } from '@/hooks/useWallet';
import { shortenAddress } from '@/lib/stellar';

export default function WalletConnect() {
  const { publicKey, connecting, error, connect, disconnect } = useWallet();

  if (publicKey) {
    return (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 bg-green-900/40 text-green-400 border border-green-800/60 px-3 py-1.5 rounded-full text-sm font-mono">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          {shortenAddress(publicKey)}
        </span>
        <button
          onClick={disconnect}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={connect}
        disabled={connecting}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95"
      >
        {connecting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Connecting...
          </span>
        ) : (
          'Connect Freighter'
        )}
      </button>
      {error && (
        <p className="text-red-400 text-xs max-w-[200px] text-right leading-tight">{error}</p>
      )}
    </div>
  );
}
