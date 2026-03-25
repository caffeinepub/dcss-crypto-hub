import { useEffect, useRef, useState } from "react";

interface Node {
  id: string;
  label: string;
  sublabel?: string;
  ring: number;
  angle: number;
  color: string;
  status: "live" | "partial" | "fase4" | "core";
}

const NODES: Omit<Node, "angle">[] = [
  // Ring 0 — Core
  {
    id: "dcss",
    label: "DCSS",
    sublabel: "Core",
    ring: 0,
    color: "#00D4B8",
    status: "core",
  },

  // Ring 1 — ICP Core
  {
    id: "icp-runtime",
    label: "ICP",
    sublabel: "Runtime",
    ring: 1,
    color: "#29ABE2",
    status: "live",
  },
  {
    id: "ii",
    label: "Internet",
    sublabel: "Identity",
    ring: 1,
    color: "#29ABE2",
    status: "live",
  },
  {
    id: "motoko",
    label: "Motoko",
    sublabel: "Canister",
    ring: 1,
    color: "#29ABE2",
    status: "live",
  },

  // Ring 2 — Data/Oracles
  {
    id: "coingecko",
    label: "CoinGecko",
    sublabel: "LIVE",
    ring: 2,
    color: "#8DC647",
    status: "live",
  },
  {
    id: "the-graph",
    label: "The Graph",
    sublabel: "PARCIAL",
    ring: 2,
    color: "#6F4CFF",
    status: "partial",
  },
  {
    id: "pyth",
    label: "Pyth",
    sublabel: "FASE 4",
    ring: 2,
    color: "#E6A817",
    status: "fase4",
  },
  {
    id: "chainlink",
    label: "Chainlink",
    sublabel: "FASE 4",
    ring: 2,
    color: "#375BD2",
    status: "fase4",
  },

  // Ring 3 — Networks
  {
    id: "eth",
    label: "ETH",
    sublabel: "Ethereum",
    ring: 3,
    color: "#627EEA",
    status: "live",
  },
  {
    id: "sol",
    label: "SOL",
    sublabel: "Solana",
    ring: 3,
    color: "#9945FF",
    status: "live",
  },
  {
    id: "cosmos",
    label: "ATOM",
    sublabel: "Cosmos",
    ring: 3,
    color: "#6F7390",
    status: "live",
  },
  {
    id: "dot",
    label: "DOT",
    sublabel: "Polkadot",
    ring: 3,
    color: "#E6007A",
    status: "live",
  },
  {
    id: "tia",
    label: "TIA",
    sublabel: "Celestia",
    ring: 3,
    color: "#7B2FBE",
    status: "live",
  },
  {
    id: "0g",
    label: "0G",
    sublabel: "0G Labs",
    ring: 3,
    color: "#00B3EF",
    status: "live",
  },
  {
    id: "btc",
    label: "BTC",
    sublabel: "Bitcoin",
    ring: 3,
    color: "#F7931A",
    status: "live",
  },

  // Ring 4 — Wallets & Bridges
  {
    id: "metamask",
    label: "MetaMask",
    ring: 4,
    color: "#F6851B",
    status: "live",
  },
  {
    id: "phantom",
    label: "Phantom",
    ring: 4,
    color: "#AB9FF2",
    status: "live",
  },
  { id: "keplr", label: "Keplr", ring: 4, color: "#6F4CFF", status: "live" },
  { id: "oisy", label: "OISY", ring: 4, color: "#29ABE2", status: "live" },
  {
    id: "coinbase",
    label: "Coinbase",
    ring: 4,
    color: "#0052FF",
    status: "live",
  },
  {
    id: "binance",
    label: "Binance",
    ring: 4,
    color: "#F0B90B",
    status: "live",
  },
  {
    id: "ibc",
    label: "IBC",
    sublabel: "Bridge",
    ring: 4,
    color: "#6F7390",
    status: "live",
  },
  {
    id: "wormhole",
    label: "Wormhole",
    sublabel: "FASE 4",
    ring: 4,
    color: "#C4837A",
    status: "fase4",
  },
  {
    id: "layerzero",
    label: "LayerZero",
    sublabel: "FASE 4",
    ring: 4,
    color: "#C4837A",
    status: "fase4",
  },
];

// 3D perspective: orbits are tilted ellipses (solar-system view from ~25° elevation)
// x-radius stays full, y-radius is compressed by TILT factor
const TILT = 0.3;
const RING_RADII_X = [0, 75, 135, 200, 270];
const RING_RADII_Y = RING_RADII_X.map((r) => r * TILT);
const RING_SPEEDS = [0, 0.0004, -0.0003, 0.00025, -0.0002];

