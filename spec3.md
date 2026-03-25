# DCSS Crypto Hub — Spec Fase 3

> **Referencia:** spec1 + spec2 son el baseline. Este archivo documenta SOLO el delta de Fase 3.
> **Versión desplegada:** Draft v14
> **Estado:** COMPLETO

---

## Resumen de cambios aplicados (v10 → v14)

### 1. Paleta de colores

| Elemento | Antes | Ahora |
|----------|-------|-------|
| Acento principal | #22E97A (matrix green) | #00D4B8 (aquamarine) |
| Acento secundario | #00FF9F | #1DE9B6 |
| Botón Buy/Send/Swap | Gold #FFD700 | Rose gold metallic gradient |
| Botón Stake | Gold | Aquamarine #00D4B8 |
| Glow banners (borde izq.) | 60% opacidad | 30% (reducido) |
| Circuit background | Verde neon | Teal neon |

---

### 2. Precios reales — CoinGecko

- HTTP outcalls desde backend ICP a CoinGecko, cache 60s
- Badge "LIVE" en TokenCard y TokenDetailPage cuando los datos son reales
- Variación 24h en rojo/verde
- Fallback silencioso a precios simulados si CoinGecko no responde

---

### 3. Conexión auténtica de wallets (29 wallets)

**Regla central:** cada wallet conecta SOLO con su propia extensión. Sin fallbacks. Sin demos.
Si no está instalada → redirige a página de instalación. Nunca simula conexión.

**Detección EVM estricta por flags:**
```
MetaMask:       isMetaMask && !isKuCoinWallet && !isCoinbaseWallet
Coinbase:       isCoinbaseWallet || isCoinbaseBrowser
KuCoin Web3:    isKuCoinWallet
Binance Web3:   isBinance || isBinanceSmartChain
Core Wallet:    isCoreWallet || isAvalanche
Rabby:          isRabby
Trust Wallet:   isTrust
Rainbow:        isRainbow
No match → redirect install URL (nunca fallback a MetaMask)
```

**Wallets soportadas por red:**
| Red | Wallets |
|-----|---------|
| ICP | Internet Identity, Plug, Oisy (redirect web) |
| Ethereum/EVM | MetaMask, Coinbase, Rabby, Trust, Rainbow, KuCoin, Binance, Core, OKX, WalletConnect* |
| Solana | Phantom, Solflare, Backpack |
| Cosmos | Keplr, Leap |
| Polkadot | Talisman, SubWallet, Nova (redirect móvil) |
| Bitcoin | Unisat, Xverse, OKX |
| Arweave | ArConnect |
| Mina | Auro Wallet |
| Cardano | Nami, Eternl |

*WalletConnect: requiere Project ID en cloud.walletconnect.com — pendiente Fase 4.

---

### 4. Balances auténticos

Solo se muestran balances reales. Nunca números inventados. Si el fetch falla → no se muestra nada.
Los balances persisten en localStorage entre sesiones. El cierre de sesión limpia solo los datos de esa wallet.

| Red | Método de fetch | Token |
|-----|----------------|-------|
| EVM (MetaMask, etc.) | `eth_getBalance` via provider nativo | ETH |
| Solana | `getBalance` RPC mainnet-beta.solana.com | SOL |
| Cosmos / Keplr | REST api.cosmos.network `bank/v1beta1/balances` | ATOM |
| Polkadot, Bitcoin | Pendiente Fase 4 | DOT, BTC |

**Bugs corregidos en v14:**
- Se eliminó el `useEffect` que borraba todos los balances de localStorage en cada carga de página
- Keplr/Leap: ahora hace fetch de ATOM (`uatom` ÷ 1M) inmediatamente después de conectar
- Phantom/Solflare/Backpack: ahora hace fetch de SOL (lamports ÷ 1B) inmediatamente después de conectar
- Si el fetch falla, no se guarda nada — no aparece $0 falso

---

### 5. Wallet Hub — Mini Hub (Navbar)

El dropdown del navbar ahora muestra por cada wallet conectada:
- Tipo de wallet + red
- Dirección truncada
- Balance nativo real (ej: `12.34 ATOM`, `0.05 ETH`, `1.23 SOL`) o `—` si no disponible
- Valor USD en tiempo real (balance × precio CoinGecko)
- **Total Portfolio** al fondo: suma USD de todas las wallets con balance conocido

**Símbolo nativo por red:**
| Red | Token nativo |
|-----|-------------|
| Ethereum / EVM | ETH |
| Solana | SOL |
| Cosmos | ATOM |
| Polkadot | DOT |
| ICP | ICP |
| Bitcoin | BTC |
| Celestia | TIA |
| Arweave | AR |
| Mina | MINA |
| Cardano | ADA |

---

### 6. PortfolioBar (Dashboard)

