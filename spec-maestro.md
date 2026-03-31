# DCSS Crypto Hub — Spec Maestro

> **Proyecto:** DCSS Crypto Hub — App Principal (dcssp-main)
> **Versión:** Maestro v1 — documento único de referencia
> **Backend canister:** `emsf6-jqaaa-aaaaj-qroja-cai` en https://icp0.io
> **Frontend canister:** `eltdk-eiaaa-aaaaj-qrojq-cai`

---

## PROMPT REUTILIZABLE — CONTEXTO BASE

Usar este prompt al inicio de cada sesión en Caffeine, antes del prompt específico.

```
Proyecto DCSS Crypto Hub. Canister backend: emsf6-jqaaa-aaaaj-qroja-cai en https://icp0.io. Frontend canister: eltdk-eiaaa-aaaaj-qrojq-cai.

Contexto técnico:
- Backend Motoko con ICRC-1, staking, vesting, admin, sponsors, getEcosystemStats, getTokenPrices, getAdminLogs
- distributeRewards() protegida con verificación de admin
- SponsorRecord implementado con recordSponsor() y getSponsorLogs()
- Frontend React + Tailwind + TypeScript
- Estilo: dark #070B0A, surface #0F1513, Matrix Green #22E97A, Gold #FFD700, glassmorphism, neon borders, circuit background
- ~40 tokens canónicos en 18+ redes (ver spec maestro DCSS)
- 6 rutas: /, /tokens, /bridge, /activity, /project, /staking, /token/:symbol
- /staking es solo informativa con enlace a [STAKING_APP_URL], sin formularios ni métodos stake/unstake/claimRewards

Instrucción: aplicar spec maestro DCSS completo. Regenerar bindings, env.json, dfx.json, verificar main.mo y canister_ids antes del build. No crear canister nuevo si canister_ids.json existe.
```

---

## REFERENCIA VISUAL

Archivo: `src/frontend/public/assets/uploads/visual-reference.png`

Esta imagen es la referencia de diseño definitiva. Muestra 3 variantes del mismo layout:

### Variante 1 — Light Theme
- **Fondo:** crema/gris muy claro con gradiente suave aurora en el hero (`#FAF8F5`)
- **Superficies:** glassmorphism claro — blanco 70–90% translúcido + blur + borde 1px
- **Texto:** gris carbón (`#2B2F3A`) principal, gris medio (`#7A8496`) secundario
- **Acento:** gradiente azul→menta en botones primarios
- **Stats:** valores en verde/teal (`#22E97A`)
- **Bitcoin banner:** gradiente horizontal cálido crema→durazno→lila

### Variante 2 — Dark Theme (principal / default)
- **Fondo:** `#070B0A` (near-black verdoso, NO usar `#0B1220`)
- **Surface:** `#0F1513` translúcido con glassmorphism
- **Texto:** blanco suave (`#E8EEF0`) principal, gris azulado (`#9AA6B2`) secundario
- **Acento primario:** Matrix Green `#22E97A` — H1 hero, valores de stats, tab activo
- **Gold:** `#FFD700` — DCSS token, Bitcoin accents
- **H1 hero:** color `#22E97A`, 48–56px, peso 700–800
- **Bitcoin banner:** gradiente ámbar→marrón→negro con partículas tenues
- **Botón Connect Wallet navbar:** `#1E4A3D` con borde menta

### Variante 3 — Dark Space Theme
- **Fondo:** azul marino profundo con nebulosa/estrellas (`#060A14`, `#0B1530`)
- **Acento:** cyan/azul eléctrico (`#22D3EE`) con toques violeta
- **Bitcoin banner:** marco naranja con glow externo fuerte (`#FF7A18`)

### Elementos comunes a los 3 temas
- **Navbar:** translúcido + blur, logo izquierda, Connect Wallet pill derecha
- **Hero:** título grande centrado (48–56px 700–800), subtítulo, CTA pill
- **Stats bar:** 4 mini-cards con icon + label + valor en color acento
- **NetworkBanner expandido:** header (icon + nombre + badge "Tokens" + chevron) / cuerpo 2 col (descripción | métricas + Connect Wallet) / footer chips (Buy, Market, Bridge)
- **TokenCard compacta:** icon + nombre + precio + %change + balance + 3 botones pill
- **Radios:** cards 14–18px, botones 9999px (pill), chips 6–8px
- **Tipografía:** Inter/Manrope, números en Geist Mono o monospace

---

## VISIÓN DEL PRODUCTO

