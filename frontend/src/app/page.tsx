import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-24">
      <section className="pt-8 pb-4 space-y-10">
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{ color: '#F5A623', backgroundColor: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F5A623' }} />
            Stellar Testnet · Soroban Smart Contracts
          </span>
        </div>

        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Get paid.{' '}
            <span className="text-gradient">On-chain.</span>
            <br />
            <span className="text-4xl sm:text-5xl font-normal" style={{ color: '#475569' }}>Prove every dollar.</span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: '#64748B' }}>
            LumoPay turns every milestone payment into a permanent, verifiable record on Stellar. Built for freelancers who work across borders and need proof to match.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/create" className="btn-primary glow-amber text-sm">Create Agreement</Link>
          <a href="https://github.com/gopichandchalla16/lumopay" target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">View Source</a>
        </div>

        <div className="flex justify-center pt-4">
          <div className="relative rounded-2xl p-6 sm:p-8 w-full max-w-lg" style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(30,41,59,0.6)' }}>
            <p className="text-center text-xs mb-6 tracking-widest uppercase" style={{ color: '#334155', fontFamily: 'JetBrains Mono, monospace' }}>Live payment flow</p>

            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-2 w-20 shrink-0">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(13,27,46,1)', border: '1px solid rgba(245,166,35,0.3)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-xs text-center" style={{ color: '#475569', fontFamily: 'Space Grotesk, sans-serif' }}>Client</span>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full relative h-px flex items-center">
                  <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'rgba(30,41,59,0.8)' }} />
                  <div className="absolute w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #F5A623, #FBBF24)', boxShadow: '0 0 8px rgba(245,166,35,0.6)', animation: 'flow 2s ease-in-out infinite', left: '10%' }} />
                </div>
                <span className="text-xs" style={{ color: '#334155', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}>USDC · Soroban escrow</span>
              </div>

              <div className="flex flex-col items-center gap-2 w-20 shrink-0">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.4)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 9h6M9 12h6M9 15h4" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-xs text-center" style={{ color: '#475569', fontFamily: 'Space Grotesk, sans-serif' }}>Contract</span>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full relative h-px flex items-center">
                  <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'rgba(30,41,59,0.8)' }} />
                  <div className="absolute w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #4ADE80, #22C55E)', boxShadow: '0 0 8px rgba(74,222,128,0.5)', animation: 'flow 2s ease-in-out infinite 1s', left: '10%' }} />
                </div>
                <span className="text-xs" style={{ color: '#334155', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}>on milestone release</span>
              </div>

              <div className="flex flex-col items-center gap-2 w-20 shrink-0">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-xs text-center" style={{ color: '#475569', fontFamily: 'Space Grotesk, sans-serif' }}>Contractor</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 pt-5" style={{ borderTop: '1px solid rgba(30,41,59,0.5)' }}>
              {[{ label: 'Settlement', value: '~5s' }, { label: 'Network fee', value: '<$0.01' }, { label: 'Records', value: 'On-chain' }].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-bold text-sm text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{stat.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-bold text-2xl sm:text-3xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>How it works</h2>
          <p className="text-sm" style={{ color: '#475569' }}>Three steps. No banks. No delays.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Create Agreement', body: 'Define milestones with descriptions and USDC amounts. Fund the total into a Soroban smart contract. Funds lock on-chain until work is confirmed.' },
            { title: 'Deliver and Release', body: 'Contractor submits each milestone as complete. Client confirms with one click. The contract releases USDC instantly.' },
            { title: 'Build Your Record', body: 'Every release emits a permanent Soroban event. Your earnings history accumulates on-chain, verifiable by anyone, owned by you.' },
          ].map((item, i) => (
            <div key={item.title} className="card card-hover p-6 space-y-4">
              <span className="text-3xl font-bold" style={{ color: '#F5A623', fontFamily: 'Space Grotesk, sans-serif' }}>0{i + 1}</span>
              <h3 className="font-semibold text-white text-base" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl p-8 sm:p-12 text-center space-y-6" style={{ background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(245,166,35,0.15)' }}>
        <h2 className="font-bold text-2xl sm:text-3xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Start your first agreement</h2>
        <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: '#475569' }}>
          Connect Freighter, define your milestones, fund escrow. The whole flow takes under five minutes on Stellar testnet.
        </p>
        <Link href="/create" className="btn-primary glow-amber inline-flex">Create Agreement →</Link>
        <p className="text-xs" style={{ color: '#334155' }}>
          Requires <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#475569' }}>Freighter wallet</a> · Stellar Testnet · No mainnet funds needed
        </p>
      </section>
    </div>
  );
}
