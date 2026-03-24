import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface LocalTransaction {
  id: string;
  txType: string;
  tokenSymbol: string;
  amount: number;
  fromAddr: string;
  toAddr: string;
  network: string;
  walletAddr: string;
  timestamp: number;
  status: "confirmed" | "pending" | "failed";
}

export interface TransactionContextType {
  transactions: LocalTransaction[];
  addTransaction: (
    tx: Omit<LocalTransaction, "id" | "timestamp" | "status">,
  ) => void;
  clearTransactions: () => void;
}

const TxCtx = createContext<TransactionContextType | null>(null);

const SEED_TRANSACTIONS: LocalTransaction[] = [
  {
    id: "seed-1",
    txType: "Buy",
    tokenSymbol: "ICP",
    amount: 5.25,
    fromAddr: "0x1aac3f9e",
    toAddr: "rdmx6-jaaaa-aaaah-aabba-cai",
    network: "ICP",
    walletAddr: "rdmx6-jaaaa-aaaah-aabba-cai",
    timestamp: Date.now() - 1_200_000,
    status: "confirmed",
  },
  {
    id: "seed-2",
    txType: "Swap",
    tokenSymbol: "ETH",
    amount: 0.5,
    fromAddr: "0x1aac3f9e",
    toAddr: "0x1aac3f9e",
    network: "EVM",
    walletAddr: "0x1aac3f9e",
    timestamp: Date.now() - 7_200_000,
    status: "confirmed",
  },
  {
    id: "seed-3",
    txType: "Bridge",
    tokenSymbol: "SOL",
    amount: 2.0,
    fromAddr: "rdmx6-jaaaa-aaaah-aabba-cai",
    toAddr: "0x1aac3f9e",
    network: "Solana",
    walletAddr: "ABcD1234XYZ",
    timestamp: Date.now() - 86_400_000,
    status: "confirmed",
  },
];

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] =
    useState<LocalTransaction[]>(SEED_TRANSACTIONS);

  const addTransaction = useCallback(
    (tx: Omit<LocalTransaction, "id" | "timestamp" | "status">) => {
      const newTx: LocalTransaction = {
        ...tx,
        id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        status: "confirmed",
      };
      setTransactions((prev) => [newTx, ...prev]);
    },
    [],
  );

  const clearTransactions = useCallback(() => setTransactions([]), []);

  const value = useMemo(
    () => ({ transactions, addTransaction, clearTransactions }),
    [transactions, addTransaction, clearTransactions],
  );

  return <TxCtx.Provider value={value}>{children}</TxCtx.Provider>;
}

export function useTransactions(): TransactionContextType {
  const ctx = useContext(TxCtx);
  if (!ctx)
    throw new Error("useTransactions must be used within TransactionProvider");
  return ctx;
}