Hub multichain Web3 orientado al mercado chileno. Gestiona, enseña e integra ~40 tokens canónicos en 18+ redes (EVM, ICP, Solana, Cosmos, Polkadot, Celestia, 0G Labs y más). Posicionamiento: alternativa educativa y visualmente sofisticada a Superform/Zerion/DeBank. Foco en DePIN, contexto LATAM, y el token CLP como stablecoin DeFi-nativa del ecosistema chileno. Puro Web3, sin integración fiat en el core.

---

## BACKEND — MÉTODOS DISPONIBLES

Canister: `emsf6-jqaaa-aaaaj-qroja-cai` en `https://icp0.io`

| Método | Descripción |
|--------|-------------|
| `getEcosystemStats()` | totalSponsors, totalTokens, rewardsDistributed, totalHolders, totalNetworks, totalTransactions |
| `getStats()` | cyclesConsumed, circulatingSupply, totalSupply, txCount, holders |
| `getTokenPrices()` | precios simulados para ~40 tokens |
| `getAdminLogs()` | feed de actividad on-chain |
| `icrc1_balance_of(account)` | balance DCSS del usuario conectado |
| `recordSponsor(sponsor, amount, message)` | registrar sponsor/donación |
| `getSponsorLogs()` | lista pública de sponsors |
| `getBridgeFee(sourceChain, destChain, amount)` | estimar fee de bridge |
| `recordTransaction(...)` | registrar transacción |
| `getTransactions(walletAddr)` | historial de transacciones |

> **NO usar en este frontend:** `stake`, `unstake`, `claimStakingRewards`, `getStakingInfo`, `distributeRewards`. Pertenecen a la app de staking separada.

---

## DISEÑO VISUAL

### Paleta global

| Variable | Valor |
|----------|-------|
| Dark bg | `#070B0A` |
| Surface | `#0F1513` |
| Matrix Green | `#22E97A` |
| Gold | `#FFD700` |
| Light bg | `#FAF8F5` |

Estilo: glassmorphism, neon borders, fondo SVG circuito neon (`#22E97A` 4–6% opacidad, `position: fixed`), hover glow en cards. Tipografía geométrica bold para números. Fondo near-black, no negro puro.

### Paleta por red

| Red | Color primario | Acento |
|-----|---------------|--------|
| Bitcoin | `#F7931A` | `#FFD700` |
| Polkadot Hub | `#E6007A` | `#FFFFFF` |
| Cosmos Hub | `#6F7390` | `#FFFFFF` |
| Celestia | `#7B2FBE` | `#00D4FF` |
| 0G Labs | `#00D4FF` | `#FFFFFF` |
| ICP | `#29ABE2` | `#22E97A` |
| Ethereum + L2s | `#627EEA` | `#F7931A` |
| Solana | `#9945FF` | `#00FFA3` |
| Near | `#00C08B` | `#FFFFFF` |
| Avalanche | `#E84142` | `#FFFFFF` |
| Cardano | `#0033AD` | `#FFFFFF` |
| Mina | `#E7AC57` | `#FFFFFF` |
| Bittensor | `#36A18B` | `#FFFFFF` |
| Arweave | `#222326` | `#FFFFFF` |
| Stablecoins | `#26A17B` / `#2775CA` | bicolor |
| CLP | `#D52B1E` / azul bandera | Banner especial Chile |

---

## TOKENS CANÓNICOS (~43 tokens)

| Red | Tokens |
|-----|--------|
| ICP (3) | ICP `#29ABE2`, DCSS `#FFD700`, CLP `#D52B1E` |
| Bitcoin (1) | BTC `#F7931A` |
| Polkadot Hub (2) | DOT `#E6007A`, TRAC `#3EAFDD` |
| Cosmos Hub (5) | ATOM `#6F7390`, ASI/FET `#1B2B4B`, AKT `#FF414C`, DVPN `#4AB44A`, INJ `#00F2FE` |
| Celestia (1) | TIA `#7B2FBE` |
| 0G Labs (1) | 0G `#00D4FF` |
| Ethereum Mainnet (7) | ETH `#627EEA`, LINK `#375BD2`, GRT `#6747ED`, API3 `#3643D9`, NMR `#00D4C4`, SAHARA `#FF6B35`, IP `#8B5CF6` |
| Arbitrum L2 (3) | LPT `#00A55F`, SHELL `#7EC8E3`, ATH `#6EFF6E` |
| Base L2 (2) | KAITO `#0052FF`, VIRTUAL `#9B59B6` |
| Multichain (2) | KERNEL `#F5A623`, UP `#8B5CF6` |
| Solana (5) | SOL `#9945FF`, RENDER `#FF4500`, IO `#00D4FF`, GRASS `#4CAF50`, PYTH `#E6DAFE` |
| L1s individuales | NEAR `#00C08B`, AVAX `#E84142`, ADA `#0033AD`, MINA `#E7AC57`, TAO `#36A18B`, AR `#222326` |
| Stablecoins (2) | USDT `#26A17B`, USDC `#2775CA` |