const CANVAS_W = 620;
const CANVAS_H = 320;

function getNodesWithAngles(): Node[] {
  const byRing: Record<number, Omit<Node, "angle">[]> = {};
  for (const n of NODES) {
    if (!byRing[n.ring]) byRing[n.ring] = [];
    byRing[n.ring].push(n);
  }
  const result: Node[] = [];
  for (const ring of Object.keys(byRing).map(Number)) {
    const group = byRing[ring];
    group.forEach((n, i) => {
      // Stagger ring 4 start angle for better spacing
      const offset = ring === 4 ? Math.PI / 8 : 0;
      result.push({
        ...n,
        angle: offset + (2 * Math.PI * i) / group.length,
      });
    });
  }
  return result;
}

const BASE_NODES = getNodesWithAngles();

// Project 3D orbit point to 2D canvas (perspective ellipse)
function orbitPoint(
  cx: number,
  cy: number,
  angle: number,
  rx: number,
  ry: number,
  scale: number,
) {
  return {
    x: cx + Math.cos(angle) * rx * scale,
    y: cy + Math.sin(angle) * ry * scale,
    // Depth factor: nodes "behind" are slightly smaller
    depth: (Math.sin(angle) + 1) / 2, // 0=back, 1=front
  };
}

export default function DCSSEcosystemDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const anglesRef = useRef<number[]>(BASE_NODES.map((n) => n.angle));
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const hoveredRef = useRef<string | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    hoveredRef.current = hoveredId;
  }, [hoveredId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    function draw(now: number) {
      if (!canvas || !ctx) return;
      const dt = now - lastTime;
      lastTime = now;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2 + 20; // shift center slightly down for perspective
      const scale = W / CANVAS_W;

      if (!pausedRef.current) {
        BASE_NODES.forEach((n, i) => {
          anglesRef.current[i] += RING_SPEEDS[n.ring] * dt;
        });
      }

      ctx.clearRect(0, 0, W, H);

      // Draw orbit ellipses (back to front)
      for (let r = 4; r >= 1; r--) {
        const rx = RING_RADII_X[r] * scale;
        const ry = RING_RADII_Y[r] * scale;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,212,184,0.07)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw connection lines from core to ring 1
      for (const n of BASE_NODES.filter((n) => n.ring === 1)) {
        const i = BASE_NODES.indexOf(n);
        const a = anglesRef.current[i];
        const rx = RING_RADII_X[1] * scale;
        const ry = RING_RADII_Y[1] * scale;
        const pt = orbitPoint(cx, cy, a, rx, ry, 1);
        const grad = ctx.createLinearGradient(cx, cy, pt.x, pt.y);
        grad.addColorStop(0, "rgba(0,212,184,0.35)");
        grad.addColorStop(1, "rgba(0,212,184,0.04)");
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pt.x, pt.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Sort all non-core nodes back-to-front for correct overlap rendering
      const renderOrder = BASE_NODES.map((n, i) => ({
        n,
        i,
        y:
          n.ring === 0
            ? -999
            : orbitPoint(
                cx,
                cy,
                anglesRef.current[i],
                RING_RADII_X[n.ring] * scale,
                RING_RADII_Y[n.ring] * scale,
                1,
              ).y,
      })).sort((a, b) => a.y - b.y);

      // Draw nodes in depth order
      for (const { n, i } of renderOrder) {
        const a = anglesRef.current[i];
        const rx = RING_RADII_X[n.ring] * scale;
        const ry = RING_RADII_Y[n.ring] * scale;

        let nx: number;
        let ny: number;
        let depthFactor: number;

        if (n.ring === 0) {
          nx = cx;
          ny = cy;
          depthFactor = 1;
        } else {
          const pt = orbitPoint(cx, cy, a, rx, ry, 1);
          nx = pt.x;
          ny = pt.y;
          // Nodes behind center (sin(a) < 0) are slightly smaller
          depthFactor = 0.78 + 0.22 * pt.depth;
        }

        const isHovered = hoveredRef.current === n.id;
        const isFade = n.status === "fase4";
        const alpha = isFade ? 0.38 : depthFactor;
        const baseR = n.ring === 0 ? 24 : isHovered ? 18 : 13;
        const radius = baseR * scale * depthFactor;

        // Glow
        if (isHovered || n.ring === 0) {
          const glow = ctx.createRadialGradient(
            nx,
            ny,
            0,
            nx,
            ny,
            radius * 2.8,
          );
          glow.addColorStop(0, `${n.color}2E`);
          glow.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(nx, ny, radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Circle
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(nx, ny, radius, 0, Math.PI * 2);
        ctx.fillStyle = n.ring === 0 ? `${n.color}20` : `${n.color}15`;
        ctx.fill();
        ctx.strokeStyle = isHovered ? n.color : `${n.color}88`;
        ctx.lineWidth = isHovered ? 1.5 : 0.8;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Label
        const fontSize = (n.ring === 0 ? 10 : 8) * scale * depthFactor;
        ctx.globalAlpha = alpha;
        ctx.font = `${n.ring === 0 ? 700 : 600} ${fontSize}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = isFade
          ? `${n.color}55`
          : isHovered
            ? n.color
            : `${n.color}CC`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.label, nx, ny - (n.sublabel ? fontSize * 0.55 : 0));

        if (n.sublabel) {
          ctx.font = `500 ${fontSize * 0.82}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = isFade
            ? "rgba(169,179,175,0.25)"
            : "rgba(169,179,175,0.65)";
          ctx.fillText(n.sublabel, nx, ny + fontSize * 0.75);
        }
        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2 + 20;
    const scale = W / CANVAS_W;

    let found: string | null = null;
    BASE_NODES.forEach((n, i) => {
      const a = anglesRef.current[i];
      const rx = RING_RADII_X[n.ring] * scale;
      const ry = RING_RADII_Y[n.ring] * scale;
      let nx: number;
      let ny: number;
      if (n.ring === 0) {
        nx = cx;
        ny = cy;
      } else {
        const pt = orbitPoint(cx, cy, a, rx, ry, 1);
        nx = pt.x;
        ny = pt.y;
      }
      const radius = (n.ring === 0 ? 28 : 16) * scale;
      const dist = Math.sqrt((mx - nx) ** 2 + (my - ny) ** 2);
      if (dist < radius) found = n.id;
    });
    setHoveredId(found);
  }

  const hoveredNode = BASE_NODES.find((n) => n.id === hoveredId);

  const statusLabel = {
    live: "LIVE",
    partial: "PARCIAL",
    fase4: "FASE 4",
    core: "CORE",
  };
  const statusColor = {
    live: "#00D4B8",
    partial: "#E6A817",
    fase4: "rgba(169,179,175,0.5)",
    core: "#00D4B8",
  };

  return (
    <div
      style={{
        borderRadius: "16px",
        background: "#0F1513",
        border: "1px solid rgba(0,212,184,0.12)",
        padding: "20px 24px 16px",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        maxWidth: "700px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#E8ECEB",
              margin: 0,
            }}
          >
            Ecosistema DCSS
          </h3>
          <p
            style={{
              fontSize: "10px",
              color: "#A9B3AF",
              margin: "2px 0 0",
            }}
          >
            Hover para detalles · Click para pausar
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {(["live", "partial", "fase4"] as const).map((s) => (
            <div
              key={s}
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: statusColor[s],
                }}
              />
              <span
                style={{
                  fontSize: "9px",
                  color: statusColor[s],
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {statusLabel[s]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{
            width: "100%",
            display: "block",
            margin: "0 auto",
            cursor: hoveredId ? "pointer" : "default",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => setPaused((p) => !p)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setPaused((p) => !p);
          }}
          tabIndex={0}
          role="img"
          aria-label="Diagrama del ecosistema DCSS — vista 3D perspectiva solar"
          data-ocid="ecosystem.canvas_target"
        />

        {paused && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "5px 13px",
              borderRadius: "999px",
              background: "rgba(15,21,19,0.85)",
              border: "1px solid rgba(0,212,184,0.25)",
              fontSize: "10px",
              color: "#00D4B8",
              pointerEvents: "none",
            }}
          >
            ⏸ PAUSADO
          </div>
        )}

        {hoveredNode && (
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "6px 14px",
              borderRadius: "10px",
              background: "rgba(7,11,10,0.92)",
              border: `1px solid ${hoveredNode.color}44`,
              fontSize: "10px",
              color: "#E8ECEB",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              boxShadow: `0 0 14px ${hoveredNode.color}22`,
            }}
          >
            <span style={{ color: hoveredNode.color, fontWeight: 700 }}>
              {hoveredNode.label}
            </span>
            {hoveredNode.sublabel && (
              <span style={{ color: "#A9B3AF", marginLeft: "6px" }}>
                {hoveredNode.sublabel}
              </span>
            )}
            <span
              style={{
                marginLeft: "8px",
                padding: "1px 6px",
                borderRadius: "999px",
                background: `${statusColor[hoveredNode.status]}15`,
                border: `1px solid ${statusColor[hoveredNode.status]}44`,
                color: statusColor[hoveredNode.status],
                fontSize: "9px",
              }}
            >
              {statusLabel[hoveredNode.status]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
