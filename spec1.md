# DCSS Crypto Hub — Spec Fase 1

---

## Estado Actual (Spec 0 — lo que está en el draft ahora mismo)

El draft actual es la base funcional del proyecto. Incluye:

### Frontend
- **Navbar** sticky con logo DCSS, tabs (Dashboard / Tokens / Bridge / Activity), wallet connect
- **DCSSHero** con globo 3D wireframe animado (React Three Fiber), estadísticas del backend
- **TokenGrid** simple: grid plano de tarjetas sin agrupación por red, con filtro de búsqueda y tabs de red
- **TokenCard** básica: precio, cambio 24h, balance, botones BUY / SWAP / SEND
- **ActionModal** (Buy/Swap/Send) con input decimal y botón MAX
- **WalletConnectModal** con flujo de 2 pasos: seleccionar red → seleccionar wallet compatible
- **BridgePanel** con selección de cadena origen/destino, token, monto, dirección destino, estimación de fee (simulada)
- **ActivityFeed** con estado vacío explícito (sin datos falsos), listo para conectar con The Graph
- **Footer** simple

### Backend Motoko
- Stats del ecosistema: totalSupply, circulatingSupply, holders, txCount, cyclesConsumed
- recordTransaction: guarda transacciones en memoria
- estimateBridgeFee: simula fee y tiempo de bridge por ruta
- getTokenPrices: precios simulados para 40 tokens

### Datos y Contextos
- **tokens.ts**: 40 tokens definidos con symbol, name, color, network, defaultPrice
  - Redes: ICP (DCSS, ICP), EVM (ETH, BTC, AVAX, NEAR, ARB, BASE, LINK, DOT, ZEC, LTC, MATIC, OP, FTM, ALGO, XRP, ADA, TRX, DOGE, SHIB, UNI, AAVE, CRV, MKR, SNX, COMP, YFI, SUSHI, BAL, 1INCH), Solana (SOL), Cosmos (ATOM, DVPN, INJ, RUNE, OSMO, SCRT, JUNO, STARS)
- **WalletContext**: wallets separadas por red, sin contaminación de balances entre redes
- **TokenContext**: precios simulados con variación aleatoria cada 30s
- **TransactionContext**: historial local de transacciones

### Diseño Base
- Paleta: Matrix green `#22E97A`, Gold `#FFD700`, Dark `#070B0A`, Surface `#0F1513`
- Glass morphism básico, neon borders
- Logo DCSS generado (imagen transparente 200x200)

---

## Cambios Requeridos en Spec 1 (Delta)

### AGREGAR

#### 1. Fondo Global: Giant Neon Circuit-Chip
- Patrón SVG de chip de circuito neon que cubre toda la app como fondo fijo
- Color Matrix green `#22E97A` con opacidad muy baja (4–6%) para no interferir con el contenido
- Las líneas del circuito conectan visualmente todas las redes del ecosistema
- Implementado en `index.css` o como componente `CircuitBackground.tsx` posicionado como `position: fixed` detrás de todo
- Soporta `prefers-reduced-motion`: mantiene el patrón estático, desactiva cualquier animación

#### 2. Splash Overlay con Logo DCSS Animado
- Se muestra solo en la primera visita del usuario (flag `dcss_splash_shown` en localStorage)
- Pantalla completa con fondo `#070B0A` y partículas verdes flotantes (CSS keyframes)
- Logo DCSS centrado con animación: fade-in + scale-up en ~800ms, pausa, luego fade-out de toda la pantalla
- Duración total: ~2.5 segundos antes de desaparecer
- El logo usa la imagen ya generada: `/assets/generated/dcss-logo-transparent.dim_200x200.png`
- Texto: "DCSS CRYPTO HUB" en verde con efecto glow, subtítulo "Powered by Internet Computer"
- Accesibilidad: `role="dialog"`, `aria-modal="true"`, `aria-label="DCSS loading screen"`, `aria-live="polite"`
- `prefers-reduced-motion`: mostrar splash estático sin animaciones

#### 3. Banner Anuncio "DCSS Coin — Coming Soon"
- Posicionado sticky justo debajo del Navbar
- Fondo dorado `#FFD700` degradado a `#C9A24A`, texto oscuro `#070B0A`
- Contenido: ícono de moneda + "DCSS Coin — Coming Soon · Join the waitlist →"
- Botón X en la esquina derecha para cerrar/ocultar (persistido en localStorage)
- Animación de entrada: slide-down suave
- ARIA: `role="banner"`, `aria-label="DCSS Coin announcement"`

#### 4. Banners de Red con Texturas (Estilo Call of Duty Skins)

Esta es la pieza central de Spec 1. Cada red tiene un banner horizontal elongado, semi-transparente, con textura única implementada 100% en CSS (gradientes multicapa, patrones SVG inline, `backdrop-filter: blur`, overlays `::before`/`::after`).

**Estructura de cada banner:**
- Ancho: 100% del contenedor
- Alto colapsado: ~80px (solo muestra nombre de red + badge de cantidad de tokens + flecha)
- Expandible: click para abrir sub-hub completo hacia abajo
- Animación: `max-height` transition suave (300ms ease-in-out)
- Borde izquierdo de acento (4px sólido en el color de la red)

**Texturas por red:**

- **ICP** (`#29ABE2` cyan + `#070B0A` negro)
  - Fondo base: `linear-gradient(135deg, rgba(41,171,226,0.12) 0%, rgba(7,11,10,0.95) 60%, rgba(41,171,226,0.06) 100%)`
  - Overlay de circuito: patrón de líneas ortogonales finas en cyan (4% opacidad) simulando PCB
  - Puntos de nodo: pequeños círculos brillantes en intersecciones del circuito
  - Destellos sutiles: `radial-gradient` en esquinas top-right y bottom-left
  - Efecto: chip de computadora cuántica ICP, frío, tecnológico