---

## ESTRUCTURA DE BANNERS POR RED

```
Bitcoin (L0)          → BTC
Polkadot Hub (L0)     → DOT, TRAC
Cosmos Hub (L0)       → ATOM, ASI/FET, AKT, DVPN, INJ
Celestia (L0)         → TIA
0G Labs (L0)          → 0G
Ethereum + L2s (L1)
 └─ Ethereum Mainnet  → ETH, LINK, GRT, API3, NMR, SAHARA, IP
 └─ Arbitrum L2       → LPT, SHELL, ATH
 └─ Base L2           → KAITO, VIRTUAL
 └─ Multichain        → KERNEL, UP
Solana (L1)           → SOL, RENDER, IO, GRASS, PYTH
Internet Computer     → ICP, DCSS, CLP
Near (L1)             → NEAR
Avalanche (L1)        → AVAX
Cardano (L1)          → ADA
Mina Protocol (L1)    → MINA
Bittensor (L1)        → TAO
Arweave (L1)          → AR
Stablecoins           → USDT, USDC
```

---

## PÁGINAS Y NAVEGACIÓN

| Ruta | Descripción |
|------|-------------|
| `/` | Dashboard: hero + stats + NetworkGroupedView + DePIN Universe + NFT Viewer + Activity feed |
| `/tokens` | Grid completo 43 tokens con búsqueda y filtros |
| `/token/:symbol` | Detalle por token: logo, precio, chart Recharts, educación, acciones |
| `/project` | Manifesto + diagrama ecosistema + DCSS token + CLP whitepaper + educación + roadmap |
| `/bridge` | Bridge UI, usa `getBridgeFee()`, links Wormhole + Stargate |
| `/activity` | Feed de `getAdminLogs()` + `getTransactions()`, estado vacío explícito |
| `/staking` | Informativa solo — stats del canister + cards de pools + enlace `[STAKING_APP_URL]` |

---

## COMPONENTES

| Componente | Descripción |
|-----------|-------------|
| `CircuitBackground.tsx` | Fondo SVG neon, `position: fixed`, `#22E97A` 4–6% opacidad, `prefers-reduced-motion` |
| `SplashOverlay.tsx` | Primera visita, `dcss_splash_shown` en localStorage, 2.5s |
| `AnnouncementBanner.tsx` | Sticky bajo Navbar, `#FFD700→#C9A24A`, cerrable |
| `NetworkBanner.tsx` | 100% ancho, colapsable, textura CSS por red, borde acento 4px izquierda |
| `NetworkSubHub.tsx` | Panel expandido: descripción + métricas + acciones |
| `NetworkGroupedView.tsx` | Grid agrupado por red con banners expandibles |
| `TokenCard.tsx` | icon + nombre + precio + %change + balance + 3 botones pill |
| `DePINSection.tsx` | 11 tokens DePIN destacados |
| `NFTViewer.tsx` | Grid NFTs simulados, ready para APIs reales Fase 2 |
| `WalletConnectModal.tsx` | Solo wallets instaladas detectadas, WalletConnect con Project ID input |

---

## TEXTURAS CSS POR RED

| Red | Efecto CSS |
|-----|------------|
| Bitcoin | Gradiente naranja → dark + líneas diagonales doradas |
| Polkadot | Gradiente rosa → dark + nodos y conexiones |
| Cosmos | Gradiente gris-azul → dark + nebulosa radial |
| Celestia | Gradiente púrpura → dark + bloques perspectiva |
| 0G Labs | Gradiente cyan → dark + partículas de datos |
| ICP | Gradiente cyan → dark + líneas ortogonales + nodos |
| Ethereum + L2s | Gradiente azul → dark + honeycomb 5% opacidad |
| Solana | Gradiente púrpura → dark + aurora boreal + speed lines |
| Stablecoins | Bicolor USDT/USDC + textura papel |
| CLP | Bandera chilena: rojo `#D52B1E` + azul + blanco |

---

## FLUJO DE WALLETS

1. Usuario selecciona red en `WalletConnectModal`
2. Solo wallets compatibles con esa red, solo las instaladas en el browser
3. Extensión instalada: conecta real. No instalada: redirige a instalación
4. Conectado: dirección truncada visible (6+...+4), balance en TokenCard
5. Persistencia en `localStorage: dcss_wallet_connection`

