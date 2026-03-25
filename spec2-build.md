# DCSS Crypto Hub — Spec Fase 2 Build Delta

## Current State
TokenDetailPage exists with: header, price, chart placeholder, stats row, basic description, DCSS integration section, external links, related tokens. TokenVisual component exists with basic per-token visualizations but they are simple/placeholder quality.

## Requested Changes (Diff)

### Add
1. **Rich unique visualizations per token** — each token gets a distinct interactive CSS/SVG visualization replacing the generic TokenVisual
2. **Deep educational sections** — unique per-token educational content block (tabs, diagrams, comparisons)
3. **Token-specific taglines** — 3-word tagline unique to each token
4. **Enhanced stats** — real-feeling stats specific to each token's network
5. **CLP dedicated whitepaper section** — full whitepaper, DAI/USDC/Terra comparison table, 5-phase roadmap
6. **DePIN badge + universe section** — for all DePIN tokens
7. **Audience tabs for BTC** — Para el usuario / Para el inversor / Para el desarrollador
8. **ETH solar system visualization** — L2s orbiting ETH in CSS animation
9. **SOL network metrics** — 4 big stat cards with real Solana metrics
10. **ICP app gallery** — mini-gallery of apps running on ICP (Caffeine, OISY, OpenChat, WaterNeuron)
11. **PYTH live price ticker** — horizontal scrolling price ticker using app's simulated prices
12. **MINA size comparison** — 22KB vs 300GB visual bar
13. **ATOM IBC ecosystem** — visual list of IBC-connected chains in DCSS
14. **INJ stats counter** — animated stats (Block time 0.64s, TXs, etc.)
15. **LINK oracle web** — visualization of protocols using Chainlink
16. **NEAR chain abstraction diagram** — Intent → NEAR → Any Chain visual
17. **AKT savings calculator** — static GPU cost comparison Akash vs AWS
18. **RENDER cost comparison** — rendering cost bar chart
19. **GRASS particle animation** — CSS particles representing bandwidth flow
20. **TAO subnet grid** — badge grid of Bittensor subnets
21. **AR permanence timeline** — 2024 to 2224 data permanence visual
22. **IP attribution tree** — IP derivation tree with royalty flow
23. **ASI alliance merger diagram** — FET + AGIX + OCEAN = ASI Venn diagram
24. **KERNEL restaking diagram** — 1 stake securing multiple protocols
25. **API3 first-party oracle diagram** — traditional vs API3 comparison

### Modify
- `TokenDetailPage.tsx` — add unique sections per token using a data-driven approach with a `TOKEN_DEEP_DATA` map
- `TokenVisual.tsx` — replace/enhance all visualizations to be richer and more unique

### Remove
- Generic placeholder descriptions replaced with rich content

## Implementation Plan
1. Create `src/frontend/src/data/tokenDeepData.ts` with unique content per token (taglines, educational sections, stats, visualizations config)
2. Update `TokenVisual.tsx` with 25+ unique visualization components
3. Update `TokenDetailPage.tsx` to render deep content sections per token
4. Add CLP whitepaper section as a special rendered section
5. Add DePIN universe section for DePIN tokens
6. Validate and build