- **EVM** (`#627EEA` azul + `#FFD700` dorado)
  - Fondo base: `linear-gradient(135deg, rgba(98,126,234,0.10) 0%, rgba(7,11,10,0.93) 50%, rgba(247,147,26,0.06) 100%)`
  - Overlay hexagonal: patrón de honeycomb/hexágonos en azul (5% opacidad)
  - Destellos dorados: 2–3 puntos `radial-gradient` en dorado muy sutil
  - Línea diagonal de energía: `linear-gradient` a 45° de azul a dorado muy transparente
  - Efecto: cuadrícula hexagonal metálica, industrial, multi-chain

- **Solana** (`#9945FF` púrpura + `#00FFA3` verde-cyan)
  - Fondo base: `linear-gradient(135deg, rgba(153,69,255,0.14) 0%, rgba(7,11,10,0.92) 45%, rgba(0,255,163,0.08) 100%)`
  - Overlay aurora boreal: gradiente diagonal que va de púrpura a violeta a verde-cyan (muy transparente)
  - Líneas de velocidad: 2–3 líneas diagonales finas en blanco (2% opacidad) sugiriendo velocidad
  - Efecto: aurora boreal, veloz, futurista, energético

- **Cosmos** (`#6F7390` gris-azul + blanco estelar)
  - Fondo base: `linear-gradient(135deg, rgba(111,115,144,0.12) 0%, rgba(7,11,10,0.94) 55%, rgba(111,115,144,0.06) 100%)`
  - Overlay estelar: puntos blancos de distintos tamaños (`radial-gradient` repetido) simulando constelaciones
  - Nebulosa sutil: `radial-gradient` en azul-violeta muy transparente en el centro
  - Líneas de constelación: líneas muy tenues conectando puntos estelares
  - Efecto: mapa estelar profundo, interconectado, IBC-cosmos

#### 5. Sub-Hub Expandible por Red

Al hacer click en el banner de una red, se expande un panel debajo con:

**Columna izquierda (intro):**
- Nombre completo de la red + logo/ícono
- Descripción de exactamente 25 palabras explicando el rol de la red en el ecosistema DCSS
- Badge con cantidad de tokens en esa red

**Columna central (stats):**
- TVL total de tokens de esa red (suma de precios × supply simulado)
- Número de tokens listados
- Wallets compatibles (tags con colores)
- Estado de la red: Online ✓

**Columna derecha (acciones rápidas):**
- Botón "Connect Wallet" → abre WalletConnectModal preseleccionando esa red
- Botón "Swap" → abre ActionModal con primer token de la red
- Botón "Bridge" → navega a tab Bridge con esa red preseleccionada

**Sección de links (footer del sub-hub):**
- ICP: ic.org, dashboard.internetcomputer.org, plugwallet.ooo
- EVM: ethereum.org, arbiscan.io, optimism.io
- Solana: solana.com, explorer.solana.com
- Cosmos: cosmos.network, mintscan.io, osmosis.zone

**Contenido de intro (25 palabras por red):**
- **ICP**: "La capa base del ecosistema DCSS. Computación descentralizada en cadena nativa, sin gas fees y con velocidad submilisegundo impulsada por Internet Computer Protocol."
- **EVM**: "El ecosistema más grande de DeFi. DCSS conecta Ethereum, Arbitrum, Base y más cadenas compatibles para máxima liquidez y acceso multi-protocolo."
- **Solana**: "Alta velocidad, costos mínimos. DCSS integra el ecosistema Solana para aprovechar sus 65,000 TPS y acceso a DeFi ultrarrápido desde Chile."
- **Cosmos**: "El internet de blockchains. DCSS usa IBC para conectar ATOM, Osmosis, Injective y más cadenas soberanas en un hub unificado."

#### 6. Tokens Agrupados por Red con Banners

- La vista principal del Dashboard y la página Tokens muestran los tokens agrupados bajo su respectivo banner de red
- Orden de redes: ICP → EVM → Solana → Cosmos
- Dentro de cada red, los tokens se muestran en grid 2–4 columnas
- El banner de cada red siempre visible; el grid de tokens colapsa/expande con el sub-hub
- TokenGrid existente se mantiene como vista alternativa (modo lista)

#### 7. Tokens Adicionales Obligatorios

Agregar a `tokens.ts`:
- **SAHARA** — Sahara AI (EVM) — `#FF6B35` — $0.85
- **IP** — Story Protocol (EVM) — `#8B5CF6` — $1.20
- **CLP** — Chilean Peso Token (ICP) — `#D52B1E` (rojo Chile) — $0.0011

Total final: **43 tokens** mínimo. CLP es especial: banner con colores de la bandera chilena (rojo `#D52B1E` + azul `#003DA5` + blanco).

#### 8. Página Staking (`/staking`)

UI completa inspirada en WaterNeuron. Sin backend activo — todo Coming Soon.

**Secciones:**
- **Hero**: "Stake & Earn" con APY estimado destacado en verde, descripción breve
- **Stats row**: Total Staked, APY Promedio, Usuarios Staking, Próximo Unlock
- **Pools de staking** (cards por token):
  - ICP Neuron: APY 8–15%, lockup 6–96 meses
  - DCSS Staking: APY 12–25%, lockup 30–365 días
  - SOL Liquid Staking: APY 6–8%, sin lockup
  - ATOM Delegation: APY 14–20%, unbonding 21 días
- Cada pool: nombre, APY, lockup, TVL, botón "Stake" disabled con tooltip "Coming Soon"
- **Modal de staking**: formulario con monto, período, preview de rewards — inputs desactivados
- **Tabla de posiciones activas**: vacía con mensaje "Connect wallet to see positions"
- **Roadmap de staking**: timeline visual indicando cuándo se activa cada pool

#### 9. Página Proyecto/Manifesto (`/project`)

Contenido en `src/frontend/src/data/projectContent.ts`. Ver sección completa de contenido más abajo.

#### 10. Página Token Detail (`/token/:symbol`)

Accesible haciendo click en el nombre/símbolo del token desde TokenCard o TokenGrid.

