import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, Layers, Lock, TrendingUp, Users, Zap } from "lucide-react";

const POOLS = [
  {
    name: "ICP Neuron",
    apy: "8–15%",
    lockup: "6–96 meses",
    description:
      "Bloquea ICP en neuronas para participar en la governance de Internet Computer y recibir recompensas.",
    color: "#29ABE2",
    network: "ICP",
  },
  {
    name: "DCSS Staking",
    apy: "12–25%",
    lockup: "30–365 días",
    description:
      "Bloquea DCSS para recibir fees del protocolo y acceso premium al ecosistema DCSS Hub.",
    color: "#FFD700",
    network: "ICP",
  },
  {
    name: "SOL Liquid Staking",
    apy: "6–8%",
    lockup: "Sin lockup",
    description:
      "Stake SOL y recibe LST (Liquid Staking Token) para mantener liquidez mientras generas yield.",
    color: "#9945FF",
    network: "Solana",
  },
  {
    name: "ATOM Delegation",
    apy: "14–20%",
    lockup: "Unbonding 21 días",
    description:
      "Delega ATOM a validadores del Cosmos Hub para asegurar la red y recibir recompensas IBC.",
    color: "#6F7390",
    network: "Cosmos",
  },
];

const TIMELINE = [
  { label: "Diseño de contratos Motoko", done: false },
  { label: "Auditoría de seguridad", done: false },
  { label: "Testnet pública", done: false },
  { label: "Lanzamiento Fase 3", done: false },
];

export default function StakingPage() {
  return (
    <TooltipProvider>
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 16px" }}
      >
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 14px",
              borderRadius: "999px",
              background: "rgba(34,233,122,0.08)",
              border: "1px solid rgba(34,233,122,0.2)",
              fontSize: "11px",
              color: "#22E97A",
              fontWeight: "600",
              letterSpacing: "0.1em",
              marginBottom: "20px",
            }}
          >
            <Layers size={12} />
            COMING SOON
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: "800",
              color: "#E8ECEB",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Stake &amp; Earn
          </h1>
          <div
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: "800",
              color: "#22E97A",
              textShadow: "0 0 30px rgba(34,233,122,0.5)",
              marginBottom: "16px",
            }}
          >
            hasta 25% APY
          </div>
          <p
            style={{
              fontSize: "16px",
              color: "#A9B3AF",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Bloquea tus tokens en pools seguros y genera rendimientos
            compuestos. El módulo de staking llega en Fase 3.
          </p>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "40px",
          }}
          className="stats-grid"
        >
          {[
            { label: "Total Staked", value: "--", icon: Lock },
            { label: "APY Promedio", value: "--", icon: TrendingUp },
            { label: "Usuarios Staking", value: "--", icon: Users },
            { label: "Próximo Unlock", value: "--", icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "#0F1513",
                border: "1px solid rgba(34,233,122,0.12)",
                textAlign: "center",
              }}
              data-ocid="staking.stats.card"
            >
              <Icon
                size={20}
                style={{ color: "rgba(34,233,122,0.5)", margin: "0 auto 8px" }}
              />
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#A9B3AF",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {value}
              </div>
              <div
                style={{ fontSize: "11px", color: "#A9B3AF", marginTop: "4px" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Pools */}
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#E8ECEB",
            marginBottom: "20px",
          }}
        >
          Staking Pools
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
            marginBottom: "40px",
          }}
          className="pools-grid"
        >
          {POOLS.map((pool) => (
            <div
              key={pool.name}
              style={{
                padding: "24px",
                borderRadius: "12px",
                background: "#0F1513",
                border: `1px solid ${pool.color}22`,
                borderLeft: `4px solid ${pool.color}`,
              }}
              data-ocid="staking.pool.card"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#E8ECEB",
                    }}
                  >
                    {pool.name}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#A9B3AF",
                      marginTop: "3px",
                    }}
                  >
                    Network: {pool.network}
                  </div>
                </div>
                <div
                  style={{
                    padding: "5px 12px",
                    borderRadius: "999px",
                    background: "rgba(34,233,122,0.12)",
                    border: "1px solid rgba(34,233,122,0.3)",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#22E97A",
                  }}
                >
                  {pool.apy} APY
                </div>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#A9B3AF",
                  lineHeight: 1.5,
                  marginBottom: "16px",
                }}
              >
                {pool.description}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                <Clock size={12} style={{ color: pool.color }} />
                <span style={{ fontSize: "12px", color: pool.color }}>
                  {pool.lockup}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "10px", color: "#A9B3AF" }}>TVL</div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#A9B3AF",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    --
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      disabled
                      style={{
                        padding: "10px 20px",
                        borderRadius: "8px",
                        background: "rgba(34,233,122,0.06)",
                        border: "1px solid rgba(34,233,122,0.15)",
                        color: "rgba(34,233,122,0.4)",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "not-allowed",
                      }}
                      data-ocid="staking.stake.button"
                    >
                      <Zap
                        size={12}
                        style={{ display: "inline", marginRight: "6px" }}
                      />
                      Stake Now
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming Soon — Fase 3</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>

        {/* Mis posiciones */}
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#E8ECEB",
            marginBottom: "16px",
          }}
        >
          Mis Posiciones
        </h2>
        <div
          style={{
            padding: "40px",
            borderRadius: "12px",
            background: "#0F1513",
            border: "1px solid rgba(34,233,122,0.1)",
            textAlign: "center",
            marginBottom: "40px",
          }}
          data-ocid="staking.positions.empty_state"
        >
          <Lock
            size={32}
            style={{ color: "rgba(34,233,122,0.25)", margin: "0 auto 12px" }}
          />
          <p style={{ color: "#A9B3AF", fontSize: "14px" }}>
            Connect wallet to see your staking positions
          </p>
        </div>

        {/* Timeline */}
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#E8ECEB",
            marginBottom: "20px",
          }}
        >
          Roadmap de Staking
        </h2>
        <div
          style={{
            display: "flex",
            gap: "0",
            justifyContent: "space-between",
            position: "relative",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "10%",
              right: "10%",
              height: "2px",
              background: "rgba(34,233,122,0.12)",
            }}
          />
          {TIMELINE.map((item, i) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                flex: 1,
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: item.done ? "rgba(34,233,122,0.2)" : "#0F1513",
                  border: `2px solid ${item.done ? "#22E97A" : "rgba(169,179,175,0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: item.done ? "#22E97A" : "#A9B3AF",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#A9B3AF",
                  textAlign: "center",
                  maxWidth: "120px",
                  lineHeight: 1.4,
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Info banner */}
        <div
          style={{
            padding: "20px 24px",
            borderRadius: "12px",
            background: "rgba(34,233,122,0.05)",
            border: "1px solid rgba(34,233,122,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Zap size={20} style={{ color: "#22E97A", flexShrink: 0 }} />
          <p
            style={{
              fontSize: "14px",
              color: "#A9B3AF",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Staking estará disponible en{" "}
            <strong style={{ color: "#22E97A" }}>Fase 3</strong>. Por ahora,
            explora los pools y prepárate.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pools-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </TooltipProvider>
  );
}
