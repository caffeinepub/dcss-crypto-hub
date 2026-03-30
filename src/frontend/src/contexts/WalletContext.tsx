import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Network } from "../data/tokens";
import { connectInternetIdentity } from "../hooks/useRealWallet";

// ── WalletAdapter interface — add new wallets by implementing this ──
export interface WalletAdapter {
  id: string;
  label: string;
  isAvailable: () => boolean;
  connect: () => Promise<{ address: string; isReal: boolean }>;
  installUrl: string;
  edgeInstallUrl?: string;
  firefoxInstallUrl?: string;
  network?: Network;
}

// ── Browser detection ──
export type BrowserType =
  | "chrome"
  | "edge"
  | "firefox"
  | "safari"
  | "opera"
  | "brave"
  | "other";

export function detectBrowser(): BrowserType {
  if (typeof window === "undefined") return "other";
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "edge";
  if (ua.includes("OPR/") || ua.includes("Opera")) return "opera";
  if (ua.includes("Firefox/")) return "firefox";
  if (ua.includes("Safari/") && !ua.includes("Chrome")) return "safari";
  if ((navigator as unknown as Record<string, unknown>).brave) return "brave";
  if (ua.includes("Chrome/")) return "chrome";
  return "other";
}

// ── Keplr types ──
interface KeplrKey {
  bech32Address: string;
  name: string;
}
interface KeplrWindow {
  enable: (chainId: string) => Promise<void>;
  getKey: (chainId: string) => Promise<KeplrKey>;
}

// Internet Identity adapter
const iiAdapter: WalletAdapter = {
  id: "Internet Identity",
  label: "Internet Identity",
  network: "ICP",
  isAvailable: () => true,
  connect: () => connectInternetIdentity(),
  installUrl: "https://identity.ic0.app",
};

// Oisy adapter — opens oisy.com directly
const oisyAdapter: WalletAdapter = {
  id: "Oisy",
  label: "Oisy",
  network: "ICP",
  isAvailable: () => false, // always show as external link
  connect: async () => {
    window.open("https://oisy.com", "_blank");
    return { address: "", isReal: false };
  },
  installUrl: "https://oisy.com",
};

// Keplr adapter — Cosmos ecosystem wallet (Chrome + Edge)
const COSMOS_CHAIN_ID = "cosmoshub-4";

const keplrAdapter: WalletAdapter = {
  id: "Keplr",
  label: "Keplr",
  network: "Cosmos",
  isAvailable: () =>
    typeof window !== "undefined" &&
    !!(window as unknown as Record<string, unknown>).keplr,
  connect: async () => {
    try {
      const keplr = (window as unknown as Record<string, unknown>).keplr as
        | KeplrWindow
        | undefined;
      if (!keplr) return { address: "", isReal: false };

      // Request permission to access the chain
      await keplr.enable(COSMOS_CHAIN_ID);

      // Get the user's key/address for Cosmos Hub
      const key = await keplr.getKey(COSMOS_CHAIN_ID);
      if (!key?.bech32Address) return { address: "", isReal: false };

      return { address: key.bech32Address, isReal: true };
    } catch {
      return { address: "", isReal: false };
    }
  },
  // Available on Edge Add-ons store natively
  installUrl:
    "https://microsoftedge.microsoft.com/addons/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap",
  edgeInstallUrl:
    "https://microsoftedge.microsoft.com/addons/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap",
};

// ── EVM Adapters ──
const metaMaskAdapter: WalletAdapter = {
  id: "MetaMask",
  label: "MetaMask",
  network: "Ethereum",
  isAvailable: () =>
    typeof window !== "undefined" &&
    !!(
      (window as unknown as Record<string, unknown>).ethereum as
        | Record<string, unknown>
        | undefined
    )?.isMetaMask,
  connect: async () => {
    try {
      const eth = (window as unknown as Record<string, unknown>).ethereum as {
        request: (a: { method: string }) => Promise<unknown>;
      };
      const accounts = (await eth.request({
        method: "eth_requestAccounts",
      })) as string[];
      return { address: accounts[0] ?? "", isReal: true };
    } catch {
      return { address: "", isReal: false };
    }
  },
  installUrl: "https://metamask.io/download/",
};

