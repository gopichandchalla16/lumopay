'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import WalletConnect from '@/components/WalletConnect';
import MilestoneCard from '@/components/MilestoneCard';
import EarningsTimeline from '@/components/EarningsTimeline';
import { shortenAddress } from '@/lib/stellar';

interface MilestoneState {
  description: string;
  amount: string;
  status: 'Pending' | 'Submitted' | 'Released';
}

const DEMO_MILESTONES: MilestoneState[] = [
  { description: 'Initial design mockup and wireframes', amount: '150', status: 'Pending' },
  { description: 'Frontend implementation and responsive design', amount: '300', status: 'Pending' },
  { description: 'Final delivery, testing, and documentation', amount: '200', status: 'Pending' },
];

const DEMO_CLIENT = 'GCLIENT123XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'.padEnd(56, 'X').slice(0, 56);
const DEMO_CONTRACTOR = 'GCONTRACTOR123XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'.padEnd(56, 'X').slice(0, 56);
const PLACEHOLDER_CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || '';

export default function AgreementView() {
  const params = useParams();
  const id = params.id as string;
  const { publicKey } = useWallet();
  const [milestones, setMilestones] = useState<MilestoneState[]>(DEMO_MILESTONES);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const userRole =
    publicKey === DEMO_CLIENT
      ? 'client'
      : publicKey === DEMO_CONTRACTOR
      ? 'contractor'
      : 'observer';

  const handleSubmit = async (index: number) => {
    setLoadingIndex(index);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const updated = [...milestones];
      updated[index].status = 'Submitted';
      setMilestones(updated);
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleRelease = async (index: number) => {
    setLoadingIndex(index);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const updated = [...milestones];
      updated[index].status = 'Released';
      setMilestones(updated);
    } finally {
      setLoadingIndex(null);
    }
  };

  const totalAmount = milestones.reduce(
    (sum, m) => sum + parseFloat(m.amount),
    0
  );
  const releasedAmount = milestones
    .filter((m) => m.status === 'Released')
    .reduce((sum, m) => sum + parseFloat(m.amount), 0);

  if (!publicKey) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-6">
        <h1 className="text-2xl font-bold">Work Agreement</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 space-y-5">
          <p className="text-gray-400">Connect your Freighter wallet to view and interact with this agreement.</p>
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Work Agreement</h1>
        <p className="text-gray-600 font-mono text-xs break-all">ID: {id}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-1">
          <p className="text-gray-500 text-xs">Total Value</p>
          <p className="text-white font-bold">{totalAmount} USDC</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-1">
          <p className="text-gray-500 text-xs">Released</p>
          <p className="text-green-400 font-bold">{releasedAmount} USDC</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-1 col-span-2 sm:col-span-1">
          <p className="text-gray-500 text-xs">Your Role</p>
          <p className="text-indigo-400 font-bold capitalize">{userRole}</p>
        </div>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Connected: {shortenAddress(publicKey)}</span>
          <span>Network: Stellar Testnet</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Milestones</h2>
        {milestones.map((m, i) => (
          <MilestoneCard
            key={i}
            index={i}
            description={m.description}
            amount={m.amount}
            status={m.status}
            userRole={userRole}
            isLoading={loadingIndex === i}
            onSubmit={userRole === 'contractor' ? () => handleSubmit(i) : undefined}
            onRelease={userRole === 'client' ? () => handleRelease(i) : undefined}
          />
        ))}
      </div>

      <div className="border-t border-gray-800 pt-8">
        <EarningsTimeline
          contractorAddress={DEMO_CONTRACTOR}
          contractId={PLACEHOLDER_CONTRACT_ID}
        />
      </div>
    </div>
  );
}
