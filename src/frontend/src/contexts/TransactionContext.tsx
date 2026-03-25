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

const NOW = Date.now();
const H = 3_600_000;

const SEED_TRANSACTIONS: LocalTransaction[] = [
  {
    id: "seed-1",
    txType: "Buy",
    tokenSymbol: "BTC",
    amount: 0.00312,
    fromAddr: "0xA3fC8B2d1E9a4C7b",
    toAddr: "0xA3fC8B2d1E9a4C7b",
    network: "EVM",
    walletAddr: "0xA3fC8B2d1E9a4C7b",
    timestamp: NOW - 0.5 * H,
    status: "confirmed",
  },
  {
    id: "seed-2",
    txType: "Swap",
    tokenSymbol: "ETH",
    amount: 0.45,
    fromAddr: "0xA3fC8B2d1E9a4C7b",
    toAddr: "0xA3fC8B2d1E9a4C7b",
    network: "EVM",
    walletAddr: "0xA3fC8B2d1E9a4C7b",
    timestamp: NOW - 1.2 * H,
    status: "confirmed",
  },
  {
    id: "seed-3",
    txType: "Send",
    tokenSymbol: "ICP",
    amount: 12.5,
    fromAddr: "rdmx6-jaaaa-aaaah-aabba-cai",
    toAddr: "qoctq-giaaa-aaaaa-aaaea-cai",
    network: "ICP",
    walletAddr: "rdmx6-jaaaa-aaaah-aabba-cai",
    timestamp: NOW - 2.8 * H,
    status: "confirmed",
  },
  {
    id: "seed-4",
    txType: "Receive",
    tokenSymbol: "SOL",
    amount: 3.75,
    fromAddr: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    toAddr: "ABcD1234XYZqrs789mnop",
    network: "Solana",
    walletAddr: "ABcD1234XYZqrs789mnop",
    timestamp: NOW - 4.5 * H,
    status: "confirmed",
  },
  {
    id: "seed-5",
    txType: "Bridge",
    tokenSymbol: "LINK",
    amount: 25.0,
    fromAddr: "0xA3fC8B2d1E9a4C7b",
    toAddr: "ABcD1234XYZqrs789mnop",
    network: "EVM",
    walletAddr: "0xA3fC8B2d1E9a4C7b",
    timestamp: NOW - 7 * H,
    status: "confirmed",
  },
  {
    id: "seed-6",
    txType: "Buy",
    tokenSymbol: "CLP",
    amount: 50000,
    fromAddr: "0xA3fC8B2d1E9a4C7b",
    toAddr: "rdmx6-jaaaa-aaaah-aabba-cai",
    network: "ICP",
    walletAddr: "rdmx6-jaaaa-aaaah-aabba-cai",
    timestamp: NOW - 10 * H,
    status: "confirmed",
  },
  {
    id: "seed-7",
    txType: "Swap",
    tokenSymbol: "ATOM",
    amount: 8.2,
    fromAddr: "cosmos1abc3de4fghij5klmno6pqrst",
    toAddr: "cosmos1abc3de4fghij5klmno6pqrst",
    network: "Cosmos",
    walletAddr: "cosmos1abc3de4fghij5klmno6pqrst",
    timestamp: NOW - 14 * H,
    status: "pending",
  },
  {
    id: "seed-8",
    txType: "Send",
    tokenSymbol: "ETH",
    amount: 0.12,
    fromAddr: "0xA3fC8B2d1E9a4C7b",
    toAddr: "0xD9E3f4A1B8c2e5F6",
    network: "EVM",
    walletAddr: "0xA3fC8B2d1E9a4C7b",
    timestamp: NOW - 18 * H,
    status: "confirmed",
  },
  {
    id: "seed-9",
    txType: "Buy",
    tokenSymbol: "ICP",
    amount: 22.0,
    fromAddr: "0xD9E3f4A1B8c2e5F6",
    toAddr: "rdmx6-jaaaa-aaaah-aabba-cai",
    network: "ICP",
    walletAddr: "rdmx6-jaaaa-aaaah-aabba-cai",
    timestamp: NOW - 24 * H,
    status: "confirmed",
  },
  {
    id: "seed-10",
    txType: "Bridge",
    tokenSymbol: "SOL",
    amount: 5.0,
    fromAddr: "ABcD1234XYZqrs789mnop",
    toAddr: "0xA3fC8B2d1E9a4C7b",
    network: "Solana",
    walletAddr: "ABcD1234XYZqrs789mnop",
    timestamp: NOW - 30 * H,
    status: "failed",
  },
  {
    id: "seed-11",
    txType: "Receive",
    tokenSymbol: "BTC",
    amount: 0.0055,
    fromAddr: "bc1qxy2kgdygjrsqtzq2n0yrf249x2dn5a9d89mvn5",
    toAddr: "0xA3fC8B2d1E9a4C7b",
    network: "EVM",
    walletAddr: "0xA3fC8B2d1E9a4C7b",
    timestamp: NOW - 36 * H,
    status: "confirmed",
  },
  {
    id: "seed-12",
    txType: "Sell",
    tokenSymbol: "RENDER",
    amount: 18.5,
    fromAddr: "ABcD1234XYZqrs789mnop",
    toAddr: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    network: "Solana",
    walletAddr: "ABcD1234XYZqrs789mnop",
    timestamp: NOW - 43 * H,
    status: "pending",
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
