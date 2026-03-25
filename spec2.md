# DCSS Crypto Hub — Spec Fase 2

> **Referencia:** spec1.md es el baseline. Spec2 documenta mejoras implementadas en Draft v6.
> **Estado:** IMPLEMENTADO en Draft v6.

---

## Estado de implementación

| Feature | Estado |
|---------|--------|
| tokenDeepData.ts — contenido profundo por 40 tokens | ✅ Implementado |
| TokenVisual.tsx — 25+ visualizaciones únicas | ✅ Implementado |
| TokenDetailPage.tsx — taglines, stats únicos, sección educativa | ✅ Implementado |
| CLP whitepaper completo | ✅ Implementado |
| ETH sistema solar CSS | ✅ Implementado |
| BTC timeline halvings | ✅ Implementado |
| SOL métricas de red | ✅ Implementado |
| ICP galería de apps on-chain | ✅ Implementado |
| PYTH ticker de precios | ✅ Implementado |
| MINA comparativa 22KB vs 300GB | ✅ Implementado |
| ATOM ecosistema IBC | ✅ Implementado |
| INJ stats animados | ✅ Implementado |
| LINK web de protocolos | ✅ Implementado |
| NEAR diagrama Chain Abstraction | ✅ Implementado |
| AKT calculadora Akash vs AWS | ✅ Implementado |
| RENDER comparativa de costo | ✅ Implementado |
| GRASS animación de partículas | ✅ Implementado |
| TAO grid de subnets | ✅ Implementado |
| AR timeline 2024→2224 | ✅ Implementado |
| IP árbol de derivados | ✅ Implementado |
| ASI Venn diagram fusión | ✅ Implementado |
| KERNEL calculadora restaking | ✅ Implementado |
| API3 diagrama first-party | ✅ Implementado |
| USDT/USDC comparativa + flujo Chile | ✅ Implementado |

---

## Whitepaper CLP Token

### Comparativa: CLP vs DAI vs USDC vs Terra

| Aspecto | CLP | DAI | USDC | Terra (colapsado) |
|---------|-----|-----|------|-------------------|
| Respaldo | USDT/USDC 1:1 | Colateral múltiple (ETH/USDC) | USD fiat auditado | Algorítmico (LUNA volátil) |
| Emisión | Mint respaldado | Over-collateralized | Regulado Circle | Algorítmica sin respaldo real |
| Gobernanza | Comité + guardianes + quórum | MakerDAO voting | Circle centralizado | Terra Labs centralizado |
| Liquidez | 30-40% líquido, 60-70% staking | Variable por mercado | Alta (regulada) | Colapsó por bank run |
| Riesgo | Bajo (reservas reales) | Medio (volatilidad colateral) | Bajo (regulado) | Colapsó en 2022 |

### Whitepaper Resumen (8 secciones)
1. Introducción — CLP anclado 1:1 respaldado en USDT/USDC
2. Arquitectura — contratos ICP, 30-40% líquido, 60-70% staking
3. Gobernanza — comité validadores, quórum mínimo, guardianes emergencia
4. Liquidez y APY — pool líquido, APY de comisiones reales (no inflacionario)
5. Quema — cada redención destruye CLP, supply = reservas siempre
6. Seguridad — reservas diversificadas, auditorías externas, código abierto
7. Roadmap 5 fases — USDT → bancos chilenos → puentes EVM/Solana → DAO → adopción masiva
8. Diferencias con Terra — respaldo real, liquidez garantizada, gobernanza filtrada

---

## Investigación de sitios oficiales (35+ tokens)

[Contenido completo preservado de la versión anterior — ver spec2.md histórico en Google Docs del usuario]

---

## Pendiente para Fase 3

- [ ] Fonts específicas por red/token en banners (confirmar con devtools)
- [ ] Oráculos de precios reales (Chainlink EVM, Pyth Solana)
- [ ] Bridge SDK funcional (Wormhole)
- [ ] Activity feed on-chain (The Graph)
- [ ] Staking backend activo (Motoko)
- [ ] MAX conectado a balance real de wallet
- [ ] Portfolio analytics (charts P&L, allocation)
- [ ] Price alerts
- [ ] Multi-wallet simultáneo
- [ ] Export CSV historial
- [ ] Expansión LATAM (ARS, COP, PEN)
