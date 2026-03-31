import { Grid3X3, Image as ImageIcon, Layers } from "lucide-react";
import { useState } from "react";
import { useWallet } from "../contexts/WalletContext";

interface NFTItem {
  id: string;
  name: string;
  collection: string;
  image: string;
  chain: "ICP" | "ETH";
  tokenId: string;
}

// Simulated NFT data — real ICRC-7 / ERC-721 calls in Phase 2
const SAMPLE_NFTS: NFTItem[] = [
  {
    id: "1",
    name: "DCSS Genesis #001",
    collection: "DCSS Genesis",
    image: "https://picsum.photos/seed/dcss001/400/400",
    chain: "ICP",
    tokenId: "001",
  },
  {
    id: "2",
    name: "ICP Punk #4829",
    collection: "ICP Punks",
    image: "https://picsum.photos/seed/icppunk4829/400/400",
    chain: "ICP",
    tokenId: "4829",
  },
  {
    id: "3",
    name: "Motoko Ghost #77",
    collection: "Motoko Ghosts",
    image: "https://picsum.photos/seed/motoko77/400/400",
    chain: "ICP",
    tokenId: "77",
  },
  {
    id: "4",
    name: "CryptoPunk #9103",
    collection: "CryptoPunks",
    image: "https://picsum.photos/seed/punk9103/400/400",
    chain: "ETH",
    tokenId: "9103",
  },
  {
    id: "5",
    name: "Bored Ape #2241",
    collection: "BAYC",
    image: "https://picsum.photos/seed/bayc2241/400/400",
    chain: "ETH",
    tokenId: "2241",
  },
  {
    id: "6",
    name: "Azuki #8881",
    collection: "Azuki",
    image: "https://picsum.photos/seed/azuki8881/400/400",
    chain: "ETH",
    tokenId: "8881",
  },
];

const CHAIN_COLORS: Record<string, string> = { ICP: "#29ABE2", ETH: "#627EEA" };

export default function NFTViewer() {
  const { activeWallet } = useWallet();
  const [filter, setFilter] = useState<"all" | "ICP" | "ETH">("all");

  if (!activeWallet) {
    return (
      <section
        className="max-w-[1200px] mx-auto px-4 py-8"
        aria-labelledby="nft-heading"
      >
        <div
          className="rounded-[18px] p-8 text-center"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
          }}
          data-ocid="nft.empty_state"
        >
          <ImageIcon
            size={40}
            className="mx-auto mb-3"
            style={{ color: "var(--text-muted)" }}
          />
          <h3
            className="text-base font-semibold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Conecta tu wallet para ver tus NFTs
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Soporte para ICP (ICRC-7) y Ethereum (ERC-721 / ERC-1155)
          </p>
        </div>
      </section>
    );
  }

  const filtered =
    filter === "all"
      ? SAMPLE_NFTS
      : SAMPLE_NFTS.filter((n) => n.chain === filter);

  return (
    <section
      className="max-w-[1200px] mx-auto px-4 py-8"
      aria-labelledby="nft-heading"
    >
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Layers size={18} style={{ color: "var(--accent-color)" }} />
          <h2
            id="nft-heading"
            className="text-lg font-bold font-display"
            style={{ color: "var(--text-primary)" }}
          >
            NFTs
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-mono"
            style={{
              background: "rgba(34,233,122,0.1)",
              color: "var(--accent-color)",
            }}
          >
            {filtered.length} items
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(255,165,0,0.1)",
              color: "#FFA500",
              border: "1px solid rgba(255,165,0,0.2)",
            }}
          >
            Simulados — Fase 2: APIs reales
          </span>
        </div>
        <fieldset
          className="flex gap-1.5 border-0 p-0 m-0"
          aria-label="Filtrar NFTs por cadena"
        >
          {(["all", "ICP", "ETH"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{
                background:
                  filter === f ? "var(--accent-color)" : "var(--glass-bg)",
                color: filter === f ? "#070B0A" : "var(--text-secondary)",
                border: `1px solid ${filter === f ? "var(--accent-color)" : "var(--glass-border)"}`,
                fontWeight: filter === f ? 600 : 400,
              }}
              aria-pressed={filter === f}
              data-ocid={`nft.${f === "all" ? "tab" : f.toLowerCase()}.tab`}
            >
              {f === "all" ? "Todos" : f}
            </button>
          ))}
        </fieldset>
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-[18px] p-10 text-center"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
          }}
          data-ocid="nft.empty_state"
        >
          <Grid3X3
            size={32}
            className="mx-auto mb-3"
            style={{ color: "var(--text-muted)" }}
          />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No se encontraron NFTs en esta cadena.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((nft, i) => (
            <div
              key={nft.id}
              className="rounded-[14px] overflow-hidden group cursor-pointer transition-transform hover:scale-[1.03]"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--card-shadow)",
              }}
              data-ocid={`nft.item.${i + 1}`}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-2">
                <div
                  className="text-xs font-semibold truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {nft.name}
                </div>
                <div
                  className="text-[10px] truncate mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {nft.collection}
                </div>
                <div
                  className="text-[9px] px-1.5 py-0.5 rounded-full mt-1 inline-block"
                  style={{
                    background: `${CHAIN_COLORS[nft.chain]}18`,
                    color: CHAIN_COLORS[nft.chain],
                  }}
                >
                  {nft.chain}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