Barra debajo del header del dashboard cuando hay wallet conectada:
- Total USD de todos los tokens de todas las wallets conectadas
- Número de tokens con saldo > 0
- Wallet activa con badge LIVE

---

### 7. Diagrama del Ecosistema DCSS

Componente: `src/frontend/src/components/DCSSEcosystemDiagram.tsx`

Reemplaza el planeta 3D (WireframeEarth / Three.js Canvas) en el hero del dashboard.
Badge "DCSS ECOSYSTEM · POWERED BY ICP" se mantiene debajo del diagrama.
El toggle "Ver Ecosistema" fue eliminado — el diagrama siempre está visible.

Visualización orbital animada con 4 anillos:
| Ring | Capa | Nodos |
|------|------|-------|
| 1 | ICP Core | ICP Runtime, Internet Identity, Motoko Canister |
| 2 | Datos / Oráculos | CoinGecko (LIVE), The Graph (PARTIAL), Pyth (FASE 4) |
| 3 | Redes | ETH, SOL, COSMOS, DOT, Celestia, 0G, BTC |
| 4 | Wallets & Bridges | MetaMask, Phantom, Keplr, OISY, Coinbase, Binance, KuCoin, IBC, Wormhole (F4), LayerZero (F4) |

Hover en nodo: panel de descripción + status LIVE / PARTIAL / FASE 4.

---

### 8. Activity Feed

Arranca siempre vacío: "No transactions yet".
Solo muestra actividad real cuando el usuario ejecuta transacciones.
Estructura lista para conectar a The Graph / exploradores en Fase 4.

---

### 9. Staking — Coming Soon con enlaces nativos

El backend de staking simulado fue removido.
La página muestra "Coming Soon" con enlace directo a cada plataforma nativa:

| Token | Plataforma |
|-------|------------|
| ICP | NNS (nns.ic0.app) |
| SOL | Marinade (marinade.finance) |
| ATOM | Keplr Dashboard |
| DOT | Polkadot Staking Dashboard |
| ETH | Lido (lido.fi) |
| TIA | Celestia staking nativo |

---

## Lo que va como "Coming Soon" en la UI

| Feature | Razón |
|---------|-------|
| Send / Buy / Receive | Requiere librerías por chain (@solana/web3.js, cosmjs, etc.) |
| Staking propio DCSS | Requiere token DCSS en ICP mainnet |
| DCSS Coin | Token propio, requiere contrato en ICP |
| Bridge cross-chain | Wormhole/LayerZero — requieren relayer EVM externo |
| Swap | Requiere DEX integration (Jupiter, Uniswap, etc.) |
| Wallet Activity Feed | Requiere The Graph o exploradores en vivo |
| WalletConnect | Pendiente Project ID (cloud.walletconnect.com) |
| DOT / BTC balances | APIs de Subscan/Mempool — Fase 4 |

---

## Archivos modificados en Fase 3

| Archivo | Cambio |
|---------|--------|
| `src/frontend/src/index.css` | Paleta aquamarine, variables CSS globales |
| `src/frontend/src/App.tsx` | Eliminado toggle ecosistema redundante |
| `src/frontend/src/contexts/WalletContext.tsx` | Sin wipe de localStorage; fetch ATOM/SOL post-conexión |
| `src/frontend/src/hooks/useRealWallet.ts` | Detección estricta por wallet, sin fallbacks cruzados |
| `src/frontend/src/hooks/useLivePrices.ts` | CoinGecko HTTP outcalls, badge LIVE |
| `src/frontend/src/components/Navbar.tsx` | Mini Wallet Hub con balances reales y total portafolio |
| `src/frontend/src/components/TokenCard.tsx` | Badge LIVE, variación 24h, rose gold buttons |
| `src/frontend/src/components/NetworkBanner.tsx` | Glow izquierdo reducido a 30% |
| `src/frontend/src/components/DCSSHero.tsx` | Planeta 3D reemplazado por DCSSEcosystemDiagram |
| `src/frontend/src/components/DCSSEcosystemDiagram.tsx` | Diagrama orbital 4 anillos (nuevo) |
| `src/frontend/src/components/ActivityFeed.tsx` | Arranca vacío, sin transacciones precargadas |
| `src/frontend/src/pages/StakingPage.tsx` | Coming Soon + enlaces nativos por token |
| `src/backend/main.mo` | Stats, price cache — staking simulado removido |

---

## Pendiente — Fase 4

- Send/Buy/Receive reales (librerías nativas por chain)
- WalletConnect con Project ID
- Bridge Wormhole/LayerZero
- DCSS Coin (contrato ICP)
- The Graph en vivo para activity feed
- DOT y BTC balance fetch
- Wallet Hub como tab dedicada (historial, por token, export CSV)
- Portfolio analytics P&L, charts, price alerts
- Expansión LATAM (ARS, COP, PEN)
- Fonts únicas por token/red
- Fase 3.5: testnet/mainnet deployment, CI/CD, environment vars
