'use client';
import { useEffect, useState } from 'react';
import { fetchEarningsHistory, EarningsRecord } from '@/lib/contract';
import { shortenAddress, formatDate } from '@/lib/stellar';

interface EarningsTimelineProps {
  contractorAddress: string;
  contractId: string;
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: 'rgba(30,41,59,0.4)' }}>
      <div className="space-y-2">
        <div className="skeleton h-3.5 w-24" />
        <div className="skeleton h-3 w-36" />
      </div>
      <div className="skeleton h-4 w-16" />
    </div>
  );
}

export default function EarningsTimeline({ contractorAddress, contractId }: EarningsTimelineProps) {
  const [records, setRecords] = useState<EarningsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contractorAddress || !contractId) { setLoading(false); return; }
    fetchEarningsHistory(contractorAddress, contractId)
      .then((data) => setRecords([...data].sort((a, b) => b.timestamp - a.timestamp)))
      .finally(() => setLoading(false));
  }, [contractorAddress, contractId]);

  const totalEarned = records.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white text-base" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Earnings Timeline
        </h3>
        {records.length > 0 && !loading && (
          <span className="font-bold text-sm" style={{ color: '#F5A623', fontFamily: 'Space Grotesk, sans-serif' }}>
            +{totalEarned.toFixed(2)} USDC
          </span>
        )}
      </div>

      <div className="card p-5">
        {loading && (
          <div>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}

        {!loading && records.length === 0 && (
          <div className="text-center py-10 space-y-2">
            <p className="text-sm" style={{ color: '#475569' }}>No earnings recorded yet</p>
            <p className="text-xs leading-relaxed max-w-xs mx-auto" style={{ color: '#334155' }}>
              Complete your first milestone to start building your on-chain payment record.
            </p>
          </div>
        )}

        {!loading && records.length > 0 && (
          <div>
            {records.map((record, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b last:border-0" style={{ borderColor: 'rgba(30,41,59,0.4)' }}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: '#4ADE80' }}>+{record.amount} USDC</span>
                    <span className="text-xs" style={{ color: '#334155' }}>M{record.milestoneIndex + 1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: '#475569' }}>{formatDate(record.timestamp)}</span>
                    {record.clientAddress && (
                      <span className="text-xs" style={{ color: '#334155', fontFamily: 'JetBrains Mono, monospace' }}>
                        from {shortenAddress(record.clientAddress)}
                      </span>
                    )}
                  </div>
                </div>
                {record.txHash && (
                  <a href={`https://stellar.expert/explorer/testnet/tx/${record.txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs transition-colors" style={{ color: '#F5A623' }}>
                    View →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
