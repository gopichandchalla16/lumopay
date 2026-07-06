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

export async function getAgreement(contractId: string): Promise<Agreement | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SOROBAN_RPC_URL}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'simulateTransaction',
          params: { transaction: contractId },
        }),
      }
    );
    if (!response.ok) return null;
    return null;
  } catch {
    return null;
  }
}

export async function fetchEarningsHistory(
  contractorAddress: string,
  contractId: string
): Promise<EarningsRecord[]> {
  try {
    const horizonUrl = process.env.NEXT_PUBLIC_HORIZON_URL ||
      'https://horizon-testnet.stellar.org';
    const response = await fetch(
      `${horizonUrl}/contracts/${contractId}/operations?limit=200&order=desc`
    );
    if (!response.ok) return [];
    const data = await response.json();
    if (!data._embedded || !data._embedded.records) return [];
    const records: EarningsRecord[] = data._embedded.records
      .filter((op: Record<string, string>) =>
        op.type === 'invoke_host_function' &&
        op.function === 'HostFunctionTypeInvokeContract'
      )
      .map((op: Record<string, string>, index: number) => ({
        milestoneIndex: index,
        amount: '0',
        timestamp: Math.floor(new Date(op.created_at).getTime() / 1000),
        clientAddress: op.source_account || '',
        contractorAddress: contractorAddress,
        txHash: op.transaction_hash || '',
      }));
    return records;
  } catch {
    return [];
  }
}

export async function signAndSubmitTransaction(xdr: string): Promise<string> {
  if (typeof window === 'undefined' || !window.freighter) {
    throw new Error('Freighter wallet not found.');
  }
  const signed = await window.freighter.signTransaction(xdr, {
    networkPassphrase:
      process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
      'Test SDF Network ; September 2015',
  });
  return signed;
}
