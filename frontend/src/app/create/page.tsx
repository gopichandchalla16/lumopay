'use client';
import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import WalletConnect from '@/components/WalletConnect';

interface MilestoneInput {
  description: string;
  amount: string;
}

export default function CreateAgreement() {
  const { publicKey } = useWallet();
  const [contractorAddress, setContractorAddress] = useState('');
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { description: '', amount: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = milestones.reduce(
    (sum, m) => sum + (parseFloat(m.amount) || 0),
    0
  );

  const addMilestone = () => {
    if (milestones.length >= 5) return;
    setMilestones([...milestones, { description: '', amount: '' }]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (
    index: number,
    field: keyof MilestoneInput,
    value: string
  ) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const validate = (): string => {
    if (!contractorAddress.startsWith('G') || contractorAddress.length !== 56) {
      return 'Contractor address must start with G and be exactly 56 characters.';
    }
    if (contractorAddress === publicKey) {
      return 'Contractor address cannot be the same as your own address.';
    }
    for (let i = 0; i < milestones.length; i++) {
      if (!milestones[i].description.trim()) {
        return `Milestone ${i + 1} needs a description.`;
      }
      if (!milestones[i].amount || parseFloat(milestones[i].amount) <= 0) {
        return `Milestone ${i + 1} needs a valid USDC amount greater than 0.`;
      }
    }
    if (totalAmount <= 0) {
      return 'Total amount must be greater than 0.';
    }
    return '';
  };

  const handleSubmit = async () => {
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Transaction failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-6">
        <h1 className="text-3xl font-bold">Create Agreement</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 space-y-5">
          <p className="text-gray-400">Connect your Freighter wallet to create a work agreement.</p>
          <WalletConnect />
          <p className="text-gray-600 text-xs">
            Don&apos;t have Freighter?{' '}
            <a
              href="https://freighter.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-400"
            >
              Install it here
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-green-900/40 border border-green-800 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Agreement Created and Funded</h2>
        <p className="text-gray-400 leading-relaxed">
          Your work agreement is live on Stellar testnet. Share the agreement link with your contractor so they can connect their wallet and start submitting milestones.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setContractorAddress('');
            setMilestones([{ description: '', amount: '' }]);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
        >
          Create Another Agreement
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Work Agreement</h1>
        <p className="text-gray-400 mt-2 text-sm leading-relaxed">
          Define your milestones and fund the escrow with USDC. The contractor can then connect their wallet to track and submit each milestone.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Contractor Stellar Address
          </label>
          <input
            type="text"
            value={contractorAddress}
            onChange={(e) => setContractorAddress(e.target.value.trim())}
            placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            className="w-full bg-gray-900 border border-gray-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-gray-600 outline-none transition-colors"
          />
          <p className="text-gray-600 text-xs">
            Must start with G and be exactly 56 characters
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">
            Milestones ({milestones.length}/5)
          </label>
          {milestones.map((m, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-indigo-400 font-semibold">
                  Milestone {i + 1}
                </span>
                {milestones.length > 1 && (
                  <button
                    onClick={() => removeMilestone(i)}
                    className="text-gray-600 hover:text-red-400 text-xs transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={m.description}
                onChange={(e) => updateMilestone(i, 'description', e.target.value)}
                placeholder="Describe the deliverable clearly"
                className="w-full bg-gray-800 border border-gray-700 focus:border-indigo-500 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={m.amount}
                  onChange={(e) => updateMilestone(i, 'amount', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="flex-1 bg-gray-800 border border-gray-700 focus:border-indigo-500 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                />
                <span className="text-gray-500 text-sm font-medium shrink-0 bg-gray-800 border border-gray-700 px-3 py-2.5 rounded-lg">
                  USDC
                </span>
              </div>
            </div>
          ))}
          {milestones.length < 5 && (
            <button
              onClick={addMilestone}
              className="w-full border border-dashed border-gray-700 hover:border-indigo-600/60 text-gray-500 hover:text-indigo-400 py-3 rounded-xl text-sm transition-all duration-200"
            >
              + Add Milestone
            </button>
          )}
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between">
          <span className="text-gray-400 text-sm">Total Escrow Amount</span>
          <span className="text-white font-bold text-lg">
            {totalAmount.toFixed(2)} USDC
          </span>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800/60 rounded-xl px-4 py-3 flex items-start gap-3">
            <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-200 active:scale-[0.99]"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Creating Agreement on Stellar...
            </span>
          ) : (
            'Fund and Create Agreement'
          )}
        </button>
      </div>
    </div>
  );
}
