'use client';

interface MilestoneCardProps {
  index: number;
  description: string;
  amount: string;
  status: 'Pending' | 'Submitted' | 'Released';
  userRole: 'client' | 'contractor' | 'observer';
  isLoading: boolean;
  onSubmit?: () => void;
  onRelease?: () => void;
}

function Spinner() {
  return (
    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

const statusConfig = {
  Pending: { label: 'Pending', badgeClass: 'badge-pending', dot: 'bg-slate-500' },
  Submitted: { label: 'Awaiting Release', badgeClass: 'badge-submitted', dot: 'bg-yellow-400' },
  Released: { label: 'Released', badgeClass: 'badge-released', dot: 'bg-green-400' },
};

export default function MilestoneCard({ index, description, amount, status, userRole, isLoading, onSubmit, onRelease }: MilestoneCardProps) {
  const config = statusConfig[status];

  return (
    <div className="card card-hover p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#F5A623', fontFamily: 'Space Grotesk, sans-serif' }}>
            M{index + 1}
          </span>
          <p className="text-sm leading-snug" style={{ color: '#CBD5E1' }}>{description}</p>
          <p className="text-lg font-bold" style={{ color: '#F5A623', fontFamily: 'Space Grotesk, sans-serif' }}>
            {parseFloat(amount).toFixed(2)} <span className="text-sm font-normal" style={{ color: '#475569' }}>USDC</span>
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${config.badgeClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      </div>

      <div className="pt-1">
        {status === 'Pending' && userRole === 'contractor' && onSubmit && (
          <button onClick={onSubmit} disabled={isLoading} className="w-full btn-ghost text-sm">
            {isLoading ? <span className="flex items-center justify-center gap-2"><Spinner /> Submitting...</span> : 'Mark as Complete'}
          </button>
        )}
        {status === 'Submitted' && userRole === 'client' && onRelease && (
          <button onClick={onRelease} disabled={isLoading} className="w-full btn-primary text-sm glow-amber-sm">
            {isLoading ? <span className="flex items-center justify-center gap-2"><Spinner /> Releasing...</span> : 'Release Payment'}
          </button>
        )}
        {status === 'Released' && (
          <div className="flex items-center justify-center gap-2 text-sm py-1" style={{ color: '#4ADE80' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Payment sent on-chain
          </div>
        )}
        {status === 'Pending' && userRole === 'client' && (
          <p className="text-center text-xs py-1" style={{ color: '#334155' }}>Waiting for contractor submission</p>
        )}
        {status === 'Submitted' && userRole === 'contractor' && (
          <p className="text-center text-xs py-1" style={{ color: '#92400E' }}>Submitted — awaiting client release</p>
        )}
        {userRole === 'observer' && status !== 'Released' && (
          <p className="text-center text-xs py-1" style={{ color: '#334155' }}>Connect as client or contractor to interact</p>
        )}
      </div>
    </div>
  );
}
