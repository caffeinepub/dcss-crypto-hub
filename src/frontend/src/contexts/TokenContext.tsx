import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type Network, TOKEN_LIST, type TokenMeta } from "../data/tokens";
import { useTokenPrices } from "../hooks/useQueries";

export interface TokenWithMeta extends TokenMeta {
  id: bigint;
  price: number;
  change24h: number;
}

export interface TokenContextType {
  tokens: TokenWithMeta[];
  getToken: (symbol: string) => TokenWithMeta | undefined;
}

const TokenCtx = createContext<TokenContextType | null>(null);

const CHANGE_MAP: Record<string, number> = TOKEN_LIST.reduce(
  (acc, t) => {
    acc[t.symbol] = Number.parseFloat(((Math.random() - 0.5) * 10).toFixed(2));
    return acc;
  },
  {} as Record<string, number>,
);

const SKELETON_KEYS = Array.from({ length: 8 }, (_, i) => `skeleton-slot-${i}`);

export function TokenProvider({ children }: { children: ReactNode }) {
  const { data: backendTokens } = useTokenPrices();
  const [priceVariations, setPriceVariations] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const interval = setInterval(() => {
      setPriceVariations((prev) => {
        const next: Record<string, number> = {};
        for (const t of TOKEN_LIST) {
          const prevVar = prev[t.symbol] ?? 1;
          next[t.symbol] = prevVar * (1 + (Math.random() - 0.5) * 0.04);
        }
        return next;
      });
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  const tokens = useMemo<TokenWithMeta[]>(() => {
    return TOKEN_LIST.map((meta) => {
      const backend = backendTokens?.find((t) => t.symbol === meta.symbol);
      const basePrice =
        backend && backend.price > 0 ? backend.price : meta.defaultPrice;
      const variation = priceVariations[meta.symbol] ?? 1;
      return {
        ...meta,
        id: backend?.id ?? BigInt(0),
        price: basePrice * variation,
        change24h: CHANGE_MAP[meta.symbol] ?? 0,
        network: meta.network as Network,
      };
    });
  }, [backendTokens, priceVariations]);

  const getToken = useMemo(
    () =>
      (symbol: string): TokenWithMeta | undefined =>
        tokens.find((t) => t.symbol === symbol),
    [tokens],
  );

  const value = useMemo(() => ({ tokens, getToken }), [tokens, getToken]);

  return <TokenCtx.Provider value={value}>{children}</TokenCtx.Provider>;
}

export function useTokens(): TokenContextType {
  const ctx = useContext(TokenCtx);
  if (!ctx) throw new Error("useTokens must be used within TokenProvider");
  return ctx;
}

export { SKELETON_KEYS };
