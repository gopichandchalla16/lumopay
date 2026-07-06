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

export default function MilestoneCard({
  index,
  description,
  amount,
  status,
  userRole,
  isLoading,
  onSubmit,
  onRelease,
}: MilestoneCardProps) {
  const statusConfig = {
    Pending: {
      label: 'Pending',
      className: 'text-gray-400 bg-gray-800 border-gray-700',
    },
    Submitted: {
      label: 'Submitted',
      className: 'text-yellow-400 bg-yellow-900/30 border-yellow-800/60',
    },
    Released: {
      label: 'Released',
      className: 'text-green-400 bg-green-900/30 border-green-800/60',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4 transition-all duration-200 hover:border-gray-700">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <p className="text-xs text-indigo-400 font-medium">
            Milestone {index + 1}
          </p>
          <p className="text-white font-medium leading-snug">{description}</p>
          <p className="text-indigo-300 text-sm font-semibold">{amount} USDC</p>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full border font-medium shrink-0 ${config.className}`}
        >
          {config.label}
        </span>
      </div>

      <div className="flex gap-2">
        {status === 'Pending' && userRole === 'contractor' && onSubmit && (
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="flex-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Mark as Complete'
            )}
          </button>
        )}

        {status === 'Submitted' && userRole === 'client' && onRelease && (
          <button
            onClick={onRelease}
            disabled={isLoading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Releasing...
              </span>
            ) : (
              'Release Payment'
            )}
          </button>
        )}

        {status === 'Released' && (
          <div className="flex-1 flex items-center justify-center gap-2 text-green-400 text-sm py-2.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Payment released on-chain
          </div>
        )}

        {status === 'Pending' && userRole === 'client' && (
          <div className="flex-1 text-center text-gray-600 text-sm py-2.5">
            Waiting for contractor submission
          </div>
        )}

        {status === 'Submitted' && userRole === 'contractor' && (
          <div className="flex-1 text-center text-yellow-500 text-sm py-2.5">
            Submitted — awaiting client release
          </div>
        )}
      </div>
    </div>
  );
}
