# DCSS Crypto Hub — Spec Canónico v2

## Current State
- Backend Motoko con tokens, transactions, bridgeFees, stats, vaults
- Frontend React con toggle claro/midnight usando fondos PNG
- WalletConnectModal con solo 3 wallets (II, Oisy, Keplr)
- ActionModal básico sin Buy/Swap/Send/Bridge reales
- App.tsx con fondos de imagen (PNG) en lugar de colores sólidos
- dfx.json apunta a ruta incorrecta del backend
- env.json con valores undefined

## Requested Changes (Diff)

### Add
- main.mo: import Text, admin verification, getEcosystemStats, getAdminLogs, distributeRewards (admin-only), recordSponsor, getSponsorLogs
- 20+ wallets en WalletConnectModal con detección de extensiones instaladas
- Oisy ICRC-25: popup + postMessage handshake real
- WalletConnect Project ID input
- ActionModal: Buy (Transak), Swap (DEX links), Send EVM+SOL real, Bridge (Wormhole/Stargate)
- StakingPage informativa con enlace externo a STAKING_APP_URL
- CircuitBackground component activo como overlay
- CSS vars: --bg-dark #070B0A, --bg-surface #0F1513, --accent-green #22E97A, --accent-gold #FFD700
- Glassmorphism en cards y modals

### Modify
- App.tsx: fondo sólido #070B0A (dark), sin PNGs
- dfx.json: ruta backend corregida a src/backend/main.mo
- env.json: canister IDs reales
- Navbar: remover toggle claro/midnight (todo dark)
- StakingPage: solo informativa, sin formularios
- main.mo: corregir timestamp = Time.now(), eliminar ETH->BTC duplicado

### Remove
- Referencias a fondos PNG en App.tsx
- Toggle claro/midnight (reemplazado por tema dark permanente)

## Implementation Plan
1. Actualizar main.mo con nuevos métodos y fixes
2. Corregir dfx.json y env.json
3. Regenerar backend bindings
4. Actualizar frontend: tema dark, wallets, ActionModal, Oisy ICRC-25, StakingPage
5. Deploy draft
