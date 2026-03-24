import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  NETWORK_PRIMARY_TOKENS,
  type Network,
  TOKEN_LIST,
} from "../data/tokens";

export interface ConnectedWallet {
  network: Network;
  walletType: string;
  address: string;
}

export interface WalletContextType {
  connectedWallets: ConnectedWallet[];
  activeWallet: ConnectedWallet | null;
  setActiveWallet: Dispatch<SetStateAction<ConnectedWallet | null>>;
  connectWallet: (network: Network, walletType: string) => ConnectedWallet;
  disconnectWallet: (address: string) => void;
  getBalance: (network: Network, address: string, symbol: string) => number;
  setBalance: (
    network: Network,
    address: string,
    symbol: string,
    amount: number,
  ) => void;
}

const WalletCtx = createContext<WalletContextType | null>(null);

const HEX = "0123456789abcdef";
const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function rHex(len: number): string {
  return Array.from(
    { length: len },
    () => HEX[Math.floor(Math.random() * 16)],
  ).join("");
}

function rB58(len: number): string {
  return Array.from(
    { length: len },
    () => B58[Math.floor(Math.random() * 58)],
  ).join("");
}

function generateMockAddress(network: Network): string {
  switch (network) {
    case "ICP":
      return `rdmx6-jaaaa-aaaah-${rHex(6)}-cai`;
    case "EVM":
      return `0x${rHex(40)}`;
    case "Solana":
      return rB58(44);
    case "Cosmos":
      return `cosmos1${rB58(38)}`;
  }
}

function generateMockBalances(network: Network): Record<string, number> {
  const balances: Record<string, number> = {};
  const primary = NETWORK_PRIMARY_TOKENS[network] ?? [];
  for (const token of TOKEN_LIST) {
    if (primary.includes(token.symbol)) {
      balances[token.symbol] = Number.parseFloat(
        (Math.random() * 12 + 0.5).toFixed(6),
      );
    } else if (Math.random() > 0.72) {
      balances[token.symbol] = Number.parseFloat(
        (Math.random() * 0.8).toFixed(6),
      );
    }
  }
  return balances;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>(
    [],
  );
  const [activeWallet, setActiveWallet] = useState<ConnectedWallet | null>(
    null,
  );

  // Clear phantom balances on mount
  useEffect(() => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("dcss_")) keysToRemove.push(key);
    }
    for (const k of keysToRemove) localStorage.removeItem(k);
  }, []);

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
        localStorage.setItem(key, amount.toString());
      }
    },
    [],
  );

  const connectWallet = useCallback(
    (network: Network, walletType: string): ConnectedWallet => {
      const address = generateMockAddress(network);
      const wallet: ConnectedWallet = { network, walletType, address };
      const balances = generateMockBalances(network);
      for (const [symbol, amount] of Object.entries(balances)) {
        localStorage.setItem(
          `dcss_${network}_${address}_${symbol}`,
          amount.toString(),
        );
      }
      setConnectedWallets((prev) => {
        const filtered = prev.filter((w) => w.network !== network);
        return [...filtered, wallet];
      });
      setActiveWallet(wallet);
      return wallet;
    },
    [],
  );

  const disconnectWallet = useCallback((address: string): void => {
    setConnectedWallets((prev) => {
      const wallet = prev.find((w) => w.address === address);
      if (wallet) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(`dcss_${wallet.network}_${address}_`)) {
            keysToRemove.push(key);
          }
        }
        for (const k of keysToRemove) localStorage.removeItem(k);
      }
      return prev.filter((w) => w.address !== address);
    });
    setActiveWallet((prev) => (prev?.address === address ? null : prev));
  }, []);

  const value = useMemo(
    () => ({
      connectedWallets,
      activeWallet,
      setActiveWallet,
      connectWallet,
      disconnectWallet,
      getBalance,
      setBalance,
    }),
    [
      connectedWallets,
      activeWallet,
      connectWallet,
      disconnectWallet,
      getBalance,
      setBalance,
    ],
  );

  return <WalletCtx.Provider value={value}>{children}</WalletCtx.Provider>;
}

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletCtx);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
