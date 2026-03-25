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
import {
  WALLET_INSTALL_URLS,
  connectArConnect,
  connectAuro,
  connectBackpack,
  connectBinance,
  connectCosmos,
  connectEVM,
  connectEternl,
  connectInternetIdentity,
  connectLeap,
  connectNami,
  connectOKX,
  connectPlug,
  connectPolkadotWallet,
  connectSolana,
  connectSolflare,
  connectUnisat,
  connectXverse,
  getEVMBalance,
  isArConnectAvailable,
  isAuroAvailable,
  isBackpackAvailable,
  isBinanceAvailable,
  isEVMAvailable,
  isEternlAvailable,
  isKeplrAvailable,
  isKuCoinAvailable,
  isLeapAvailable,
  isNamiAvailable,
  isOKXAvailable,
  isPhantomAvailable,
  isPlugAvailable,
  isRabbyAvailable,
  isRainbowAvailable,
  isSolanaAvailable,
  isSolflareAvailable,
  isSubWalletAvailable,
  isTalismanAvailable,
  isTrustWalletAvailable,
  isUnisatAvailable,
  isWalletEVMAvailable,
  isXverseAvailable,
} from "../hooks/useRealWallet";

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
  ) => Promise<ConnectedWallet & { redirected?: boolean }>;
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

function openInstallUrl(walletType: string) {
  const url = WALLET_INSTALL_URLS[walletType];
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

const EVM_NETWORKS: Network[] = [
  "Ethereum",
  "Arbitrum",
  "Base",
  "Multichain",
  "Avalanche",
  "Stablecoins",
  "0G",
];

async function connectEVMWallet(
  walletType: string,
  network: Network,
): Promise<{ address: string; isReal: boolean; evmBalanceFetched: boolean }> {
  const r = await connectEVM(walletType);
  if (!r.isReal)
    return { address: "", isReal: false, evmBalanceFetched: false };
  let evmBalanceFetched = false;
  try {
    const bal = await getEVMBalance(r.address, walletType);
    // Always store balance — even 0 is a valid real balance
    localStorage.setItem(`dcss_${network}_${r.address}_ETH`, bal.toFixed(6));
    evmBalanceFetched = true;
  } catch {
    /* ignore */
  }
  return { address: r.address, isReal: true, evmBalanceFetched };
}

async function fetchCosmosBalance(address: string): Promise<void> {
  // Ordered by reliability — publicnode and cosmos.directory have better CORS
  const endpoints = [
    `https://cosmos-rest.publicnode.com/cosmos/bank/v1beta1/balances/${address}`,
    `https://rest.cosmos.directory/cosmoshub/cosmos/bank/v1beta1/balances/${address}`,
    `https://api.cosmos.network/cosmos/bank/v1beta1/balances/${address}`,
  ];
  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const uatom = data?.balances?.find(
        (b: { denom: string; amount: string }) => b.denom === "uatom",
      );
      if (uatom) {
        const atom = Number.parseFloat(uatom.amount) / 1_000_000;
        // Store real balance — including 0 (wallet has no ATOM)
        localStorage.setItem(`dcss_Cosmos_${address}_ATOM`, atom.toFixed(6));
        return;
      }
    } catch {
      /* try next endpoint */
    }
  }
}

async function fetchSolanaBalance(address: string): Promise<void> {
  // Multiple endpoints ordered by CORS/rate-limit reliability
  const endpoints = [
    "https://solana-mainnet.g.alchemy.com/v2/demo",
    "https://rpc.ankr.com/solana",
    "https://api.mainnet-beta.solana.com",
  ];
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [address],
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const lamports = data?.result?.value;
      if (typeof lamports === "number") {
        const sol = lamports / 1_000_000_000;
        // Always store — 0 is a valid real balance
        localStorage.setItem(`dcss_Solana_${address}_SOL`, sol.toFixed(6));
        return; // success — stop trying more endpoints
      }
    } catch {
      /* try next endpoint */
    }
  }
}

