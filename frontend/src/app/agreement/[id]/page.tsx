'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import WalletConnect from '@/components/WalletConnect';
import MilestoneCard from '@/components/MilestoneCard';
import EarningsTimeline from '@/components/EarningsTimeline';
import { shortenAddress } from '@/lib/stellar';

interface MilestoneState { description: string; amount: string; status: 'Pending' | 'Submitted' | 'Released'; }

const DEMO_MILESTONES: MilestoneState[] = [
  { description: 'Initial wireframes and design mockup', amount: '150', status: 'Pending' },
  { description: 'Frontend implementation and responsive layout', amount: '300', status: 'Pending' },
  { description: 'Final delivery, QA, and documentation', amount: '200', status: 'Pending' },
];

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || '';

export default function AgreementView() {
  const params = useParams();
  const id = params.id as string;
  const { publicKey } = useWallet();
  const [milestones, setMilestones] = useState<MilestoneState[]>(DEMO_MILESTONES);
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);

  const userRole = publicKey ? 'observer' : 'observer';
  const totalAmount = milestones.reduce((sum, m) => sum + parseFloat(m.amount), 0);
  const releasedAmount = milestones.filter((m) => m.status === 'Released').reduce((sum, m) => sum + parseFloat(m.amount), 0);
  const progress = totalAmount > 0 ? (releasedAmount / totalAmount) * 100 : 0;

  const handleSubmit = async (i: number) => {
    setLoadingIdx(i);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const next = [...milestones]; next[i].status = 'Submitted'; setMilestones(next);
    } finally { setLoadingIdx(null); }
  };

  const handleRelease = async (i: number) => {
    setLoadingIdx(i);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const next = [...milestones]; next[i].status = 'Released'; setMilestones(next);
    } finally { setLoadingIdx(null); }
  };

  if (!publicKey) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-8">
        <h1 className="font-bold text-2xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Work Agreement</h1>
        <div className="rounded-2xl p-10 space-y-5" style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(30,41,59,0.6)' }}>
          <p className="text-sm" style={{ color: '#64748B' }}>Connect your Freighter wallet to view and interact with this agreement.</p>
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="font-bold text-2xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Work Agreement</h1>
        <p className="text-xs break-all" style={{ color: '#334155', fontFamily: 'JetBrains Mono, monospace' }}>{id}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Value', value: `${totalAmount} USDC`, color: '#F1F5F9' },
          { label: 'Released', value: `${releasedAmount} USDC`, color: '#4ADE80' },
          { label: 'Milestones', value: `${milestones.filter((m) => m.status === 'Released').length} / ${milestones.length}`, color: '#F5A623' },
          { label: 'Your Role', value: userRole, color: '#94A3B8' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 space-y-1">
            <p className="text-xs uppercase tracking-wider" style={{ color: '#475569', fontFamily: 'Space Grotesk, sans-serif' }}>{stat.label}</p>
            <p className="font-bold text-sm capitalize" style={{ color: stat.color, fontFamily: 'Space Grotesk, sans-serif' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs" style={{ color: '#475569' }}>
          <span>Progress</span><span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(30,41,59,0.6)' }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #F5A623, #4ADE80)' }} />
        </div>
      </div>

      <div className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(10,22,40,0.5)', border: '1px solid rgba(30,41,59,0.4)' }}>
        <span className="text-xs" style={{ color: '#334155' }}>Connected</span>
        <span className="text-xs" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{shortenAddress(publicKey)}</span>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Milestones</h2>
        {milestones.map((m, i) => (
          <MilestoneCard key={i} index={i} description={m.description} amount={m.amount} status={m.status} userRole={userRole}
            isLoading={loadingIdx === i}
            onSubmit={userRole === 'contractor' ? () => handleSubmit(i) : undefined}
            onRelease={userRole === 'client' ? () => handleRelease(i) : undefined}
          />
        ))}
      </div>

      <div className="pt-6" style={{ borderTop: '1px solid rgba(30,41,59,0.5)' }}>
        <EarningsTimeline contractorAddress={publicKey} contractId={CONTRACT_ID} />
      </div>
    </div>
  );
}
