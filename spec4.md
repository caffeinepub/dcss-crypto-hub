# DCSS Crypto Hub — Spec Fase 4

> Baseline: spec1.md + spec2.md + spec3.md. This file documents ONLY the Fase 4 delta.
> Status: IN PROGRESS

## Current State
Fase 3 deployed (Draft v16). Known issues:
- DCSSHero.tsx still renders the old WireframeEarth/Three.js globe — DCSSEcosystemDiagram is not fully replacing it in the hero
- App.tsx renders DCSSEcosystemDiagram as a separate section below the hero instead of inside it
- Keplr and Phantom may connect silently without prompting user permission
- Balance fetching for Keplr/Phantom may show nothing or incorrect values
- Some wallets open the wrong extension (MetaMask opens KuCoin)
- WalletPage exists but balances read from localStorage; may be empty if fetch didn't save

## Requested Changes (Diff)

### Add
- **spec4.md** — this file
- **Portfolio Analytics** — `/wallets` page enhanced with: 7-day/30-day portfolio value history chart (using live prices sampled at connect time), token performance table (% change 24h from CoinGecko), and total P&L display
- **Price Alerts (UI-only)** — button on TokenCard and TokenDetailPage to "Set Alert" (modal, Coming Soon state, not wired to backend)
- **LATAM UX Improvements** — all page labels and descriptions in Spanish by default; consistent use of Chilean peso context where CLP appears
- **Unique Typography** — apply Bricolage Grotesque for headings, Geist Mono for all monospace/balance data (font files already exist in public/assets/fonts)
- **Ecosystem Diagram — Hero Integration FIX** — DCSSHero.tsx must be rewritten to remove WireframeEarth/Three.js completely. The single DCSSEcosystemDiagram canvas component replaces the globe in the hero section. No duplicate diagrams.
- **Wallet Bug Fixes (carry-over from Fase 3)**:
  - Each EVM wallet (MetaMask, Coinbase, Rabby, Trust, Rainbow, Binance Web3, KuCoin Web3) must detect its own provider using specific `window.ethereum.providers` fingerprinting (isMetaMask, isCoinbaseWallet, etc.) — never fall through to another wallet
  - Keplr: call `window.keplr.enable(chainId)` which triggers the permission popup — do NOT skip this step
  - Phantom: call `window.solana.connect({ onlyIfTrusted: false })` to always prompt
  - After successful connect, immediately fetch and store balance in localStorage AND in WalletContext state
  - Balance display in Navbar dropdown and WalletPage must read from WalletContext state (not just localStorage)

### Modify
- **DCSSHero.tsx** — remove Three.js/WireframeEarth, embed DCSSEcosystemDiagram directly, keep stats row below
- **App.tsx** — remove standalone `<DCSSEcosystemDiagram />` section (it lives inside the hero now)
- **WalletContext.tsx** — add `balances: Record<string, number>` map to context (key: `${network}_${address}_${symbol}`), update after every real balance fetch so UI re-renders without localStorage polling
- **useRealWallet.ts** — after balance fetch, call context setter to store in WalletContext.balances (not just localStorage)
- **index.css / tailwind.config.js** — set `font-family: 'Bricolage Grotesque', sans-serif` for headings; `font-family: 'Geist Mono', monospace` for `.font-mono` classes
- **WalletPage.tsx** — read balances from WalletContext.balances (live state) in addition to localStorage

### Remove
- Three.js WireframeEarth from DCSSHero.tsx (replaced by DCSSEcosystemDiagram)
- @react-three/fiber and three.js imports from DCSSHero.tsx
- Standalone DCSSEcosystemDiagram section in App.tsx dashboard tab

## Implementation Plan
1. Fix DCSSHero.tsx: remove Three.js globe, embed DCSSEcosystemDiagram as hero visual
2. Fix App.tsx: remove duplicate ecosystem section
3. Fix wallet provider detection: per-wallet fingerprinting for all EVM wallets
4. Fix Keplr: call enable() before getKey()
5. Fix Phantom: always use onlyIfTrusted: false
6. Add WalletContext.balances state map; update on fetch
7. Update WalletPage and Navbar to read from context state
8. Apply Bricolage Grotesque + Geist Mono typography
9. Add portfolio history chart on WalletPage (sparkline using stored price snapshots)
10. Add 24h price change column to WalletPage holdings table
11. Translate page labels/descriptions to Spanish throughout
12. Add Price Alert Coming Soon button on TokenCard and TokenDetailPage