**Wallets soportadas:**
- ICP: Internet Identity (`@dfinity/auth-client`), Oisy (ICRC-25 popup + postMessage)
- Cosmos: Keplr (`window.keplr`)
- EVM: MetaMask, Rabby, Coinbase, Trust, Rainbow, OKX, Binance Web3 (`window.ethereum`)
- Solana: Phantom, Solflare, Backpack (`window.solana`)
- Mobile: WalletConnect (Project ID en localStorage)
- Polkadot: Talisman, SubWallet
- Bitcoin: Unisat, Xverse
- NEAR: NEAR Wallet
- Arweave: ArConnect

---

## ARCHIVOS DE DATOS

| Archivo | Contenido |
|---------|----------|
| `src/frontend/src/data/tokens.ts` | 43 tokens: symbol, name, color, network, defaultPrice, layer, depin, description, officialUrl, coingeckoId |
| `src/frontend/src/data/tokenDeepData.ts` | Narrativa profunda, visualización única, stats por token |
| `src/frontend/src/data/projectContent.ts` | Contenido /project: manifesto, roadmap, educación, DCSS, CLP |
| `src/frontend/src/data/networkContent.ts` | Intro 25 palabras, stats, wallets y links por red |

---

## VISUALIZACIONES ÚNICAS POR TOKEN (/token/:symbol)

ETH: sistema solar CSS | BTC: timeline halvings | SOL: métricas red real | ICP: galería apps on-chain | PYTH: ticker live | MINA: 22KB vs 300GB | ATOM: ecosistema IBC | INJ: stats animados | LINK: web protocolos | NEAR: chain abstraction | AKT: calculadora vs AWS | RENDER: comparativa render | GRASS: partículas | TAO: grid subnets | AR: timeline 2024→2224 | IP: árbol derivados | ASI: venn diagram | KERNEL: calculadora restaking | API3: first-party oracles | USDT/USDC: comparativa + flujo Chile | CLP: roadmap con Fases 2 y 5 OPCIONAL

---

## PÁGINA /project — CONTENIDO

**Título:** "El futuro de las finanzas no tiene bancos."
**Subtítulo:** "DCSS Crypto Hub es el primer panel multichain construido sobre Internet Computer, desde Chile para el mundo."

**Manifesto:** "Vivimos en un mundo donde los sistemas financieros tradicionales excluyen a millones [...] DCSS nació en Chile con una misión clara: hacer que esta revolución sea accesible, comprensible y útil para el usuario latinoamericano."

**Token DCSS:** name, symbol, decimals=8, total_supply=100M, fee=0.0001. Distribución: Comunidad 40%, Equipo 25% (vesting 4yr cliff 1yr), Tesorería 20%, Inversores 10% (vesting 2yr), Listings 5%. Estado: Coming Soon.

**CLP Token:** stablecoin 1:1 peso chileno, colateral ckUSDT, modelo DAI. Roadmap Fases 2 y 5 marcadas OPCIONAL.

**Educación:** ¿Qué es blockchain? / ¿Qué es DeFi? / ¿Qué es staking? / ¿Qué es ICP? / Contexto chileno: sin DCSS (Pesos → Buda → USDT → Exchange → DeFi) vs con DCSS futuro (Pesos → Buda → USDT → Mint CLP → DeFi directo).

**Roadmap:**
- Fase 0: Base funcional — ✅ Completado
- Fase 1: Lista canónica, banners, páginas por token, charts, NFT viewer — 🔄 En curso
- Fase 2: Páginas profundas, precios reales vía oráculos — Pendiente
- Fase 3: Bridge Wormhole, staking backend activo — Pendiente
- Fase 4: Portfolio analytics, PWA, expansión LATAM ARS/COP/PEN — Pendiente

---

## ACCESIBILIDAD

- ARIA labels en todos los elementos interactivos
- `role="navigation"`, `aria-current="page"` en Navbar
- Tab/Enter/Escape en todos los modales
- Focus ring: `outline: #22E97A`
- Contraste mínimo 4.5:1
- `prefers-reduced-motion`: desactivar todas las animaciones
- `aria-live="polite"` en áreas de precio

---

## FLUJO DE COMPRA CHILE (informativo)

- **Sin DCSS:** Pesos CLP → Buda/Cryptomkt → USDT → Exchange → DeFi
- **Con DCSS (futuro):** Pesos CLP → Buda → USDT → Mint CLP Token (ICP) → DeFi directo

---

## CANISTER IDS Y CONFIGURACIÓN

| Variable | Valor |
|----------|-------|
| Backend canister ID | `emsf6-jqaaa-aaaaj-qroja-cai` |
| Frontend canister ID | `eltdk-eiaaa-aaaaj-qrojq-cai` |
| Host | `https://icp0.io` |

`canister.yaml` debe generar `env.json` con `backend_host: https://icp0.io` y `backend_canister_id: emsf6-jqaaa-aaaaj-qroja-cai`.