const okxAdapter: WalletAdapter = {
  id: "OKX Wallet",
  label: "OKX Wallet",
  network: "Ethereum",
  isAvailable: () =>
    typeof window !== "undefined" &&
    !!(window as unknown as Record<string, unknown>).okxwallet,
  connect: async () => {
    try {
      const okx = (window as unknown as Record<string, unknown>).okxwallet as {
        request: (a: { method: string }) => Promise<unknown>;
      };
      const accounts = (await okx.request({
        method: "eth_requestAccounts",
      })) as string[];
      return { address: accounts[0] ?? "", isReal: true };
    } catch {
      return { address: "", isReal: false };
    }
  },
  installUrl: "https://www.okx.com/web3",
};

// ── Solana Adapters ──
const phantomAdapter: WalletAdapter = {
  id: "Phantom",
  label: "Phantom",
  network: "Solana",
  isAvailable: () => {
    if (typeof window === "undefined") return false;
    const w = window as unknown as Record<string, unknown>;
    return (
      !!(w.phantom as Record<string, unknown> | undefined)?.solana ||
      !!(w.solana as Record<string, unknown> | undefined)?.isPhantom
    );
  },
  connect: async () => {
    try {
      const w = window as unknown as Record<string, unknown>;
      const sol = ((w.phantom as Record<string, unknown>)?.solana ??
        w.solana) as {
        connect: (
          opts?: object,
        ) => Promise<{ publicKey: { toString(): string } }>;
      };
      await (sol as { disconnect?: () => Promise<void> }).disconnect?.();
      const res = await sol.connect({ onlyIfTrusted: false });
      return { address: res.publicKey.toString(), isReal: true };
    } catch {
      return { address: "", isReal: false };
    }
  },
  installUrl: "https://phantom.app/download",
};

const solflareAdapter: WalletAdapter = {
  id: "Solflare",
  label: "Solflare",
  network: "Solana",
  isAvailable: () =>
    typeof window !== "undefined" &&
    !!(window as unknown as Record<string, unknown>).solflare,
  connect: async () => {
    try {
      const sf = (window as unknown as Record<string, unknown>).solflare as {
        connect: () => Promise<void>;
        publicKey: { toString(): string };
        isConnected: boolean;
      };
      await sf.connect();
      return { address: sf.publicKey.toString(), isReal: true };
    } catch {
      return { address: "", isReal: false };
    }
  },
  installUrl: "https://solflare.com",
};

const backpackAdapter: WalletAdapter = {
  id: "Backpack",
  label: "Backpack",
  network: "Solana",
  isAvailable: () =>
    typeof window !== "undefined" &&
    !!(window as unknown as Record<string, unknown>).backpack,
  connect: async () => {
    try {
      const bp = (window as unknown as Record<string, unknown>).backpack as {
        connect: () => Promise<{ publicKey: { toString(): string } }>;
      };
      const res = await bp.connect();
      return { address: res.publicKey.toString(), isReal: true };
    } catch {
      return { address: "", isReal: false };
    }
  },
  installUrl: "https://backpack.app",
};

// ── Cosmos Adapters ──
const leapAdapter: WalletAdapter = {
  id: "Leap",
  label: "Leap",
  network: "Cosmos",
  isAvailable: () =>
    typeof window !== "undefined" &&
    !!(window as unknown as Record<string, unknown>).leap,
  connect: async () => {
    try {
      const leap = (window as unknown as Record<string, unknown>).leap as {
        enable: (id: string) => Promise<void>;
        getKey: (id: string) => Promise<{ bech32Address: string }>;
      };
      await leap.enable("cosmoshub-4");
      const key = await leap.getKey("cosmoshub-4");
      return { address: key.bech32Address, isReal: true };
    } catch {
      return { address: "", isReal: false };
    }
  },
  installUrl: "https://leapwallet.io",
};

// ── Bitcoin Adapters ──
const unisatAdapter: WalletAdapter = {
  id: "Unisat",
  label: "Unisat",
  network: "Bitcoin",
  isAvailable: () =>
    typeof window !== "undefined" &&
    !!(window as unknown as Record<string, unknown>).unisat,
  connect: async () => {
    try {
      const u = (window as unknown as Record<string, unknown>).unisat as {
        requestAccounts: () => Promise<string[]>;
      };
      const accounts = await u.requestAccounts();
      return { address: accounts[0] ?? "", isReal: true };
    } catch {
      return { address: "", isReal: false };
    }
  },
  installUrl: "https://unisat.io",
};

