'use client';

export interface Milestone {
  description: string;
  amount: string;
  status: 'Pending' | 'Submitted' | 'Released';
}

export interface Agreement {
  client: string;
  contractor: string;
  token: string;
  total_amount: string;
  milestones: Milestone[];
  status: 'Active' | 'Completed';
}

export interface EarningsRecord {
  milestoneIndex: number;
  amount: string;
  timestamp: number;
  clientAddress: string;
  contractorAddress: string;
  txHash: string;
}

export async function fetchEarningsHistory(
  contractorAddress: string,
  contractId: string
): Promise<EarningsRecord[]> {
  if (!contractId || !contractorAddress) return [];
  try {
    const horizonUrl = process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';
    const res = await fetch(`${horizonUrl}/contracts/${contractId}/operations?limit=200&order=desc`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data._embedded?.records) return [];
    return (data._embedded.records as Record<string, string>[])
      .filter((op) => op.type === 'invoke_host_function')
      .map((op, i) => ({
        milestoneIndex: i,
        amount: '0',
        timestamp: Math.floor(new Date(op.created_at || Date.now().toString()).getTime() / 1000),
        clientAddress: op.source_account || '',
        contractorAddress,
        txHash: op.transaction_hash || '',
      }));
  } catch { return []; }
}

export async function signAndSubmitTransaction(xdr: string): Promise<string> {
  if (typeof window === 'undefined' || !window.freighter) throw new Error('Freighter wallet not found.');
  const signed = await window.freighter.signTransaction(xdr, {
    networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  });
  return signed;
}
