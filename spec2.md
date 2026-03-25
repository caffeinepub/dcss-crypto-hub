# DCSS Crypto Hub — Spec Fase 2 (Delta sobre spec1)

> **Referencia:** spec1.md es el baseline completo. Este spec documenta SOLO lo agregado en Fase 2.
> **Estado:** COMPLETADO — Draft v8.

---

## Qué se agregó en Fase 2

### Token Detail Pages — visualizaciones únicas

Cada token tiene página propia con: tagline de 3 palabras, stats únicos, visualización
interactiva y sección educativa. No existían en Fase 1.

| Token | Visualización |
|-------|---------------|
| ICP | Galería de apps on-chain (Caffeine, OISY, OpenChat, WaterNeuron) |
| BTC | Timeline de halvings 2009 → 2028 |
| ETH | Sistema solar CSS con L2s orbitando |
| SOL | 4 métricas grandes de red (TPS, fees, validators, uptime) |
| CLP | Whitepaper completo + tabla DAI/USDC/Terra + roadmap 5 fases |
| PYTH | Ticker horizontal de precios en vivo (simulado) |
| MINA | Comparativa 22KB vs 300GB |
| ATOM | Ecosistema IBC como red de nodos |
| INJ | Stats animados (Block time 0.64s, TPS, costo) |
| LINK | Web de protocolos DeFi que lo usan |
| NEAR | Diagrama Chain Abstraction |
| AKT | Calculadora Akash vs AWS ($1.33 vs $3.93/hr) |
| RENDER | Comparativa de costo de renderizado |
| GRASS | Animación de partículas de ancho de banda |
| TAO | Grid de 8 subnets de Bittensor |
| AR | Timeline 2024 → 2224 |
| IP | Árbol de derivados con flujo de royalties |
| ASI | Venn diagram fusión FET+AGIX+OCEAN |
| KERNEL | Calculadora APY restaking |
| API3 | Diagrama first-party vs third-party oracle |
| USDT/USDC | Comparativa + flujo fiat→DeFi Chile (ambos diagramas) |
| DOT | Parachain network diagram |
| TIA | Modular blockchain layers diagram |
| 0G | AI data flow + stats reales (650M txs, 22M cuentas, 11k TPS) |
| GRT | Subgraph indexing diagram |
| DVPN | Global VPN node map |
| NMR | Tournament leaderboard (simulado) |
| KAITO | Mindshare leaderboard (simulado) |
| VIRTUAL | Agent gallery (3 agentes demo) |
| IO | GPU marketplace UI |
| TRAC | Supply chain trace demo |
| AVAX | Subnet architecture |
| ADA | Peer-reviewed paper count timeline |
| UP | Yield aggregation flow |

---

### Sección DePIN Universe en /project

11 tokens DePIN del ecosistema con badge y hover glow mejorado.
Tokens: AKT, RENDER, GRASS, IO, ATH, LPT, DVPN, TRAC, GRT, API3, PYTH

---

### Whitepaper CLP Token (en /token/CLP y /project)

Documenta el modelo DAI aplicado al peso chileno en ICP.

**Comparativa CLP vs stablecoins:**
| Aspecto | CLP | DAI | USDC | Terra (colapsado) |
|---------|-----|-----|------|-------------------|
| Respaldo | USDT/USDC 1:1 | Colateral múltiple | USD fiat auditado | Algorítmico (LUNA) |
| Gobernanza | Comité + guardianes | MakerDAO | Circle centralizado | Terra Labs |
| Liquidez | 30-40% líquido | Variable | Alta regulada | Colapsó por bank run |
| Regulación bancaria | No requerida (DeFi) | No requerida | Sí (Circle) | No tenía |

**Sección educativa**: "¿Por qué no colapsará como Terra?"
- Terra: algoritmo + colateral volátil (LUNA) → colapso 2022
- CLP: reservas reales + liquidez mínima 30% + gobernanza filtrada

**Roadmap CLP** — ver spec1 para la tabla completa. Fases 2 y 5 marcadas OPCIONAL.

---

### Investigación de 35+ sitios oficiales

Resumen de ideas clave extraídas y aplicadas a las visualizaciones:
- **0G Labs**: 650M txs testnet, 22M cuentas, 11k TPS peak, partners Hack VC, Alibaba Cloud
- **io.net**: "The Open Source AI Infrastructure Platform"
- **virtuals.io**: "Society of AI Agents"
- **Akash**: calculadora real de costos vs AWS/GCP ($1.33 vs $3.93/hr GPU)
- **Pyth**: ticker de alta frecuencia, "world's fastest oracle"
- **NEAR**: Chain Abstraction — Intent → NEAR resuelve → cualquier chain

Investigación completa preservada en Google Docs del usuario.
