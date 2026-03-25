import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useWallet } from "../contexts/WalletContext";
import { type Network, WALLETS_BY_NETWORK } from "../data/tokens";
import { getWalletBadge, isWalletLive } from "../hooks/useRealWallet";

interface WalletConnectModalProps {
  open: boolean;
  onClose: () => void;
  preselectedNetwork?: Network;
}

const NETWORKS: { id: Network; label: string; desc: string; color: string }[] =
  [
    {
      id: "ICP",
      label: "ICP",
      desc: "Internet Computer Protocol",
      color: "#29ABE2",
    },
    {
      id: "Ethereum",
      label: "Ethereum",
      desc: "Ethereum, Arbitrum, Base",
      color: "#627EEA",
    },
    {
      id: "Solana",
      label: "Solana",
      desc: "Solana ecosystem",
      color: "#9945FF",
    },
    {
      id: "Cosmos",
      label: "Cosmos",
      desc: "IBC-connected chains",
      color: "#6F7390",
    },
    { id: "Bitcoin", label: "Bitcoin", desc: "Bitcoin L0", color: "#F7931A" },
    {
      id: "Polkadot",
      label: "Polkadot",
      desc: "Relay chain + parachains",
      color: "#E6007A",
    },
  ];

const WALLET_COLORS: Record<string, string> = {
  "Internet Identity": "#29ABE2",
  Plug: "#8247E5",
  Oisy: "#00D4B8",
  MetaMask: "#F6851B",
  "Coinbase Wallet": "#0052FF",
  WalletConnect: "#3B99FC",
  "Binance Web3": "#F0B90B",
  Phantom: "#AB9FF2",
  Backpack: "#E33E3F",
  Solflare: "#FC8C0C",
  Keplr: "#5C8BEB",
  Leap: "#8B5CF6",
  Nova: "#E6007A",
  Talisman: "#D4FF00",
  SubWallet: "#00B7FF",
  Unisat: "#F7931A",
  Xverse: "#6C52E7",
  OKX: "#AAAAAA",
  ArConnect: "#FF6B35",
  "Auro Wallet": "#594AF1",
  Nami: "#349EA3",
  Eternl: "#1877F2",
  "NEAR Wallet": "#00EC97",
  Meteor: "#9B59B6",
  "Core Wallet": "#E84142",
  "KuCoin Web3": "#2DCC8F",
  Rabby: "#7B68EE",
  "Trust Wallet": "#3375BB",
  Rainbow: "#FF6B6B",
};

const ALL_WALLETS = [
  "Internet Identity",
  "Plug",
  "Oisy",
  "MetaMask",
  "Rabby",
  "Coinbase Wallet",
  "Trust Wallet",
  "Rainbow",
  "KuCoin Web3",
  "Binance Web3",
  "WalletConnect",
  "OKX",
  "Phantom",
  "Solflare",
  "Backpack",
  "Keplr",
  "Leap",
  "Unisat",
  "Xverse",
  "Nova",
  "Talisman",
  "SubWallet",
  "ArConnect",
  "Auro Wallet",
  "Nami",
  "Eternl",
  "Core Wallet",
  "NEAR Wallet",
  "Meteor",
];

function getNetworkLiveStatus(network: Network | null): boolean {
  if (!network) return false;
  const wallets = WALLETS_BY_NETWORK[network] ?? [];
  return wallets.some((w) => isWalletLive(w));
}

