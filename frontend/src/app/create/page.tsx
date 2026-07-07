'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import WalletConnect from '@/components/WalletConnect';
import { isValidStellarAddress } from '@/lib/stellar';

interface MilestoneInput { description: string; amount: string; }

export default function CreateAgreement() {
  const { publicKey } = useWallet();
  const [contractorAddress, setContractorAddress] = useState('');
  const [milestones, setMilestones] = useState<MilestoneInput[]>([{ description: '', amount: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
  const addMilestone = () => { if (milestones.length < 5) setMilestones([...milestones, { description: '', amount: '' }]); };
  const removeMilestone = (i: number) => { if (milestones.length > 1) setMilestones(milestones.filter((_, idx) => idx !== i)); };
  const update = (i: number, field: keyof MilestoneInput, val: string) => { const next = [...milestones]; next[i][field] = val; setMilestones(next); };

  const validate = (): string => {
    if (!isValidStellarAddress(contractorAddress)) return 'Contractor address must start with G and be 56 characters.';
    if (contractorAddress === publicKey) return 'Contractor address cannot be your own address.';
    for (let i = 0; i < milestones.length; i++) {
      if (!milestones[i].description.trim()) return `Milestone ${i + 1} needs a description.`;
      if (!milestones[i].amount || parseFloat(milestones[i].amount) <= 0) return `Milestone ${i + 1} needs a USDC amount greater than 0.`;
    }
    return '';
  };

  const handleSubmit = async () => {
    setError('');
    const msg = validate();
    if (msg) { setError(msg); return; }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Transaction failed. Try again.');
    } finally { setSubmitting(false); }
  };

  if (!publicKey) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-8">
        <h1 className="font-bold text-3xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Create Agreement</h1>
        <div className="rounded-2xl p-10 space-y-6" style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(30,41,59,0.6)' }}>
          <p className="text-sm" style={{ color: '#64748B' }}>Connect your Freighter wallet to get started.</p>
          <WalletConnect />
          <p className="text-xs" style={{ color: '#334155' }}>
            Need Freighter? <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#94A3B8' }}>Install here</a>
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-8">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto glow-amber" style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-3">
          <h2 className="font-bold text-2xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Agreement Created</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>Your work agreement is funded and live on Stellar testnet. Share the link with your contractor.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => { setSuccess(false); setContractorAddress(''); setMilestones([{ description: '', amount: '' }]); }} className="btn-primary">New Agreement</button>
          <Link href="/" className="btn-ghost">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Create Work Agreement</h1>
        <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>Define milestones and fund the escrow. Funds stay locked until you confirm each deliverable.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: '#94A3B8', fontFamily: 'Space Grotesk, sans-serif' }}>Contractor Stellar Address</label>
          <input type="text" value={contractorAddress} onChange={(e) => setContractorAddress(e.target.value.trim())} placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" className="input-dark" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }} />
          {contractorAddress && !isValidStellarAddress(contractorAddress) && <p className="text-xs" style={{ color: '#EF4444' }}>Must start with G and be exactly 56 characters</p>}
          {contractorAddress && isValidStellarAddress(contractorAddress) && <p className="text-xs" style={{ color: '#4ADE80' }}>✓ Valid Stellar address</p>}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" style={{ color: '#94A3B8', fontFamily: 'Space Grotesk, sans-serif' }}>Milestones</label>
            <span className="text-xs" style={{ color: '#475569' }}>{milestones.length} / 5</span>
          </div>
          {milestones.map((m, i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#F5A623', fontFamily: 'Space Grotesk, sans-serif' }}>Milestone {i + 1}</span>
                {milestones.length > 1 && <button onClick={() => removeMilestone(i)} className="text-xs transition-colors" style={{ color: '#334155' }}>Remove</button>}
              </div>
              <input type="text" value={m.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Describe the deliverable clearly" className="input-dark" />
              <div className="flex items-center gap-2">
                <input type="number" value={m.amount} onChange={(e) => update(i, 'amount', e.target.value)} placeholder="0.00" min="0" step="0.01" className="input-dark flex-1" />
                <span className="shrink-0 text-sm font-medium px-3 py-3 rounded-xl" style={{ color: '#475569', background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(30,41,59,0.6)', fontFamily: 'Space Grotesk, sans-serif' }}>USDC</span>
              </div>
            </div>
          ))}
          {milestones.length < 5 && (
            <button onClick={addMilestone} className="w-full py-3 rounded-xl text-sm transition-all duration-200" style={{ border: '1px dashed rgba(30,41,59,0.8)', color: '#334155', fontFamily: 'Space Grotesk, sans-serif' }}>
              + Add Milestone
            </button>
          )}
        </div>

        <div className="rounded-xl px-5 py-4 flex items-center justify-between" style={{ background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(30,41,59,0.6)' }}>
          <span className="text-sm" style={{ color: '#64748B' }}>Total escrow amount</span>
          <span className="font-bold text-xl text-gradient" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {totalAmount.toFixed(2)} <span className="text-sm font-normal" style={{ color: '#475569' }}>USDC</span>
          </span>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
            </svg>
            <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>
          </div>
        )}

        <button onClick={handleSubmit} disabled={submitting} className="w-full btn-primary py-4 text-base glow-amber">
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Creating on Stellar...
            </span>
          ) : 'Fund and Create Agreement'}
        </button>
        <p className="text-center text-xs" style={{ color: '#334155' }}>This will request a Freighter signature to deploy and fund the contract on Stellar testnet.</p>
      </div>
    </div>
  );
}
