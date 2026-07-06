'use client';
import { useEffect, useState } from 'react';
import { fetchEarningsHistory, EarningsRecord } from '@/lib/contract';
import { shortenAddress, formatDate } from '@/lib/stellar';

interface EarningsTimelineProps {
  contractorAddress: string;
  contractId: string;
}

function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="h-4 bg-gray-800 rounded w-24" />
        <div className="h-4 bg-gray-800 rounded w-16" />
      </div>
      <div className="h-3 bg-gray-800 rounded w-36" />
    </div>
  );
}

export default function EarningsTimeline({
  contractorAddress,
  contractId,
}: EarningsTimelineProps) {
  const [records, setRecords] = useState<EarningsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contractorAddress || !contractId) {
      setLoading(false);
      return;
    }
    fetchEarningsHistory(contractorAddress, contractId)
      .then((data) => {
        const sorted = [...data].sort((a, b) => b.timestamp - a.timestamp);
        setRecords(sorted);
      })
      .finally(() => setLoading(false));
  }, [contractorAddress, contractId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Earnings Timeline</h3>
        {records.length > 0 && (
          <span className="text-xs text-gray-500">
            {records.length} payment{records.length !== 1 ? 's' : ''} on-chain
          </span>
        )}
      </div>

      {loading && (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && records.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 border-dashed rounded-xl p-8 text-center space-y-2">
          <p className="text-gray-500 text-sm">No earnings recorded yet.</p>
          <p className="text-gray-600 text-xs">
            Complete your first milestone to start building your on-chain earnings history.
          </p>
        </div>
      )}

      {!loading && records.length > 0 && (
        <div className="space-y-3">
          {records.map((record, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-green-400 font-semibold">
                  +{record.amount} USDC
                </span>
                <span className="text-gray-500 text-xs">
                  {formatDate(record.timestamp)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500 text-xs">
                  Milestone {record.milestoneIndex + 1}
                </span>
                <span className="text-gray-600 text-xs font-mono">
                  From: {shortenAddress(record.clientAddress)}
                </span>
              </div>
              {record.txHash && (
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${record.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:text-indigo-400 text-xs transition-colors"
                >
                  View on Stellar Expert →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
