import { Skeleton } from "@/components/ui/skeleton";
import { Canvas, useFrame } from "@react-three/fiber";
import { Globe, RefreshCw, TrendingUp, Users, Zap } from "lucide-react";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { useStats } from "../hooks/useQueries";

interface NodePos {
  key: string;
  pos: [number, number, number];
}

function WireframeEarth() {
  const groupRef = useRef<Group>(null);

  const nodes = useMemo<NodePos[]>(() => {
    const count = 14;
    return Array.from({ length: count }, (_, i) => {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      return {
        key: `node-${i}`,
        pos: [
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta),
        ] as [number, number, number],
      };
    });
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.28;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.02, 24, 16]} />
        <meshBasicMaterial color="#00D4B8" transparent opacity={0.04} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1, 22, 16]} />
        <meshBasicMaterial
          color="#00D4B8"
          wireframe
          transparent
          opacity={0.38}
        />
      </mesh>
      {nodes.map(({ key, pos }) => (
        <mesh key={key} position={pos}>
          <sphereGeometry args={[0.048, 7, 7]} />
          <meshBasicMaterial color="#00D4B8" />
        </mesh>
      ))}
    </group>
  );
}

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
      label: "Circulating",
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
      label: "Cycles Used",
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
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight glow-green"
            style={{ color: "#E8ECEB" }}
          >
            Manage Your Assets
            <span style={{ color: "#00D4B8" }}> Across Chains</span>
          </h1>
          <p className="text-sm md:text-base" style={{ color: "#A9B3AF" }}>
            The DCSS multichain hub — ICP, EVM, Solana, Cosmos
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div style={{ width: "220px", height: "220px" }}>
            <Canvas
              gl={{ alpha: true, antialias: true }}
              camera={{ position: [0, 0, 2.9], fov: 48 }}
              style={{ background: "transparent" }}
            >
              <WireframeEarth />
            </Canvas>
          </div>
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
            DCSS ECOSYSTEM · POWERED BY ICP
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
