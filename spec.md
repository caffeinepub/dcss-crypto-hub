# DCSS Crypto Hub

## Current State
New project with empty Motoko backend scaffold and no frontend yet.

## Requested Changes (Diff)

### Add
- Full 40-token dashboard with mock price feeds and random price variation
- Token card/banner layout: logo, name, symbol, price, balance (read-only), Buy/Swap/Send buttons
- Buy/Swap/Send modals with decimal input, MAX button, destination wallet selector
- Wallet connection hub: network-first flow (ICP → EVM → Solana → Cosmos), then compatible wallets
  - ICP: Internet Identity, Plug, Oisy
  - EVM: MetaMask, Coinbase Wallet, WalletConnect, Binance
  - Solana: Phantom, Backpack
  - Cosmos: Keplr
- LocalStorage namespaced per wallet address + network, cleared on each page load
- Wormhole bridge simulation: source chain, dest chain, amount, fee estimate, time estimate
- Activity feed: transaction history with type, token, amount, addresses, timestamp, status
- Filters on activity: All, Sent, Received, Swaps, Bridges
- DCSS Ecosystem hero banner (full-width): animated rotating Matrix green wireframe Earth with connection nodes, blockchain stats (supply, holders, TXs/day, cycles)
- DCSS token logo: pointillism calypso mask style
- Top navbar: Dashboard, Tokens, Bridge, Activity, Connect Wallet
- Dark theme: deep black + Matrix green + gold accents
- Cycles cost estimate displayed per operation

### Modify
- Backend Motoko canister: add token registry, mock price feed with variation, transaction log, bridge simulation

### Remove
- Nothing (new project)

## Implementation Plan
1. Motoko canister: TokenInfo type, getTokenPrices query (40 tokens, hardcoded base + random variation), recordTransaction update, getTransactions query, getBridgeFee query
2. Frontend state: walletStore (network, address, balances per token), transactionStore (activity feed)
3. Components: Navbar, TokenCard, TokenGrid, WalletConnectModal (network → wallet flow), BuySendSwapModal, BridgePanel, ActivityFeed, DCSSHero (Three.js rotating Earth)
4. Pages: Dashboard (hero + token grid), Tokens (grid only), Bridge, Activity
5. Token list: DCSS, ICP, ETH, BTC, SOL, AVAX, NEAR, ARB, BASE, LINK, DOT, ATOM, DVPN, ZEC, LTC, MATIC, OP, FTM, ALGO, XRP, ADA, TRX, DOGE, SHIB, UNI, AAVE, CRV, MKR, SNX, COMP, YFI, SUSHI, BAL, 1INCH, INJ, RUNE, OSMO, SCRT, JUNO, STARS