// ── Arweave Adapters ──
const arconnectAdapter: WalletAdapter = {
  id: "ArConnect",
  label: "ArConnect",
  network: "Arweave",
  isAvailable: () =>
    typeof window !== "undefined" &&
    !!(window as unknown as Record<string, unknown>).arweaveWallet,
  connect: async () => {
    try {
      const ar = (window as unknown as Record<string, unknown>)
        .arweaveWallet as {
        connect: (p: string[]) => Promise<void>;
        getActiveAddress: () => Promise<string>;
      };
      await ar.connect(["ACCESS_ADDRESS"]);
      const addr = await ar.getActiveAddress();
      return { address: addr, isReal: true };
    } catch {
      return { address: "", isReal: false };
    }
  },
  installUrl: "https://arconnect.io",
};

export const SUPPORTED_WALLETS: WalletAdapter[] = [
  iiAdapter,
  oisyAdapter,
  keplrAdapter,
  metaMaskAdapter,
  okxAdapter,
  phantomAdapter,
  solflareAdapter,
  backpackAdapter,
  leapAdapter,
  unisatAdapter,
  arconnectAdapter,
];

export interface ConnectedWallet {
  network: Network;
  walletType: string;
  address: string;
  isReal: boolean;
}

export interface WalletContextType {
  connectedWallets: ConnectedWallet[];
  activeWallet: ConnectedWallet | null;
  setActiveWallet: Dispatch<SetStateAction<ConnectedWallet | null>>;
  connectWallet: (
    network: Network,
    walletType: string,
  ) => Promise<
    ConnectedWallet & { redirected?: boolean; installNote?: string }
  >;
  disconnectWallet: (address: string) => void;
  getBalance: (network: Network, address: string, symbol: string) => number;
  setBalance: (
    network: Network,
    address: string,
    symbol: string,
    amount: number,
  ) => void;
  balanceTick: number;
  isEVMAvailable: () => boolean;
  isSolanaAvailable: () => boolean;
  isKeplrAvailable: () => boolean;
}

const WalletCtx = createContext<WalletContextType | null>(null);

// ── Keplr balance fetch (ATOM on Cosmos Hub) ──
async function tryFetchATOM(
  url: string,
): Promise<{ denom: string; amount: string }[] | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      balances?: { denom: string; amount: string }[];
    };
    return data.balances ?? null;
  } catch {
    return null;
  }
}

async function fetchKeplrATOMBalance(
  address: string,
  onBalance: (amount: number) => void,
) {
  const endpoints = [
    `https://api.cosmos.network/cosmos/bank/v1beta1/balances/${address}`,
    `https://rest.cosmos.directory/cosmoshub/cosmos/bank/v1beta1/balances/${address}`,
    `https://cosmoshub-api.lavenderfive.com/cosmos/bank/v1beta1/balances/${address}`,
  ];

  for (const url of endpoints) {
    const balances = await tryFetchATOM(url);
    if (!balances) continue;
    const uatom = balances.find((b) => b.denom === "uatom");
    if (uatom) {
      const atom = Number(uatom.amount) / 1_000_000;
      if (atom > 0) onBalance(atom);
    }
    return;
  }
}