export default function WalletConnectModal({
  open,
  onClose,
  preselectedNetwork,
}: WalletConnectModalProps) {
  const { connectWallet, connectedWallets } = useWallet();
  const [step, setStep] = useState<1 | 2>(() => (preselectedNetwork ? 2 : 1));
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(
    preselectedNetwork ?? null,
  );
  const [connecting, setConnecting] = useState<string | null>(null);

  function handleNetworkSelect(network: Network) {
    setSelectedNetwork(network);
    setStep(2);
  }

  async function handleWalletSelect(walletType: string) {
    if (!selectedNetwork) return;
    setConnecting(walletType);
    const wallet = await connectWallet(selectedNetwork, walletType);
    setConnecting(null);

    // Redirected to install page or web app
    if ((wallet as any).redirected) {
      if (["Oisy", "Nova", "NEAR Wallet", "Meteor"].includes(walletType)) {
        toast.info(`Abriendo ${walletType} en nueva pestaña`);
      } else {
        toast.info(`Abre la extensión de ${walletType} en una nueva pestaña`, {
          description: "Instala la extensión y vuelve a conectar",
        });
      }
      setStep(1);
      onClose();
      return;
    }

    // No address returned — wallet not installed or user rejected
    if (!wallet.address) {
      toast.error("Wallet no encontrada — instala la extensión", {
        description: `${walletType} no está instalada o el usuario rechazó la conexión`,
      });
      return; // Don't close modal, let user try another wallet
    }

    if (wallet.isReal) {
      toast.success(
        `Conectado ${walletType}: ${wallet.address.slice(0, 10)}...`,
      );
    } else {
      toast.error(`No se pudo conectar ${walletType}`, {
        description: "Instala la extensión para conectarte",
      });
      return;
    }
    setStep(1);
    onClose();
  }

  function handleClose() {
    setStep(preselectedNetwork ? 2 : 1);
    setSelectedNetwork(preselectedNetwork ?? null);
    onClose();
  }

  const activeWallets = new Set(connectedWallets.map((w) => w.walletType));
  const networkIsLive = getNetworkLiveStatus(selectedNetwork);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-md"
        style={{
          background: "#0B1110",
          border: "1px solid rgba(0,212,184,0.25)",
          boxShadow: "0 0 40px rgba(0,212,184,0.12)",
        }}
        data-ocid="wallet.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step === 2 && !preselectedNetwork && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="p-1 rounded-md transition-colors"
                style={{ color: "#A9B3AF" }}
              >
                <ChevronLeft size={16} />
              </button>
            )}
            <DialogTitle style={{ color: "#E8ECEB" }}>
              {step === 1 ? "Elegir Red" : `Conectar ${selectedNetwork}`}
            </DialogTitle>
          </div>
          {step === 2 && selectedNetwork && (
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: networkIsLive
                    ? "rgba(0,212,184,0.15)"
                    : "rgba(100,100,100,0.15)",
                  color: networkIsLive ? "#00D4B8" : "#888",
                  border: `1px solid ${
                    networkIsLive
                      ? "rgba(0,212,184,0.3)"
                      : "rgba(100,100,100,0.3)"
                  }`,
                }}
              >
                {networkIsLive
                  ? "LIVE — Wallet detectada"
                  : "Instala una wallet para conectar"}
              </span>
            </div>
          )}
        </DialogHeader>

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {NETWORKS.map((net) => {
              const isConnected = connectedWallets.some(
                (w) => w.network === net.id,
              );
              return (
                <button
                  type="button"
                  key={net.id}
                  onClick={() => handleNetworkSelect(net.id)}
                  className="relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                  style={{
                    background: "rgba(15,21,19,0.8)",
                    border: isConnected
                      ? `1px solid ${net.color}`
                      : "1px solid rgba(0,212,184,0.15)",
                    boxShadow: isConnected ? `0 0 14px ${net.color}33` : "none",
                  }}
                  data-ocid={`wallet.${net.id.toLowerCase()}.button`}
                >
                  {isConnected && (
                    <span
                      className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "#00D4B8" }}
                    >
                      <Check size={10} color="#070B0A" />
                    </span>
                  )}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: `${net.color}22`, color: net.color }}
                  >
                    {net.label.slice(0, 3)}
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: "#E8ECEB" }}
                    >
                      {net.label}
                    </div>
                    <div className="text-[10px]" style={{ color: "#A9B3AF" }}>
                      {net.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && selectedNetwork && (
          <div className="space-y-2 mt-2 max-h-[60vh] overflow-y-auto pr-1">
            {(WALLETS_BY_NETWORK[selectedNetwork] ?? []).map((walletType) => {
              const isActive = activeWallets.has(walletType);
              const isConnecting = connecting === walletType;
              const badge = getWalletBadge(walletType);
              return (
                <button
                  type="button"
                  key={walletType}
                  onClick={() => handleWalletSelect(walletType)}
                  disabled={!!connecting}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl transition-all"
                  style={{
                    background: isActive
                      ? "rgba(0,212,184,0.08)"
                      : "rgba(15,21,19,0.8)",
                    border: isActive
                      ? "1px solid rgba(0,212,184,0.4)"
                      : "1px solid rgba(0,212,184,0.12)",
                    opacity: connecting && !isConnecting ? 0.5 : 1,
                  }}
                  data-ocid={`wallet.${walletType
                    .toLowerCase()
                    .replace(/\s+/g, "_")}.button`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: `${WALLET_COLORS[walletType] ?? "#555"}22`,
                      color: WALLET_COLORS[walletType] ?? "#A9B3AF",
                      border: `1px solid ${
                        WALLET_COLORS[walletType] ?? "#555"
                      }44`,
                    }}
                  >
                    {walletType.slice(0, 2).toUpperCase()}
                  </div>
                  <span
                    className="text-sm font-medium flex-1 text-left"
                    style={{ color: "#E8ECEB" }}
                  >
                    {walletType}
                  </span>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full mr-1"
                    style={{
                      background: badge.isLive
                        ? "rgba(0,212,184,0.12)"
                        : "rgba(80,80,80,0.2)",
                      color: badge.isLive ? "#00D4B8" : "#888",
                      border: `1px solid ${
                        badge.isLive
                          ? "rgba(0,212,184,0.25)"
                          : "rgba(80,80,80,0.3)"
                      }`,
                    }}
                  >
                    {badge.label}
                  </span>
                  {isActive && (
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(0,212,184,0.15)",
                        color: "#00D4B8",
                      }}
                    >
                      Conectado
                    </span>
                  )}
                  {isConnecting && (
                    <div
                      className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{
                        borderColor: "#00D4B8",
                        borderTopColor: "transparent",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div
          className="mt-4 pt-3 flex flex-wrap gap-2 justify-center"
          style={{ borderTop: "1px solid rgba(0,212,184,0.08)" }}
        >
          {ALL_WALLETS.map((w) => {
            const isActive = activeWallets.has(w);
            return (
              <div
                key={w}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold transition-all"
                title={w}
                style={{
                  background: isActive
                    ? `${WALLET_COLORS[w] ?? "#555"}33`
                    : "rgba(34,34,34,0.5)",
                  border: isActive
                    ? `1px solid ${WALLET_COLORS[w] ?? "#00D4B8"}`
                    : "1px solid rgba(80,80,80,0.4)",
                  color: isActive ? (WALLET_COLORS[w] ?? "#00D4B8") : "#555",
                  filter: isActive ? "none" : "grayscale(1)",
                }}
              >
                {w.slice(0, 2).toUpperCase()}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