async function fetchDotBalance(address: string): Promise<void> {
  try {
    const res = await fetch(
      "https://polkadot.api.subscan.io/api/v2/scan/search",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: address }),
      },
    );
    if (!res.ok) return;
    const data = await res.json();
    const planck = data?.data?.account?.balance;
    if (planck) {
      const dot = Number.parseFloat(planck);
      if (dot > 0)
        localStorage.setItem(`dcss_Polkadot_${address}_DOT`, dot.toFixed(6));
    }
  } catch {
    /* ignore */
  }
}

async function fetchBtcBalance(address: string): Promise<void> {
  try {
    const res = await fetch(`https://mempool.space/api/address/${address}`);
    if (!res.ok) return;
    const data = await res.json();
    const sats =
      (data?.chain_stats?.funded_txo_sum ?? 0) -
      (data?.chain_stats?.spent_txo_sum ?? 0);
    const btc = sats / 100_000_000;
    if (btc > 0)
      localStorage.setItem(`dcss_Bitcoin_${address}_BTC`, btc.toFixed(8));
  } catch {
    /* ignore */
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

  // NOTE: No localStorage wipe on mount — balances persist across page refreshes.

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
      if (amount <= 0) localStorage.removeItem(key);
      else localStorage.setItem(key, amount.toString());
      bumpTick();
    },
    [bumpTick],
  );

  const connectWallet = useCallback(
    async (
      network: Network,
      walletType: string,
    ): Promise<ConnectedWallet & { redirected?: boolean }> => {
      let address = "";
      let isReal = false;
      let redirected = false;
      let _evmBalanceFetched = false;

      switch (walletType) {
        // ── ICP
        case "Internet Identity": {
          const r = await connectInternetIdentity();
          if (r.isReal) {
            address = r.address;
            isReal = true;
          }
          break;
        }
        case "Plug": {
          if (isPlugAvailable()) {
            const r = await connectPlug();
            if (r.isReal) {
              address = r.address;
              isReal = true;
            }
          } else {
            openInstallUrl("Plug");
            redirected = true;
          }
          break;
        }
        case "Oisy": {
          openInstallUrl("Oisy");
          redirected = true;
          break;
        }
        // ── EVM — per-wallet provider
        case "MetaMask":
        case "Rabby":
        case "Coinbase Wallet":
        case "Trust Wallet":
        case "Rainbow":
        case "Core Wallet": {
          if (isWalletEVMAvailable(walletType)) {
            const r = await connectEVMWallet(walletType, network);
            if (r.isReal) {
              address = r.address;
              isReal = true;
              _evmBalanceFetched = r.evmBalanceFetched;
              bumpTick();
            }
          } else {
            openInstallUrl(walletType);
            redirected = true;
          }
          break;
        }
        case "KuCoin Web3": {
          if (isKuCoinAvailable()) {
            const r = await connectEVMWallet("KuCoin Web3", network);
            if (r.isReal) {
              address = r.address;
              isReal = true;
              _evmBalanceFetched = r.evmBalanceFetched;
              bumpTick();
            }
          } else {
            openInstallUrl("KuCoin Web3");
            redirected = true;
          }
          break;
        }
        case "Binance Web3": {
          // Only use BinanceChain if it's genuinely Binance (isBinance === true)
          if (
            isBinanceAvailable() &&
            (window.BinanceChain as any)?.isBinance === true
          ) {
            try {
              const accts = (await window.BinanceChain!.request({
                method: "eth_requestAccounts",
              })) as string[];
              if (accts?.[0]) {
                address = accts[0];
                isReal = true;
                bumpTick();
              }
            } catch {
              /* fall through */
            }
          }
          if (!address) {
            // Try via EVM provider tagged as Binance
            if (isWalletEVMAvailable("Binance Web3")) {
              const r = await connectEVMWallet("Binance Web3", network);
              if (r.isReal) {
                address = r.address;
                isReal = true;
                _evmBalanceFetched = r.evmBalanceFetched;
                bumpTick();
              }
            }
          }
          if (!address && !redirected) {
            openInstallUrl("Binance Web3");
            redirected = true;
          }
          break;
        }
        case "WalletConnect": {
          openInstallUrl("WalletConnect");
          redirected = true;
          break;
        }
        // ── Solana
        case "Phantom": {
          if (isPhantomAvailable()) {
            const r = await connectSolana();
            if (r.isReal) {
              address = r.address;
              isReal = true;
              // Use try/finally to guarantee bumpTick fires even if fetch fails
              (async () => {
                try {
                  await fetchSolanaBalance(r.address);
                } finally {
                  bumpTick();
                }
              })();
            }
          } else {
            openInstallUrl("Phantom");
            redirected = true;
          }
          break;
        }
        case "Solflare": {
          if (isSolflareAvailable()) {
            const r = await connectSolflare();
            if (r.isReal) {
              address = r.address;
              isReal = true;
              (async () => {
                try {
                  await fetchSolanaBalance(r.address);
                } finally {
                  bumpTick();
                }
              })();
            }
          } else {
            openInstallUrl("Solflare");
            redirected = true;
          }
          break;
        }
        case "Backpack": {
          if (isBackpackAvailable()) {
            const r = await connectBackpack();
            if (r.isReal) {
              address = r.address;
              isReal = true;
              (async () => {
                try {
                  await fetchSolanaBalance(r.address);
                } finally {
                  bumpTick();
                }
              })();
            }
          } else {
            openInstallUrl("Backpack");
            redirected = true;
          }
          break;
        }
        // ── Cosmos
        case "Keplr": {
          if (isKeplrAvailable()) {
            const chainId = network === "Celestia" ? "celestia" : "cosmoshub-4";
            const r = await connectCosmos(chainId);
            if (r.isReal) {
              address = r.address;
              isReal = true;
              if (network !== "Celestia") {
                (async () => {
                  try {
                    await fetchCosmosBalance(r.address);
                  } finally {
                    bumpTick();
                  }
                })();
              }
            }
          } else {
            openInstallUrl("Keplr");
            redirected = true;
          }
          break;
        }
        case "Leap": {
          if (isLeapAvailable()) {
            const chainId = network === "Celestia" ? "celestia" : "cosmoshub-4";
            const r = await connectLeap(chainId);
            if (r.isReal) {
              address = r.address;
              isReal = true;
              if (network !== "Celestia") {
                (async () => {
                  try {
                    await fetchCosmosBalance(r.address);
                  } finally {
                    bumpTick();
                  }
                })();
              }
            }
          } else {
            openInstallUrl("Leap");
            redirected = true;
          }
          break;
        }
        // ── Polkadot
        case "Nova": {
          openInstallUrl("Nova");
          redirected = true;
          break;
        }
        case "Talisman": {
          if (isTalismanAvailable()) {
            const r = await connectPolkadotWallet("talisman-polkadot");
            if (r.isReal) {
              address = r.address;
              isReal = true;
              (async () => {
                try {
                  await fetchDotBalance(r.address);
                } finally {
                  bumpTick();
                }
              })();
            }
          } else {
            openInstallUrl("Talisman");
            redirected = true;
          }
          break;
        }
        case "SubWallet": {
          if (isSubWalletAvailable()) {
            const r = await connectPolkadotWallet("subwallet-js");
            if (r.isReal) {
              address = r.address;
              isReal = true;
              (async () => {
                try {
                  await fetchDotBalance(r.address);
                } finally {
                  bumpTick();
                }
              })();
            }
          } else {
            openInstallUrl("SubWallet");
            redirected = true;
          }
          break;
        }
        // ── Bitcoin
        case "Unisat": {
          if (isUnisatAvailable()) {
            const r = await connectUnisat();
            if (r.isReal) {
              address = r.address;
              isReal = true;
              (async () => {
                try {
                  await fetchBtcBalance(r.address);
                } finally {
                  bumpTick();
                }
              })();
            }
          } else {
            openInstallUrl("Unisat");
            redirected = true;
          }
          break;
        }
        case "Xverse": {
          if (isXverseAvailable()) {
            const r = await connectXverse();
            if (r.isReal) {
              address = r.address;
              isReal = true;
              (async () => {
                try {
                  await fetchBtcBalance(r.address);
                } finally {
                  bumpTick();
                }
              })();
            }
          } else {
            openInstallUrl("Xverse");
            redirected = true;
          }
          break;
        }
        case "OKX": {
          if (isOKXAvailable()) {
            const r = await connectOKX();
            if (r.isReal) {
              address = r.address;
              isReal = true;
              (async () => {
                try {
                  await fetchBtcBalance(r.address);
                } finally {
                  bumpTick();
                }
              })();
            }
          } else {
            openInstallUrl("OKX");
            redirected = true;
          }
          break;
        }
        // ── Other chains
        case "ArConnect": {
          if (isArConnectAvailable()) {
            const r = await connectArConnect();
            if (r.isReal) {
              address = r.address;
              isReal = true;
            }
          } else {
            openInstallUrl("ArConnect");
            redirected = true;
          }
          break;
        }
        case "Auro Wallet": {
          if (isAuroAvailable()) {
            const r = await connectAuro();
            if (r.isReal) {
              address = r.address;
              isReal = true;
            }
          } else {
            openInstallUrl("Auro Wallet");
            redirected = true;
          }
          break;
        }
        case "Nami": {
          if (isNamiAvailable()) {
            const r = await connectNami();
            if (r.isReal) {
              address = r.address;
              isReal = true;
            }
          } else {
            openInstallUrl("Nami");
            redirected = true;
          }
          break;
        }
        case "Eternl": {
          if (isEternlAvailable()) {
            const r = await connectEternl();
            if (r.isReal) {
              address = r.address;
              isReal = true;
            }
          } else {
            openInstallUrl("Eternl");
            redirected = true;
          }
          break;
        }
        case "NEAR Wallet":
        case "Meteor": {
          openInstallUrl(walletType);
          redirected = true;
          break;
        }
        default: {
          if (EVM_NETWORKS.includes(network) && isEVMAvailable()) {
            const r = await connectEVM();
            if (r.isReal) {
              address = r.address;
              isReal = true;
              bumpTick();
            }
          }
        }
      }

      // If no real address was obtained, connection failed — do not fake connect
      if (!address) {
        return { network, walletType, address: "", isReal: false, redirected };
      }

      const wallet: ConnectedWallet & { redirected?: boolean } = {
        network,
        walletType,
        address,
        isReal,
        redirected,
      };

      setConnectedWallets((prev) => {
        const filtered = prev.filter((w) => w.network !== network);
        return [...filtered, { network, walletType, address, isReal }];
      });
      setActiveWallet({ network, walletType, address, isReal });
      return wallet;
    },
    [bumpTick],
  );

  const disconnectWallet = useCallback(
    (address: string): void => {
      setConnectedWallets((prev) => {
        const wallet = prev.find((w) => w.address === address);
        if (wallet) {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(`dcss_${wallet.network}_${address}_`))
              keysToRemove.push(key);
          }
          for (const k of keysToRemove) localStorage.removeItem(k);
        }
        return prev.filter((w) => w.address !== address);
      });
      setActiveWallet((prev) => (prev?.address === address ? null : prev));
      bumpTick();
    },
    [bumpTick],
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
    ],
  );

  return <WalletCtx.Provider value={value}>{children}</WalletCtx.Provider>;
}

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletCtx);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
