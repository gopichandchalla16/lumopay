import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="text-center py-20 space-y-8">
        <div className="inline-flex items-center gap-2 bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 px-4 py-1.5 rounded-full text-sm">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
          Built on Stellar Testnet
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
            Get paid across borders.
            <br />
            <span className="text-indigo-400">Prove you earned it.</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            LumoPay lets freelancers and clients create structured milestone payment
            agreements on Stellar. Every payment is on-chain, verifiable, and yours
            forever.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/create"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-95"
          >
            Create Agreement
          </Link>
          <a
            href="https://github.com/gopichandchalla16/lumopay"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200"
          >
            View on GitHub
          </a>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'Create Agreement',
              description:
                'Client defines project milestones with USDC amounts and funds the total into a Soroban smart contract escrow. Funds are locked on-chain.',
            },
            {
              step: '02',
              title: 'Deliver and Release',
              description:
                'Contractor submits each milestone as complete. Client confirms and the contract automatically releases USDC to the contractor.',
            },
            {
              step: '03',
              title: 'Build Your Record',
              description:
                'Every payment creates a permanent on-chain event. Your verifiable earnings history lives on Stellar, owned by you, forever.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4 hover:border-gray-700 transition-colors"
            >
              <span className="text-3xl font-bold text-indigo-600">{item.step}</span>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-indigo-950/30 border border-indigo-900/40 rounded-2xl p-10 text-center space-y-5">
        <h2 className="text-2xl font-bold">Ready to get started?</h2>
        <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
          Connect your Freighter wallet, create a testnet agreement, and see your payment
          history appear on-chain in real time.
        </p>
        <Link
          href="/create"
          className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-95"
        >
          Create Your First Agreement
        </Link>
      </section>
    </div>
  );
}