// ── ICP balance fetch via Rosetta API ──
async function fetchICPBalanceRosetta(principal: string): Promise<number> {
  try {
    const res = await fetch(
      "https://rosetta-api.internetcomputer.org/account/balance",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network_identifier: {
            blockchain: "Internet Computer",
            network: "00000000000000020101",
          },
          account_identifier: { address: principal },
        }),
      },
    );
    if (!res.ok) return 0;
    const data = (await res.json()) as {
      balances?: { value: string }[];
    };
    const raw = data.balances?.[0]?.value;
    if (!raw) return 0;
    return Number(raw) / 1e8;
  } catch {
    return 0;
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>(
    [],
  );
  const [activeWallet, setActiveWallet] = useState<ConnectedWallet | null>(
    null,
  );
  const [balanceTick, setBalanceTick] = useState(0);

  const bumpTick = useCallback(() => setBalanceTick((t) => t + 1), []);

  const getBalance = useCallback(
    (network: Network, address: string, symbol: string): number => {
      return Number.parseFloat(
        localStorage.getItem(`dcss_${network}_${address}_${symbol}`) ?? "0",
      );
    },
    [],
  );

  const setBalance = useCallback(
    (
      network: Network,
      address: string,
      symbol: string,
      amount: number,
    ): void => {
      const key = `dcss_${network}_${address}_${symbol}`;
      if (amount <= 0) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, String(amount));
      }
      bumpTick();
    },
    [bumpTick],
  );

  const connectWallet = useCallback(
    async (
      _network: Network,
      walletType: string,
    ): Promise<
      ConnectedWallet & { redirected?: boolean; installNote?: string }
    > => {
      const adapter = SUPPORTED_WALLETS.find((w) => w.id === walletType);
      if (!adapter) {
        return {
          network: _network,
          walletType,
          address: "",
          isReal: false,
          redirected: false,
        };
      }

      // Oisy: open oisy.com and return immediately
      if (adapter.id === "Oisy") {
        await adapter.connect();
        return {
          network: adapter.network ?? _network,
          walletType,
          address: "",
          isReal: false,
          redirected: true,
          installNote: "Abriendo Oisy Wallet en una nueva pestaña...",
        };
      }

      // Not available — redirect to install
      if (!adapter.isAvailable()) {
        window.open(adapter.installUrl, "_blank");
        return {
          network: adapter.network ?? _network,
          walletType,
          address: "",
          isReal: false,
          redirected: true,
          installNote: `Instala ${walletType} y vuelve a conectar`,
        };
      }

      // Attempt real connection
      const result = await adapter.connect();
      if (!result.address || !result.isReal) {
        return {
          network: adapter.network ?? _network,
          walletType,
          address: result.address,
          isReal: false,
        };
      }

      const wallet: ConnectedWallet = {
        network: adapter.network ?? _network,
        walletType,
        address: result.address,
        isReal: result.isReal,
      };

      setConnectedWallets((prev) => {
        const exists = prev.find(
          (w) => w.address === wallet.address && w.walletType === walletType,
        );
        return exists ? prev : [...prev, wallet];
      });
      setActiveWallet(wallet);

      // Fetch balances after connecting
      if (walletType === "Internet Identity" || walletType === "Oisy") {
        // ICP balance fetch
        fetchICPBalanceRosetta(result.address).then((bal) => {
          if (bal > 0) {
            setBalance(wallet.network, wallet.address, "ICP", bal);
          }
        });
      } else if (walletType === "Keplr") {
        fetchKeplrATOMBalance(result.address, (atom) => {
          setBalance(wallet.network, wallet.address, "ATOM", atom);
        });
      }

      return wallet;
    },
    [setBalance],
  );

  const disconnectWallet = useCallback((address: string) => {
    setConnectedWallets((prev) => prev.filter((w) => w.address !== address));
    setActiveWallet((prev) => (prev?.address === address ? null : prev));
  }, []);

  const isEVMAvailable = useCallback(
    () =>
      typeof window !== "undefined" &&
      !!(window as unknown as Record<string, unknown>).ethereum,
    [],
  );

  const isSolanaAvailable = useCallback(
    () =>
      typeof window !== "undefined" &&
      !!(window as unknown as Record<string, unknown>).solana,
    [],
  );

  const isKeplrAvailable = useCallback(
    () =>
      typeof window !== "undefined" &&
      !!(window as unknown as Record<string, unknown>).keplr,
    [],
  );

  const value = useMemo(
    () => ({
      connectedWallets,
      activeWallet,
      setActiveWallet,
      connectWallet,
      disconnectWallet,
      getBalance,
      setBalance,
      balanceTick,
      isEVMAvailable,
      isSolanaAvailable,
      isKeplrAvailable,
    }),
    [
      connectedWallets,
      activeWallet,
      connectWallet,
      disconnectWallet,
      getBalance,
      setBalance,
      balanceTick,
      isEVMAvailable,
      isSolanaAvailable,
      isKeplrAvailable,
    ],
  );

  return <WalletCtx.Provider value={value}>{children}</WalletCtx.Provider>;
}

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletCtx);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
