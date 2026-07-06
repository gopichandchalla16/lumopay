'use client';
import { useState, useEffect, useCallback } from 'react';

interface FreighterAPI {
  getPublicKey: () => Promise<string>;
  isConnected: () => Promise<boolean>;
  signTransaction: (
    xdr: string,
    opts?: { networkPassphrase?: string }
  ) => Promise<string>;
}

declare global {
  interface Window {
    freighter?: FreighterAPI;
  }
}

interface UseWalletReturn {
  publicKey: string | null;
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const STORAGE_KEY = 'lumopay_wallet';

export function useWallet(): UseWalletReturn {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPublicKey(saved);
    }
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      if (typeof window === 'undefined' || !window.freighter) {
        throw new Error(
          'Freighter wallet not found. Please install the Freighter browser extension from freighter.app'
        );
      }
      const connected = await window.freighter.isConnected();
      if (!connected) {
        throw new Error('Please open Freighter and unlock your wallet first.');
      }
      const key = await window.freighter.getPublicKey();
      if (!key) {
        throw new Error('Could not retrieve public key from Freighter.');
      }
      setPublicKey(key);
      localStorage.setItem(STORAGE_KEY, key);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to connect wallet.';
      setError(message);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    localStorage.removeItem(STORAGE_KEY);
    setError(null);
  }, []);

  return { publicKey, connecting, error, connect, disconnect };
}
