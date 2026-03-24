import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SKELETON_KEYS, useTokens } from "../contexts/TokenContext";
import TokenCard from "./TokenCard";

interface TokenGridProps {
  showSearch?: boolean;
  maxItems?: number;
}

const NETWORKS = ["All", "ICP", "EVM", "Solana", "Cosmos"] as const;

export default function TokenGrid({
  showSearch = false,
  maxItems,
}: TokenGridProps) {
  const { tokens } = useTokens();
  const [search, setSearch] = useState("");
  const [networkFilter, setNetworkFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    let list = tokens;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.symbol.toLowerCase().includes(q),
      );
    }
    if (networkFilter !== "All") {
      list = list.filter((t) => t.network === networkFilter);
    }
    return maxItems ? list.slice(0, maxItems) : list;
  }, [tokens, search, networkFilter, maxItems]);

  if (tokens.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SKELETON_KEYS.map((key) => (
          <Skeleton
            key={key}
            className="h-44 rounded-xl"
            style={{ background: "rgba(34,233,122,0.06)" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#A9B3AF" }}
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tokens..."
              className="pl-9 text-sm"
              style={{
                background: "#0F1513",
                border: "1px solid rgba(34,233,122,0.2)",
                color: "#E8ECEB",
              }}
              data-ocid="tokens.search_input"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {NETWORKS.map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setNetworkFilter(n)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background:
                    networkFilter === n
                      ? "rgba(34,233,122,0.18)"
                      : "rgba(15,21,19,0.8)",
                  border:
                    networkFilter === n
                      ? "1px solid rgba(34,233,122,0.5)"
                      : "1px solid rgba(34,233,122,0.12)",
                  color: networkFilter === n ? "#22E97A" : "#A9B3AF",
                }}
                data-ocid={`tokens.${n.toLowerCase()}.tab`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div
          className="py-16 text-center rounded-xl"
          style={{ border: "1px solid rgba(34,233,122,0.1)" }}
          data-ocid="tokens.empty_state"
        >
          <p style={{ color: "#A9B3AF" }}>
            No tokens found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((token, i) => (
            <TokenCard key={token.symbol} token={token} index={i} />
          ))}
        </div>
      )}

      {showSearch && (
        <p className="text-xs text-center" style={{ color: "#A9B3AF" }}>
          {filtered.length} of {tokens.length} tokens
        </p>
      )}
    </div>
  );
}
