export type Network = "ICP" | "EVM" | "Solana" | "Cosmos";

export interface TokenMeta {
  symbol: string;
  name: string;
  color: string;
  network: Network;
  defaultPrice: number;
}

export const TOKEN_LIST: TokenMeta[] = [
  {
    symbol: "DCSS",
    name: "DCSS Token",
    color: "#FFD700",
    network: "ICP",
    defaultPrice: 0.085,
  },
  {
    symbol: "ICP",
    name: "Internet Computer",
    color: "#29ABE2",
    network: "ICP",
    defaultPrice: 12.45,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    color: "#627EEA",
    network: "EVM",
    defaultPrice: 3420.5,
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    color: "#F7931A",
    network: "EVM",
    defaultPrice: 67800.0,
  },
  {
    symbol: "SOL",
    name: "Solana",
    color: "#9945FF",
    network: "Solana",
    defaultPrice: 185.3,
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    color: "#E84142",
    network: "EVM",
    defaultPrice: 38.75,
  },
  {
    symbol: "NEAR",
    name: "NEAR Protocol",
    color: "#00C08B",
    network: "EVM",
    defaultPrice: 7.2,
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    color: "#12AAFF",
    network: "EVM",
    defaultPrice: 1.85,
  },
  {
    symbol: "BASE",
    name: "Base",
    color: "#0052FF",
    network: "EVM",
    defaultPrice: 0.95,
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    color: "#375BD2",
    network: "EVM",
    defaultPrice: 18.6,
  },
  {
    symbol: "DOT",
    name: "Polkadot",
    color: "#E6007A",
    network: "EVM",
    defaultPrice: 8.9,
  },
  {
    symbol: "ATOM",
    name: "Cosmos Hub",
    color: "#6F7390",
    network: "Cosmos",
    defaultPrice: 11.2,
  },
  {
    symbol: "DVPN",
    name: "Sentinel",
    color: "#4AB44A",
    network: "Cosmos",
    defaultPrice: 0.0042,
  },
  {
    symbol: "ZEC",
    name: "Zcash",
    color: "#ECB244",
    network: "EVM",
    defaultPrice: 28.5,
  },
  {
    symbol: "LTC",
    name: "Litecoin",
    color: "#A0A0A0",
    network: "EVM",
    defaultPrice: 92.0,
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    color: "#8247E5",
    network: "EVM",
    defaultPrice: 0.88,
  },
  {
    symbol: "OP",
    name: "Optimism",
    color: "#FF0420",
    network: "EVM",
    defaultPrice: 2.75,
  },
  {
    symbol: "FTM",
    name: "Fantom",
    color: "#1969FF",
    network: "EVM",
    defaultPrice: 0.72,
  },
  {
    symbol: "ALGO",
    name: "Algorand",
    color: "#3A3A3A",
    network: "EVM",
    defaultPrice: 0.18,
  },
  {
    symbol: "XRP",
    name: "XRP",
    color: "#00AAE4",
    network: "EVM",
    defaultPrice: 0.58,
  },
  {
    symbol: "ADA",
    name: "Cardano",
    color: "#0033AD",
    network: "EVM",
    defaultPrice: 0.45,
  },
  {
    symbol: "TRX",
    name: "TRON",
    color: "#FF0013",
    network: "EVM",
    defaultPrice: 0.13,
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    color: "#C2A633",
    network: "EVM",
    defaultPrice: 0.165,
  },
  {
    symbol: "SHIB",
    name: "Shiba Inu",
    color: "#FFA409",
    network: "EVM",
    defaultPrice: 0.0000245,
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    color: "#FF007A",
    network: "EVM",
    defaultPrice: 10.3,
  },
  {
    symbol: "AAVE",
    name: "Aave",
    color: "#B6509E",
    network: "EVM",
    defaultPrice: 285.0,
  },
  {
    symbol: "CRV",
    name: "Curve DAO",
    color: "#3966CC",
    network: "EVM",
    defaultPrice: 0.52,
  },
  {
    symbol: "MKR",
    name: "Maker",
    color: "#1AAB9B",
    network: "EVM",
    defaultPrice: 2850.0,
  },
  {
    symbol: "SNX",
    name: "Synthetix",
    color: "#00D1FF",
    network: "EVM",
    defaultPrice: 2.85,
  },
  {
    symbol: "COMP",
    name: "Compound",
    color: "#00D395",
    network: "EVM",
    defaultPrice: 62.5,
  },
  {
    symbol: "YFI",
    name: "Yearn Finance",
    color: "#006AE3",
    network: "EVM",
    defaultPrice: 7200.0,
  },
  {
    symbol: "SUSHI",
    name: "SushiSwap",
    color: "#FA52A0",
    network: "EVM",
    defaultPrice: 1.45,
  },
  {
    symbol: "BAL",
    name: "Balancer",
    color: "#7B7B7B",
    network: "EVM",
    defaultPrice: 3.8,
  },
  {
    symbol: "1INCH",
    name: "1inch",
    color: "#D82122",
    network: "EVM",
    defaultPrice: 0.42,
  },
  {
    symbol: "INJ",
    name: "Injective",
    color: "#00F2FE",
    network: "Cosmos",
    defaultPrice: 28.5,
  },
  {
    symbol: "RUNE",
    name: "THORChain",
    color: "#33FF99",
    network: "Cosmos",
    defaultPrice: 5.8,
  },
  {
    symbol: "OSMO",
    name: "Osmosis",
    color: "#750BBB",
    network: "Cosmos",
    defaultPrice: 0.85,
  },
  {
    symbol: "SCRT",
    name: "Secret Network",
    color: "#555555",
    network: "Cosmos",
    defaultPrice: 0.62,
  },
  {
    symbol: "JUNO",
    name: "Juno",
    color: "#F0827D",
    network: "Cosmos",
    defaultPrice: 0.45,
  },
  {
    symbol: "STARS",
    name: "Stargaze",
    color: "#DB2777",
    network: "Cosmos",
    defaultPrice: 0.018,
  },
];

export const WALLETS_BY_NETWORK: Record<string, string[]> = {
  ICP: ["Internet Identity", "Plug", "Oisy"],
  EVM: ["MetaMask", "Coinbase Wallet", "WalletConnect", "Binance"],
  Solana: ["Phantom", "Backpack"],
  Cosmos: ["Keplr"],
};

export const NETWORK_PRIMARY_TOKENS: Record<string, string[]> = {
  ICP: ["DCSS", "ICP"],
  EVM: ["ETH", "BTC", "LINK", "UNI", "AAVE", "MATIC", "ARB"],
  Solana: ["SOL"],
  Cosmos: ["ATOM", "OSMO", "JUNO", "INJ", "RUNE"],
};

export function getTokenMeta(symbol: string): TokenMeta | undefined {
  return TOKEN_LIST.find((t) => t.symbol === symbol);
}

export function getTextColorForBg(hexColor: string): string {
  const r = Number.parseInt(hexColor.slice(1, 3), 16);
  const g = Number.parseInt(hexColor.slice(3, 5), 16);
  const b = Number.parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.45 ? "#000000" : "#ffffff";
}

export function formatPrice(price: number): string {
  if (price >= 1000)
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(3)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  return `$${price.toExponential(3)}`;
}

export function formatBalance(balance: number): string {
  if (balance === 0) return "0";
  if (balance >= 1000)
    return balance.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (balance >= 1) return balance.toFixed(4);
  return balance.toFixed(6);
}

export function truncateAddr(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}
