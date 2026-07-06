# LumoPay

> Structured cross-border milestone payments and portable earnings records for independent workers on Stellar.

[![Contract CI](https://github.com/gopichandchalla16/lumopay/actions/workflows/ci.yml/badge.svg)](https://github.com/gopichandchalla16/lumopay/actions)

## Live Demo

🔗 [lumopay.vercel.app](https://lumopay.vercel.app) — replace with your actual Vercel URL after deployment

## Contract Address

Deployed on Stellar Testnet:
```
REPLACE_WITH_YOUR_CONTRACT_ID_AFTER_DEPLOY
```

## What It Does

Freelancers and independent contractors working across borders face two problems at once. First, cross-border payments are slow and expensive. International wires take days, fees cut into every transfer, and there is no transparency about what is happening in between. Second, contractors have no verifiable income history. Their earnings show up as irregular foreign transfers with no context, making it impossible to prove consistent income to banks, landlords, or credit providers.

LumoPay solves both. A client creates a work agreement on Soroban, defines milestones with USDC amounts, and funds the total into smart contract escrow. The contractor submits each milestone as complete. The client confirms and USDC releases automatically. Every release emits a permanent on-chain event that forms the contractor's verifiable earnings history on Stellar, owned by them forever.

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Rust, Soroban SDK 21.7.0 |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Wallet | Freighter (@stellar/freighter-api) |
| Chain Data | Stellar Horizon API |
| Analytics | Vercel Analytics |
| Deployment | Vercel (frontend), Stellar Testnet (contract) |

## How It Works

1. **Create Agreement** — Client connects Freighter, defines milestones with descriptions and USDC amounts, funds total into Soroban escrow
2. **Deliver and Release** — Contractor submits each milestone complete, client confirms, contract releases USDC on-chain automatically
3. **Build Your Record** — Every release emits a structured Soroban event forming a permanent, verifiable earnings history on Stellar

## Getting Started

### Contract

```bash
# Install Rust and wasm32 target
rustup target add wasm32-unknown-unknown

# Build
cd contract
cargo build --target wasm32-unknown-unknown --release

# Test
cargo test

# Deploy to testnet (requires Stellar CLI)
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/work_agreement.wasm \
  --source-account default \
  --network testnet
```

### Frontend

```bash
cd frontend
npm install
cp ../.env.example .env.local
# Edit .env.local and add your deployed contract ID
npm run dev
```

Open http://localhost:3000

### Environment Variables

```
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_CONTRACT_ID=your_contract_id_here
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

## Project Structure

```
lumopay/
├── contract/                    # Soroban Rust smart contract
│   ├── src/lib.rs               # WorkAgreement contract
│   └── Cargo.toml
├── frontend/                    # Next.js 14 frontend
│   └── src/
│       ├── app/                 # App Router pages
│       ├── components/          # Reusable UI components
│       ├── hooks/               # useWallet hook
│       └── lib/                 # stellar.ts and contract.ts
├── .github/workflows/ci.yml     # GitHub Actions contract tests
└── README.md
```

## Screenshots

_Add screenshots here after deployment_

- [ ] Home page desktop
- [ ] Create agreement form
- [ ] Agreement view with milestones
- [ ] Mobile responsive view
- [ ] Vercel Analytics dashboard

## User Feedback Summary

_Add after collecting feedback from 10+ users_

## Built By

**Gopichand** | [@GopichandAI](https://x.com/GopichandAI) on X  
Stellar Journey to Mastery — Level 4 Green Belt | July 2026  
GitHub: [gopichandchalla16/lumopay](https://github.com/gopichandchalla16/lumopay)
