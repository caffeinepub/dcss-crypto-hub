import { Skeleton } from "@/components/ui/skeleton";
import { Globe, RefreshCw, TrendingUp, Users, Zap } from "lucide-react";
import { useStats } from "../hooks/useQueries";
import DCSSEcosystemDiagram from "./DCSSEcosystemDiagram";

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: typeof Globe;
  label: string;
  value: string;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex items-center gap-1.5 text-xs"
        style={{ color: "#A9B3AF" }}
      >
        <Icon size={12} style={{ color: "#00D4B8" }} />
        {label}
      </div>
      {loading ? (
        <Skeleton
          className="h-5 w-24"
          style={{ background: "rgba(0,212,184,0.1)" }}
        />
      ) : (
        <span
          className="text-base font-bold font-mono"
          style={{ color: "#00D4B8" }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

export default function DCSSHero() {
  const { data: stats, isLoading } = useStats();

  const statsItems = [
    {
      icon: TrendingUp,
      label: "Total Supply",
      value: stats ? `${(stats.totalSupply / 1_000_000).toFixed(1)}M` : "-",
    },
    {
      icon: RefreshCw,
      label: "Circulando",
      value: stats
        ? `${(stats.circulatingSupply / 1_000_000).toFixed(1)}M`
        : "-",
    },
    {
      icon: Users,
      label: "Holders",
      value: stats ? Number(stats.holders).toLocaleString() : "-",
    },
    {
      icon: Globe,
      label: "Total TXs",
      value: stats ? Number(stats.txCount).toLocaleString() : "-",
    },
    {
      icon: Zap,
      label: "Ciclos ICP",
      value: stats
        ? `${(Number(stats.cyclesConsumed) / 1_000_000_000).toFixed(2)}B`
        : "-",
    },
  ];

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #070B0A 0%, #0B1110 50%, #070B0A 100%)",
        borderBottom: "1px solid rgba(0,212,184,0.1)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(0,212,184,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1200px] mx-auto px-4 pt-12 pb-8">
        <div className="text-center mb-6">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight glow-green font-display"
            style={{ color: "#E8ECEB" }}
          >
            Gestiona tus Activos
            <span style={{ color: "#00D4B8" }}> en Múltiples Cadenas</span>
          </h1>
          <p className="text-sm md:text-base" style={{ color: "#A9B3AF" }}>
            El hub multichain DCSS — ICP, EVM, Solana, Cosmos
          </p>
        </div>

        {/* Ecosystem Diagram replaces 3D globe */}
        <div className="flex justify-center mb-4">
          <DCSSEcosystemDiagram />
        </div>

        <div className="flex justify-center mb-8">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider"
            style={{
              background: "rgba(0,212,184,0.08)",
              border: "1px solid rgba(0,212,184,0.25)",
              color: "#00D4B8",
            }}
          >
            <img
              src="/assets/generated/dcss-logo-transparent.dim_200x200.png"
              alt="DCSS"
              className="w-5 h-5 rounded-full"
            />
            ECOSISTEMA DCSS · POWERED BY ICP
          </div>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-4 rounded-xl"
          style={{
            background: "rgba(15,21,19,0.6)",
            border: "1px solid rgba(0,212,184,0.1)",
          }}
        >
          {statsItems.map((s) => (
            <StatCard
              key={s.label}
              icon={s.icon}
              label={s.label}
              value={s.value}
              loading={isLoading}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
