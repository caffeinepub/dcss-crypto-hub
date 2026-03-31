import { ExternalLink } from "lucide-react";

const DEPIN_TOKENS = [
  {
    symbol: "RENDER",
    name: "Render Network",
    category: "GPU Computing",
    description:
      "Red descentralizada de rendering GPU para creadores y estudios.",
    color: "#FF4500",
    coingeckoId: "render-token",
  },
  {
    symbol: "IO",
    name: "io.net",
    category: "Compute Network",
    description: "Infraestructura de cómputo distribuido para IA y ML.",
    color: "#00D4FF",
    coingeckoId: "io-net",
  },
  {
    symbol: "GRASS",
    name: "Grass",
    category: "Bandwidth Sharing",
    description:
      "Convierte tu ancho de banda no utilizado en recompensas cripto.",
    color: "#4CAF50",
    coingeckoId: "grass",
  },
  {
    symbol: "AKT",
    name: "Akash Network",
    category: "Cloud Compute",
    description: "Mercado abierto de computación en la nube descentralizada.",
    color: "#FF414C",
    coingeckoId: "akash-network",
  },
  {
    symbol: "TRAC",
    name: "OriginTrail",
    category: "Data Provenance",
    description:
      "Grafo de conocimiento descentralizado para cadenas de suministro.",
    color: "#3EAFDD",
    coingeckoId: "origintrail",
  },
  {
    symbol: "GRT",
    name: "The Graph",
    category: "Indexing Protocol",
    description: "Protocolo de indexación para consultar datos de blockchain.",
    color: "#6747ED",
    coingeckoId: "the-graph",
  },
  {
    symbol: "TAO",
    name: "Bittensor",
    category: "AI Marketplace",
    description:
      "Red descentralizada de inteligencia artificial y machine learning.",
    color: "#36A18B",
    coingeckoId: "bittensor",
  },
  {
    symbol: "AR",
    name: "Arweave",
    category: "Permanent Storage",
    description: "Almacenamiento descentralizado permanente con pago único.",
    color: "#5FADCF",
    coingeckoId: "arweave",
  },
  {
    symbol: "DVPN",
    name: "Sentinel",
    category: "VPN Network",
    description: "Red VPN descentralizada con privacidad verificable.",
    color: "#4AB44A",
    coingeckoId: "sentinel",
  },
  {
    symbol: "ASI",
    name: "ASI Alliance",
    category: "AI Infrastructure",
    description: "Fusión de Fetch.ai, SingularityNET y Ocean para IA soberana.",
    color: "#1B6FBF",
    coingeckoId: "fetch-ai",
  },
  {
    symbol: "ATH",
    name: "Aethir",
    category: "GPU Cloud",
    description: "Nube de GPU para gaming, IA y aplicaciones de alta demanda.",
    color: "#6EFF6E",
    coingeckoId: "aethir",
  },
];

const COINGECKO_BASE = "https://assets.coingecko.com/coins/images";
const LOGO_MAP: Record<string, string> = {
  RENDER: "28/'render-token.png'?size=40".replace("'", "").replace("'", ""),
  IO: "38573/small/io.png?1717540286",
  GRASS: "38563/small/grass.jpg?1717540286",
  AKT: "12785/small/akash-logo.png?1697521024",
  TRAC: "1877/small/TRAC.jpg?1696502540",
  GRT: "13397/small/Graph_Token.png?1696513159",
  TAO: "28452/small/ARN.png?1700384718",
  AR: "4354/small/q9MdmrD.png?1696504894",
  DVPN: "12842/small/logo.png?1696512628",
  ASI: "5681/small/fetcher_token_icon.png?1696506131",
  ATH: "39387/small/aethir.jpg?1721732123",
};

interface DePINSectionProps {
  onNavigateToToken: (symbol: string) => void;
}

export default function DePINSection({ onNavigateToToken }: DePINSectionProps) {
  return (
    <section
      className="max-w-[1200px] mx-auto px-4 py-12"
      aria-labelledby="depin-heading"
    >
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{
              background: "rgba(34,233,122,0.1)",
              border: "1px solid rgba(34,233,122,0.25)",
              color: "#22E97A",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22E97A] animate-pulse-matrix" />
            DePIN Universe
          </div>
          <h2
            id="depin-heading"
            className="text-2xl md:text-3xl font-bold font-display"
            style={{ color: "var(--text-primary)" }}
          >
            Infraestructura Física Descentralizada
          </h2>
          <p
            className="mt-2 text-sm max-w-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            Redes que convierten hardware real — GPUs, ancho de banda,
            almacenamiento — en activos crypto productivos.
          </p>
        </div>
        <a
          href="https://iex.ec/depin/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full transition-all"
          style={{
            background: "rgba(34,233,122,0.08)",
            border: "1px solid rgba(34,233,122,0.2)",
            color: "#22E97A",
          }}
        >
          Ver mapa DePIN <ExternalLink size={12} />
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {DEPIN_TOKENS.map((token, i) => (
          <button
            key={token.symbol}
            type="button"
            onClick={() => onNavigateToToken(token.symbol)}
            className="group text-left rounded-[14px] p-3.5 transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "var(--glass-bg)",
              border: `1px solid ${token.color}22`,
              backdropFilter: "blur(12px)",
              boxShadow: "var(--card-shadow)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                `${token.color}55`;
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `0 0 20px ${token.color}22`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                `${token.color}22`;
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "var(--card-shadow)";
            }}
            data-ocid={`depin.item.${i + 1}`}
            aria-label={`Ver detalles de ${token.name}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <img
                src={`${COINGECKO_BASE}/${LOGO_MAP[token.symbol] || ""}`}
                alt={token.symbol}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div>
                <div
                  className="text-xs font-bold font-mono"
                  style={{ color: token.color }}
                >
                  {token.symbol}
                </div>
                <div
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: `${token.color}18`,
                    color: token.color,
                  }}
                >
                  {token.category}
                </div>
              </div>
            </div>
            <div
              className="text-xs leading-snug line-clamp-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {token.description}
            </div>
            <div
              className="mt-2 flex items-center gap-1 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: token.color }}
            >
              Ver detalles →
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