**Secciones:**
- **Header**: logo, nombre, símbolo, red (badge), precio actual, cambio 24h, botones BUY/SWAP/SEND
- **Precio chart placeholder**: área reservada con mensaje "Live charts — Coming Soon" + línea de precio estática
- **Info del token**: descripción, propósito, casos de uso (3–5 bullets)
- **Stats**: Market Cap simulado, Volumen 24h, Supply circulante, Supply total
- **Integración DCSS**: cómo este token se conecta al hub DCSS, qué wallets lo soportan
- **Links externos**: sitio oficial, explorer, whitepaper (links reales a cada proyecto)
- **Tokens relacionados**: 3 tokens de la misma red (carousel horizontal)

#### 11. Accesibilidad Completa
- `aria-label` en todos los botones con íconos sin texto visible
- `role="navigation"` en el Navbar, `aria-current="page"` en tab activo
- `role="main"` en el contenido principal
- Navegación por teclado: Tab, Enter, Escape funcionan en todos los modales y dropdowns
- Focus visible: outline verde (#22E97A) en todos los elementos enfocables
- Contraste mínimo 4.5:1 en todo el texto (cumplido con la paleta actual)
- `prefers-reduced-motion`: desactivar todas las animaciones CSS/JS si el usuario lo prefiere
- `aria-live="polite"` en áreas de precios que se actualizan automáticamente

---

### MODIFICAR

#### Navbar
- Agregar tabs: **Project** (ícono BookOpen) y **Staking** (ícono Layers)
- En mobile: scroll horizontal o menú hamburguesa para los 6 tabs
- El banner "Coming Soon" de DCSS Coin va pegado debajo del Navbar

#### TokenGrid
- Nuevo modo por defecto: **vista agrupada por red** con banners expandibles
- Mantener modo grid simple como vista alternativa (toggle icon-button)
- El filtro de búsqueda funciona en ambas vistas

#### TokenCard
- Click en nombre/símbolo → navega a `/token/:symbol`
- Badge de red pequeño (color de la red) en la esquina superior derecha
- Hover state mejorado: leve glow en el color del token

#### tokens.ts
- Agregar SAHARA, IP, CLP
- Agregar campo `description: string` (1–2 oraciones por token)
- Agregar campo `officialUrl: string`
- Agregar campo `explorerUrl?: string`
- Agregar campo `whitepaperUrl?: string`
- Actualizar NETWORK_PRIMARY_TOKENS

#### App.tsx
- Routing multipage: `/`, `/tokens`, `/bridge`, `/activity`, `/project`, `/staking`, `/token/:symbol`
- Integrar SplashOverlay, CircuitBackground, AnnouncementBanner

#### WalletConnectModal
- Prop `preselectedNetwork?: Network` para abrir directo en una red

---

### REMOVER

- Nada se elimina. Todo el spec 0 se mantiene y se extiende.

---

## Paleta de Colores por Red

| Red | Color primario | Color acento | Uso |
|-----|---------------|--------------|-----|
| ICP | `#29ABE2` cyan | `#22E97A` verde | Banner, badges, borders |
| EVM | `#627EEA` azul | `#F7931A` naranja | Banner, borders |
| Solana | `#9945FF` púrpura | `#00FFA3` verde-cyan | Banner, badges |
| Cosmos | `#6F7390` gris-azul | `#FFFFFF` blanco | Banner, estrellas |
| CLP/Chile | `#D52B1E` rojo | `#003DA5` azul | Banner especial Chile |

---

## Lista Completa de Tokens (43)

### ICP (3)
| Symbol | Name | Color | Precio |
|--------|------|-------|--------|
| DCSS | DCSS Token | `#FFD700` | $0.085 |
| ICP | Internet Computer | `#29ABE2` | $12.45 |
| CLP | Chilean Peso Token | `#D52B1E` | $0.0011 |

### EVM (31)
| Symbol | Name | Color | Precio |
|--------|------|-------|--------|
| ETH | Ethereum | `#627EEA` | $3,420 |
| BTC | Bitcoin | `#F7931A` | $67,800 |
| AVAX | Avalanche | `#E84142` | $38.75 |
| NEAR | NEAR Protocol | `#00C08B` | $7.20 |
| ARB | Arbitrum | `#12AAFF` | $1.85 |
| BASE | Base | `#0052FF` | $0.95 |
| LINK | Chainlink | `#375BD2` | $18.60 |
| DOT | Polkadot | `#E6007A` | $8.90 |
| MATIC | Polygon | `#8247E5` | $0.88 |
| OP | Optimism | `#FF0420` | $2.75 |
| FTM | Fantom | `#1969FF` | $0.72 |
| ALGO | Algorand | `#3A3A3A` | $0.18 |
| XRP | XRP | `#00AAE4` | $0.58 |
| ADA | Cardano | `#0033AD` | $0.45 |
| TRX | TRON | `#FF0013` | $0.13 |
| DOGE | Dogecoin | `#C2A633` | $0.165 |
| SHIB | Shiba Inu | `#FFA409` | $0.0000245 |
| UNI | Uniswap | `#FF007A` | $10.30 |
| AAVE | Aave | `#B6509E` | $285.00 |
| CRV | Curve DAO | `#3966CC` | $0.52 |
| MKR | Maker | `#1AAB9B` | $2,850 |
| SNX | Synthetix | `#00D1FF` | $2.85 |
| COMP | Compound | `#00D395` | $62.50 |
| YFI | Yearn Finance | `#006AE3` | $7,200 |
| SUSHI | SushiSwap | `#FA52A0` | $1.45 |
| BAL | Balancer | `#7B7B7B` | $3.80 |
| 1INCH | 1inch | `#D82122` | $0.42 |
| ZEC | Zcash | `#ECB244` | $28.50 |
| LTC | Litecoin | `#A0A0A0` | $92.00 |
| SAHARA | Sahara AI | `#FF6B35` | $0.85 |
| IP | Story Protocol | `#8B5CF6` | $1.20 |

### Solana (1)
| Symbol | Name | Color | Precio |
|--------|------|-------|--------|
| SOL | Solana | `#9945FF` | $185.30 |

### Cosmos (8)
| Symbol | Name | Color | Precio |
|--------|------|-------|--------|
| ATOM | Cosmos Hub | `#6F7390` | $11.20 |
| DVPN | Sentinel | `#4AB44A` | $0.0042 |
| INJ | Injective | `#00F2FE` | $28.50 |
| RUNE | THORChain | `#33FF99` | $5.80 |
| OSMO | Osmosis | `#750BBB` | $0.85 |
| SCRT | Secret Network | `#555555` | $0.62 |
| JUNO | Juno | `#F0827D` | $0.45 |
| STARS | Stargaze | `#DB2777` | $0.018 |

---

## Contenido del Proyecto (projectContent.ts)

Este es el contenido completo que pobla la página `/project` y las páginas de detalle de token.
Se almacena en `src/frontend/src/data/projectContent.ts`.

### Manifesto DCSS

**Título principal:** "El futuro de las finanzas no tiene fronteras — ni bancos."

**Subtítulo:** "DCSS Crypto Hub es el primer panel multichain construido sobre Internet Computer, diseñado desde Chile para el mundo."

**Manifiesto completo (cuerpo de texto para la página /project):**

> Vivimos en un mundo donde los sistemas financieros tradicionales excluyen a millones. Los bancos cobran comisiones abusivas, los gobiernos pueden congelar cuentas, y el acceso a oportunidades de inversión global sigue siendo un privilegio de pocos.
>
> Blockchain lo cambia todo. Por primera vez en la historia, cualquier persona con internet puede participar en la economía global en igualdad de condiciones. Sin intermediarios. Sin permisos. Sin fronteras.
>
> DCSS nació en Chile con una misión clara: hacer que esta revolución sea accesible, comprensible y poderosa para el usuario latinoamericano.
>
> No somos un exchange. No somos un banco. Somos un hub — un punto de convergencia donde ICP, Ethereum, Solana y el universo Cosmos se unen bajo una sola interfaz. Donde aprender y operar ocurre en el mismo lugar. Donde la complejidad de 43 activos en 4 redes se convierte en claridad.
>
> Construido sobre Internet Computer Protocol — la única blockchain que puede alojar aplicaciones web completas en cadena, sin AWS, sin Google Cloud, sin ningún intermediario centralizado — DCSS es la demostración de que el futuro de internet es descentralizado.
>
> Esto es apenas el comienzo.

### Por qué DCSS (Diferenciadores)

**vs Superform / Zerion / DeBank:**

1. **Nativo ICP, multichain real**
   - La app corre 100% on-chain en Internet Computer. No hay AWS detras. No hay Google Cloud.
   - Los competidores son interfaces web2 que consultan datos blockchain. DCSS es la blockchain.

2. **Educación integrada en cada token**
   - Cada token tiene su propia página con historia, propósito, casos de uso y cómo conecta con el ecosistema.
   - No es solo un precio en una lista. Es un curso de blockchain navegable.

3. **Enfoque chileno y latinoamericano**
   - Primer hub crypto diseñado específicamente para el usuario chileno.
   - Token CLP como puente conceptual entre el peso chileno y el mundo DeFi.
   - Contenido en español, contexto local, comunidad cercana.

4. **Transparencia radical**
   - Código abierto, deployado on-chain. Cualquiera puede verificar que el código que ven es el que corre.
   - Sin tracking, sin venta de datos, sin cámaras oscuras.

### Roadmap del Proyecto

| Fase | Descripción | Estado |
|------|-------------|--------|
| **Fase 0** | Base funcional: 43 tokens, 4 redes, wallet connect, bridge UI, activity feed | ✅ Completado |
| **Fase 1** | Banners con texturas, sub-hubs, splash, staking UI, páginas /project y /token/:symbol | ⚡ En curso |
| **Fase 2** | 38 páginas profundas por token, fonts únicas por red, oracles de precios reales | 🕒 Pendiente |
| **Fase 3** | Bridge SDK funcional (Wormhole), staking backend activo, activity feed on-chain | 🕒 Pendiente |
| **Fase 4** | Portfolio analytics, price alerts, multi-wallet, export CSV, PWA mobile | 🕒 Pendiente |

### El Token DCSS

**Nombre:** DCSS Token
**Símbolo:** DCSS
**Red:** Internet Computer Protocol (ICP)
**Precio inicial referencial:** $0.085

**Utilidad del token:**
- Governance: votar sobre qué tokens se añaden al hub
- Staking: bloquear DCSS para recibir una porción de fees del protocolo
- Acceso premium: holders de DCSS tienen acceso anticipado a features nuevas
- Rewards: usuarios activos reciben DCSS por interactuar con el hub
- Liquidez: DCSS como token de liquidez en pares del hub

**Distribución (Coming Soon — pendiente de definición final):**
- 40% — Comunidad y ecosistema
- 25% — Equipo fundador (vesting 4 años, cliff 1 año)
- 20% — Tesoría del protocolo
- 10% — Inversores early (vesting 2 años)
- 5% — Reserva para listings y liquidez inicial

**Estado:** Coming Soon. El token DCSS aún no está disponible. El banner de anuncio en la app notifica a los usuarios cuando se lance.

### Para el Usuario Chileno

Chile tiene una de las tasas de adopción crypto más altas de América Latina. Sin embargo, la mayoría de las herramientas disponibles están en inglés, diseñadas para el mercado norteamericano o europeo.

DCSS cambia eso:
- **Token CLP**: representación simbólica del peso chileno en el ecosistema blockchain. Sirve como ancla educativa para entender cómo funciona una stablecoin local.
- **Contenido en español**: todas las descripciones, manifiestos y textos educativos están escritos en castellano de Chile.
- **Contexto local**: los ejemplos y comparaciones usan referencias al mercado financiero chileno (AFPs, bancos, tipo de cambio).
- **Comunidad**: Discord y Twitter/X con comunidad activa en Chile y Latinoamérica.

---

## Narrativa y Descripción de Cada Token

Este contenido se usa en las páginas `/token/:symbol` y en `projectContent.ts`.

### Red ICP

**DCSS — DCSS Token**
El token nativo del ecosistema DCSS Crypto Hub. DCSS es el centro de governance y recompensas de la plataforma, construida sobre Internet Computer Protocol — la primera blockchain capaz de alojar aplicaciones web completas de forma descentralizada. Cada holder de DCSS tiene voz en el futuro del protocolo.
- Utilidad: governance, staking, acceso premium, rewards
- Red: ICP nativa
- Estado: Coming Soon
- URL: dcss.io (placeholder)

**ICP — Internet Computer**
Internet Computer es la blockchain que hace posible DCSS. Desarrollada por DFINITY Foundation, ICP permite que aplicaciones web completas corran 100% on-chain, sin servidores centralizados. Su velocidad submilisegundo y sus ciclos (gas) predecibles la hacen ideal para aplicaciones complejas como hubs DeFi multichain.
- Utilidad: plataforma de hosting descentralizado, DeFi nativo, governance
- Casos de uso: DApps web, DEX on-chain, NFTs, DAOs
- URL oficial: internetcomputer.org
- Explorer: dashboard.internetcomputer.org

**CLP — Chilean Peso Token**
El CLP Token es la representación simbólica del peso chileno dentro del ecosistema blockchain de DCSS. No es una stablecoin oficial del Banco Central de Chile, sino un token educativo y de comunidad que sirve de puente conceptual entre la moneda local y el mundo DeFi. Para el usuario chileno, CLP es el punto de entrada familiar al universo crypto.
- Utilidad: educación DeFi, comunidad chilena, referencia de valor local
- Red: ICP (token comunitario)
- Colores: rojo `#D52B1E` y azul `#003DA5` (bandera chilena)

### Red EVM

**ETH — Ethereum**
Ethereum es la blockchain que inventó los smart contracts y el DeFi moderno. Es la segunda criptomoneda por capitalización de mercado y el ecosistema con más desarrolladores, protocolos y liquidez del mundo. DCSS integra Ethereum como la puerta de entrada principal al mundo EVM.
- Utilidad: smart contracts, DeFi, NFTs, DAOs, Layer 2
- Casos de uso: cualquier aplicación descentralizada imaginable
- URL oficial: ethereum.org
- Explorer: etherscan.io

**BTC — Bitcoin**
Bitcoin es el origen de todo. La primera criptomoneda, creada por Satoshi Nakamoto en 2009, demostró que el dinero puede existir sin bancos ni gobiernos. Con un suministro máximo de 21 millones de monedas, Bitcoin es el "oro digital" del siglo XXI y el activo de reserva del ecosistema crypto global.
- Utilidad: reserva de valor, medio de pago P2P, hedge contra inflación
- Casos de uso: ahorro, transferencias internacionales, colateral DeFi
- URL oficial: bitcoin.org
- Explorer: mempool.space

**AVAX — Avalanche**
Avalanche es una plataforma blockchain de alta velocidad con finalidad de transacción en menos de 2 segundos. Su arquitectura de subredes permite crear blockchains personalizadas para casos de uso específicos. Es una de las principales competidoras de Ethereum en el espacio de smart contracts.
- Utilidad: DeFi, gaming, enterprise blockchain, subredes personalizadas
- URL oficial: avax.network
- Explorer: snowtrace.io

**NEAR — NEAR Protocol**
NEAR Protocol es una blockchain de capa 1 diseñada para ser usable por desarrolladores y usuarios finales. Su sistema de cuentas con nombres legibles (john.near), sus fees casi nulos y su compatibilidad con Ethereum via Aurora la hacen una de las plataformas más accesibles del ecosistema.
- Utilidad: DApps, DeFi, gaming, identidad on-chain
- URL oficial: near.org
- Explorer: explorer.near.org

**ARB — Arbitrum**
Arbitrum es la solución Layer 2 de Ethereum más grande por TVL. Usa Optimistic Rollups para procesar transacciones a una fracción del costo del mainnet de Ethereum, manteniendo su seguridad. Es donde vive gran parte del DeFi de Ethereum hoy en día.
- Utilidad: DeFi barato en Ethereum, gaming, NFTs
- URL oficial: arbitrum.io
- Explorer: arbiscan.io

**BASE — Base**
Base es la blockchain Layer 2 de Coinbase, construida sobre la tecnología OP Stack de Optimism. Al estar respaldada por el exchange más regulado de EE.UU., Base tiene una ventaja única en onboarding de usuarios tradicionales al ecosistema crypto.
- Utilidad: DeFi accesible, pagos, aplicaciones consumer
- URL oficial: base.org
- Explorer: basescan.org

**LINK — Chainlink**
Chainlink es la infraestructura de oráculos que conecta los smart contracts con datos del mundo real: precios, resultados deportivos, datos meteorológicos. Sin Chainlink, la mayoría del DeFi no podría funcionar. DCSS usará Chainlink en Fase 3 para precios en tiempo real.
- Utilidad: oráculos de datos, precios DeFi, automatización on-chain
- URL oficial: chain.link
- Explorer: etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca

**DOT — Polkadot**
Polkadot es una red de blockchains interconectadas (parachains) que comparten seguridad. Creada por el co-fundador de Ethereum Gavin Wood, Polkadot propone un modelo diferente a Cosmos para la interoperabilidad blockchain: blockchains especializadas que se benefician de la seguridad del relay chain central.
- Utilidad: interoperabilidad, parachains, governance on-chain
- URL oficial: polkadot.network
- Explorer: polkadot.subscan.io

**MATIC — Polygon**
Polygon es la solución de escalabilidad de Ethereum más adoptada por empresas y usuarios mainstream. Con fees de fracciones de centavo y compatibilidad total con Ethereum, Polygon fue la primera opción de muchos usuarios para entrar al DeFi sin gastar fortunas en gas.
- Utilidad: DeFi barato, gaming, NFTs, pagos
- URL oficial: polygon.technology
- Explorer: polygonscan.com

**OP — Optimism**
Optimism es otro Layer 2 de Ethereum basado en Optimistic Rollups. Su diferencial es el "Retroactive Public Goods Funding": un mecanismo por el cual el protocolo financia proyectos de bien público de forma retroactiva. Es la base tecnológica de Base (Coinbase) y varios otros L2.
- Utilidad: DeFi en Ethereum, governance, ecosistema OP Stack
- URL oficial: optimism.io
- Explorer: optimistic.etherscan.io

**UNI — Uniswap**
Uniswap es el exchange descentralizado (DEX) más grande del mundo. Inventó el modelo de Automated Market Maker (AMM) que hoy usan la mayoría de los DEXs. Sin Uniswap, el DeFi moderno no existiría en su forma actual. El token UNI da poder de governance sobre el protocolo.
- Utilidad: governance del DEX más grande, fees del protocolo
- URL oficial: uniswap.org
- Explorer: etherscan.io

**AAVE — Aave**
Aave es el protocolo de lending y borrowing descentralizado más grande del ecosistema DeFi. Permite depositar tokens como colateral y pedir prestado otros tokens, o ganar interés sobre depósitos. Sus "flash loans" — préstamos sin colateral que deben devolverse en la misma transacción — son una innovación única de blockchain.
- Utilidad: lending, borrowing, flash loans, yield
- URL oficial: aave.com
- Explorer: etherscan.io

**LINK, MKR, CRV, SNX, COMP, YFI, SUSHI, BAL, 1INCH** — El núcleo del DeFi original.
Estos tokens representan los protocolos que construyeron el "DeFi Summer" de 2020 y establecieron los primitivos financieros descentralizados: stablecoins (MKR/DAI), DEX aggregators (1INCH), yield optimization (YFI), synthetic assets (SNX), lending (COMP), liquidity pools (BAL, CRV, SUSHI). Cada uno resuelve un problema financiero específico de forma descentralizada.

**ZEC — Zcash**
Zcash es la blockchain de privacidad por excelencia. Usa cryptografía avanzada (zk-SNARKs) para permitir transacciones completamente privadas — donde ni el monto ni las direcciones son públicas. En un mundo de vigilancia financiera creciente, Zcash representa el derecho a la privacidad económica.
- Utilidad: pagos privados, privacidad financiera
- URL oficial: z.cash

**LTC — Litecoin**
Litecoin fue la primera altcoin exitosa, creada en 2011 como "la plata al oro de Bitcoin". Con tiempos de confirmación 4 veces más rápidos y fees menores, Litecoin fue durante años la opción de pagos cotidianos del ecosistema crypto. Sigue siendo uno de los activos más líquidos y establecidos.
- Utilidad: pagos rápidos, transferencias de valor
- URL oficial: litecoin.org

**XRP — XRP**
XRP es el token de Ripple, diseñado para hacer los pagos internacionales tan rápidos y baratos como un email. Mientras Swift tarda días en transferir dinero entre bancos, XRP lo hace en 3–5 segundos. Bancos y instituciones financieras en todo el mundo usan Ripple como infraestructura de pagos.
- Utilidad: pagos internacionales institucionales, liquidez bancaria
- URL oficial: ripple.com

**ADA — Cardano**
Cardano es la blockchain "academic" del ecosistema crypto. Cada feature es respaldada por papers peer-reviewed antes de implementarse. Su fundador, Charles Hoskinson (co-fundador de Ethereum), apostado a construir la blockchain más segura y escalable a través del rigor científico.
- Utilidad: smart contracts, DeFi, identidad digital en países en desarrollo
- URL oficial: cardano.org

**TRX — TRON**
TRON es una blockchain de alta velocidad con foco en entretenimiento y contenido digital. Con más de 100 millones de usuarios, especialmente en Asia, TRON procesa más transacciones diarias que Ethereum. USDT en TRON es una de las formas más usadas de transferir stablecoins globalmente.
- Utilidad: transferencias de USDT, contenido digital, DeFi en Asia
- URL oficial: tron.network

**DOGE — Dogecoin**
Nacido como un meme en 2013, Dogecoin se convirtió en un fenómeno cultural y financiero impulsado por comunidades en Reddit y el apoyo público de Elon Musk. Con fees casi nulos y una comunidad extremadamente activa, DOGE sigue siendo uno de los activos más reconocidos del ecosistema.
- Utilidad: pagos micropago, propinas online, comunidad
- URL oficial: dogecoin.com

**SHIB — Shiba Inu**
Shiba Inu nació como competidor directo de Dogecoin pero evolucionó hacia un ecosistema completo con su propio DEX (ShibaSwap), Layer 2 (Shibarium) y metaverso. Con una de las comunidades más grandes del crypto, SHIB demuestra que los "meme coins" pueden desarrollarse en proyectos serios.
- Utilidad: ecosistema Shiba, DEX, gaming, metaverso
- URL oficial: shibatoken.com

**FTM — Fantom**
Fantom es una blockchain DAG (Directed Acyclic Graph) de alta velocidad con finalidad de transacción en ~1 segundo y fees de fracciones de centavo. Fue diseñada por el Dr. Ahn Byung Ik para resolver el "blockchain trilemma" — ser segura, descentralizada y escalable al mismo tiempo.
- Utilidad: DeFi ultra-rápido, smart contracts
- URL oficial: fantom.foundation

**ALGO — Algorand**
Algorand fue creada por el ganador del Premio Turing Silvio Micali para ser la blockchain más pura en términos de descentralización y seguridad probada matemáticamente. Gobiernos y bancos centrales han elegido Algorand para proyectos de CBDC (monedas digitales nacionales).
- Utilidad: pagos institucionales, CBDC, DeFi puro
- URL oficial: algorand.com

**SAHARA — Sahara AI**
Sahara AI es una plataforma blockchain para la monetización de datos e IA. Permite a individuos y organizaciones controlar y monetizar sus contribuciones de datos en modelos de inteligencia artificial. En la era de la IA, Sahara propone que los datos generados por personas les pertenezcan a ellas.
- Utilidad: monetización de datos, marketplace de IA, privacidad de datos
- URL oficial: saharalabs.ai

**IP — Story Protocol**
Story Protocol está construyendo la capa de infraestructura para la propiedad intelectual programable en blockchain. Permite registrar, licenciar y monetizar IP (música, imágenes, texto, código) de forma automática a través de smart contracts. Es la "internet de la propiedad intelectual".
- Utilidad: registro de IP, licenciamiento automático, royalties on-chain
- URL oficial: story.foundation

### Red Solana

**SOL — Solana**
Solana es la blockchain de mayor velocidad del ecosistema: 65,000 transacciones por segundo con fees de fracciones de centavo. Diseñada por Anatoly Yakovenko ex-Qualcomm, Solana usa "Proof of History" para ordenar transacciones sin los cuellos de botella de otras blockchains. Es el hogar de una vibrante escena de NFTs, DeFi y gaming.
- Utilidad: DeFi ultra-veloz, NFTs, pagos, gaming
- Wallets: Phantom, Backpack
- URL oficial: solana.com
- Explorer: explorer.solana.com

### Red Cosmos

**ATOM — Cosmos Hub**
ATOM es el token del Cosmos Hub, el centro de la "internet de blockchains". El protocolo IBC (Inter-Blockchain Communication) de Cosmos permite que blockchains soberanas se comuniquen entre sí de forma nativa. DCSS usa la visión de Cosmos como inspiración directa para su arquitectura multichain.
- Utilidad: governance del hub, staking, seguridad interchain
- URL oficial: cosmos.network
- Explorer: mintscan.io

**OSMO — Osmosis**
Osmosis es el DEX principal del ecosistema Cosmos. A diferencia de los AMMs tradicionales, Osmosis permite a los proveedores de liquidez personalizar los parámetros de sus pools. Con soporte IBC nativo, es el lugar donde la mayoría de los tokens Cosmos encuentran liquidez.
- Utilidad: DEX IBC, liquidity pools personalizables, yield farming
- URL oficial: osmosis.zone

**INJ — Injective**
Injective es una blockchain construida para DeFi avanzado: derivados, futuros, opciones y mercados sintéticos sin permisos. Es la primera blockchain con un order book completamente on-chain, sin gas fees para operaciones de trading. Atrae a traders profesionales del ecosistema Cosmos.
- Utilidad: derivados DeFi, trading de opciones y futuros, mercados sintéticos
- URL oficial: injective.com

**RUNE — THORChain**
THORChain resuelve uno de los grandes problemas del DeFi: hacer swaps cross-chain nativos sin wrapped tokens ni bridges. Permite intercambiar BTC nativo por ETH nativo, o ATOM por SOL, de forma descentralizada. RUNE es el token de liquidez que hace funcionar todo el mecanismo.
- Utilidad: swaps cross-chain nativos, liquidez multichain
- URL oficial: thorchain.org

**DVPN — Sentinel**
Sentinel es una red descentralizada de VPN construida sobre Cosmos. Permite a cualquier persona vender ancho de banda de forma descentralizada, creando una alternativa a las VPNs corporativas que no puede ser censurada ni apagada. Es infraestructura de privacidad del internet descentralizado.
- Utilidad: VPN descentralizado, privacidad de internet, monetización de ancho de banda
- URL oficial: sentinel.co

**SCRT — Secret Network**
Secret Network es la blockchain de smart contracts con privacidad por defecto. Sus contratos inteligentes encriptados ("secret contracts") procesan datos sin exponerlos públicamente, habilitando casos de uso que son imposibles en blockchains transparentes: votación secreta, datos médicos privados, DeFi con privacidad.
- Utilidad: smart contracts privados, DeFi privado, datos médicos on-chain
- URL oficial: scrt.network

**JUNO — Juno**
Juno es una blockchain Cosmos especializada en smart contracts CosmWasm. Se originó como un airdrop a holders de ATOM y creció hasta convertirse en uno de los ecosistemas de contratos inteligentes más activos del universo IBC. Muchos protocolos DeFi de Cosmos eligen Juno como su hogar.
- Utilidad: smart contracts CosmWasm, DeFi Cosmos, DAOs
- URL oficial: junonetwork.io

**STARS — Stargaze**
Stargaze es la principal plataforma de NFTs en el ecosistema Cosmos. Con fees casi nulos y soporte IBC nativo, permite acunar, comprar y vender NFTs que pueden viajar entre blockchains Cosmos. Su marketplace on-chain compite directamente con OpenSea pero de forma completamente descentralizada.
- Utilidad: NFTs multichain, marketplace descentralizado, DAOs de creadores
- URL oficial: stargaze.zone

---

## Contenido Educativo de Blockchain (para página /project)

Esta sección se incluye en la página `/project` como material educativo para usuarios nuevos.

### ¿Qué es una Blockchain?

Una blockchain es una base de datos distribuida que guarda registros de transacciones en bloques encadenados criptográficamente. Nadie la controla, todos la pueden verificar, y nadie puede cambiar el historial.

Imagina un libro contable enorme que:
- Miles de computadoras en todo el mundo tienen una copia idéntica
- Cada vez que alguien hace una transacción, todos los participantes la verifican
- Una vez registrada, nadie puede borrarla ni modificarla
- No necesita un banco ni una empresa en el centro para funcionar

Eso es blockchain.

### ¿Qué es DeFi?

DeFi (Decentralized Finance) son los servicios financieros que funcionan on-chain, sin intermediarios:
- **Exchanges descentralizados (DEX)**: intercambia tokens sin que una empresa lo custodie (Uniswap, Osmosis)
- **Lending**: presta y pide prestado crypto sin banco (Aave, Compound)
- **Staking**: bloquea tokens para asegurar la red y recibir recompensas (ICP Neurons, ATOM staking)
- **Yield Farming**: provee liquidez y recibe fees del protocolo
- **Bridges**: mueve tokens entre blockchains diferentes (Wormhole, THORChain)

### ¿Qué es ICP y por qué es diferente?

Internet Computer Protocol (ICP) es la blockchain que permite que DCSS exista como una aplicación completamente descentralizada:

- **Sin servidores centralizados**: el código y los datos de DCSS corren en la blockchain ICP, no en AWS ni Google Cloud
- **Smart contracts como canisters**: los programas en ICP se llaman "canisters" y pueden almacenar datos, correr lógica y servir interfaces web
- **Cycles como gas**: en lugar de gas variable como Ethereum, ICP usa "cycles" con costo predecible
- **Identidad soberana**: Internet Identity permite autenticarse sin contraseñas ni emails, usando tus dispositivos
- **Velocidad**: transacciones finalizadas en ~1-2 segundos

### ¿Qué es un Bridge?

Un bridge (puente) es un protocolo que permite mover tokens entre blockchains diferentes. Sin bridges, cada blockchain es una isla. Con bridges:
- Puedes llevar BTC al ecosistema Ethereum como WBTC
- Puedes llevar ETH al ecosistema Cosmos como ETH.axl
- Puedes mover USDC entre Solana, Ethereum y Arbitrum

DCSS integra bridge UI preparado para conectar con Wormhole (multi-chain) en Fase 3.

### ¿Qué es Staking?

Staking significa bloquear tokens para participar en la seguridad o governance de una blockchain y recibir recompensas a cambio:
- **ICP Neurons**: bloqueas ICP por períodos de hasta 8 años para votar en governance y recibir hasta 15% APY
- **ATOM Delegation**: delegas ATOM a un validator para recibir ~14-20% APY y participar en governance Cosmos
- **SOL Liquid Staking**: staking sin lockup a través de protocolos como Marinade o Jito
- **DCSS Staking**: próximamente, bloquea DCSS para recibir fees del protocolo

---

## Plan de Implementación

### Paso 1 — Datos base
- Actualizar `tokens.ts`: agregar SAHARA, IP, CLP + campos description, officialUrl, explorerUrl
- Crear `projectContent.ts` con manifesto completo, narrativa de tokens y contenido educativo
- Crear `networkContent.ts` con descripción, links y stats por red

### Paso 2 — Componentes nuevos
- `CircuitBackground.tsx` — fondo SVG global
- `SplashOverlay.tsx` — splash animado con localStorage flag
- `AnnouncementBanner.tsx` — banner Coming Soon DCSS Coin
- `NetworkBanner.tsx` — banner con textura CSS por red, expandible
- `NetworkSubHub.tsx` — contenido del sub-hub expandido

### Paso 3 — Vistas nuevas
- `NetworkGroupedView.tsx` — TokenGrid en modo agrupado por red
- `pages/StakingPage.tsx` — página staking completa
- `pages/ProjectPage.tsx` — manifesto, educación, roadmap
- `pages/TokenDetailPage.tsx` — detalle de token individual con narrativa

### Paso 4 — Modificaciones
- `App.tsx` — routing multipage, Splash + Circuit + AnnouncementBanner
- `Navbar.tsx` — agregar tabs Project y Staking
- `TokenGrid.tsx` — toggle vista agrupada vs grid
- `TokenCard.tsx` — click en nombre → token detail, badge de red
- `WalletConnectModal.tsx` — prop `preselectedNetwork`

### Paso 5 — Accesibilidad y pulido
- ARIA labels completos
- `prefers-reduced-motion` en todas las animaciones
- Focus ring verde en todos los elementos interactivos
- Test de contraste en banners con textura

---

## Estado de Features

| Feature | Spec 0 (Draft actual) | Spec 1 (A implementar) |
|---------|----------------------|------------------------|
| Token grid básico | ✅ | — |
| Precios simulados 30s | ✅ | — |
| Wallet por red | ✅ | — |
| ActionModal decimal + MAX | ✅ | — |
| ActivityFeed vacío | ✅ | — |
| BridgePanel UI | ✅ | — |
| WalletConnect flujo 2 pasos | ✅ | — |
| Backend Motoko stats | ✅ | — |
| Circuit-chip background | ❌ | ⚡ Pendiente |
| Splash overlay animado | ❌ | ⚡ Pendiente |
| Banner Coming Soon DCSS | ❌ | ⚡ Pendiente |
| Banners textura ICP | ❌ | ⚡ Pendiente |
| Banners textura EVM | ❌ | ⚡ Pendiente |
| Banners textura Solana | ❌ | ⚡ Pendiente |
| Banners textura Cosmos | ❌ | ⚡ Pendiente |
| Sub-hub expandible por red | ❌ | ⚡ Pendiente |
| Tokens agrupados por red | ❌ | ⚡ Pendiente |
| Token CLP (Chile) | ❌ | ⚡ Pendiente |
| Token SAHARA | ❌ | ⚡ Pendiente |
| Token IP (Story) | ❌ | ⚡ Pendiente |
| Página /staking | ❌ | ⚡ Pendiente |
| Página /project | ❌ | ⚡ Pendiente |
| Página /token/:symbol | ❌ | ⚡ Pendiente |
| Narrativa de 43 tokens | ❌ | ⚡ Pendiente |
| Contenido educativo blockchain | ❌ | ⚡ Pendiente |
| Manifesto DCSS completo | ❌ | ⚡ Pendiente |
| ARIA / accesibilidad completa | Parcial | ⚡ Completar |
| Badge de red en TokenCard | ❌ | ⚡ Pendiente |

---

## Pendiente para Spec 2 (NO incluir en Spec 1)

- **38 páginas profundas de tokens**: diseño único por token, inspirado en el sitio oficial de cada proyecto. No plantilla genérica. Requiere investigación individual de cada uno de los 38+ sitios web.
- Fonts específicas por red/token (investigación en curso)
- Integración de oráculos de precios reales (Chainlink, Pyth)
- Bridge SDK funcional (Wormhole / LayerZero)
- On-chain activity feed (The Graph o similar)
- Staking backend activo (Motoko neuron/stake logic)
- Portfolio analytics: gráficos históricos, P&L, allocation chart
- Price alerts y notificaciones
- Multi-wallet simultáneo
- Export de historial (CSV)
- Mobile app / PWA
- Comunidad: Discord embed, Twitter/X feed
