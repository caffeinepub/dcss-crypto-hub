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

interface WalletConnectModalProps {
  open: boolean;
  onClose: () => void;
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
      id: "EVM",
      label: "EVM",
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
  ];

const WALLET_COLORS: Record<string, string> = {
  "Internet Identity": "#29ABE2",
  Plug: "#8247E5",
  Oisy: "#22E97A",
  MetaMask: "#F6851B",
  "Coinbase Wallet": "#0052FF",
  WalletConnect: "#3B99FC",
  Binance: "#F0B90B",
  Phantom: "#AB9FF2",
  Backpack: "#E33E3F",
  Keplr: "#5C8BEB",
};

const ALL_WALLETS = Object.values(WALLETS_BY_NETWORK).flat();

export default function WalletConnectModal({
  open,
  onClose,
}: WalletConnectModalProps) {
  const { connectWallet, connectedWallets } = useWallet();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);

  function handleNetworkSelect(network: Network) {
    setSelectedNetwork(network);
    setStep(2);
  }

  async function handleWalletSelect(walletType: string) {
    if (!selectedNetwork) return;
    setConnecting(walletType);
    await new Promise((r) => setTimeout(r, 900));
    const wallet = connectWallet(selectedNetwork, walletType);
    setConnecting(null);
    toast.success(
      `Connected ${walletType} on ${selectedNetwork}: ${wallet.address.slice(0, 12)}...`,
    );
    setStep(1);
    onClose();
  }

  function handleClose() {
    setStep(1);
    setSelectedNetwork(null);
    onClose();
  }

  const activeWallets = new Set(connectedWallets.map((w) => w.walletType));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-md"
        style={{
          background: "#0B1110",
          border: "1px solid rgba(34,233,122,0.25)",
          boxShadow: "0 0 40px rgba(34,233,122,0.12)",
        }}
        data-ocid="wallet.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step === 2 && (
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
              {step === 1
                ? "Choose Network"
                : `Connect ${selectedNetwork} Wallet`}
            </DialogTitle>
          </div>
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
                      : "1px solid rgba(34,233,122,0.15)",
                    boxShadow: isConnected ? `0 0 14px ${net.color}33` : "none",
                  }}
                  data-ocid={`wallet.${net.id.toLowerCase()}.button`}
                >
                  {isConnected && (
                    <span
                      className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "#22E97A" }}
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
          <div className="space-y-2 mt-2">
            {WALLETS_BY_NETWORK[selectedNetwork]?.map((walletType) => {
              const isActive = activeWallets.has(walletType);
              const isConnecting = connecting === walletType;
              return (
                <button
                  type="button"
                  key={walletType}
                  onClick={() => handleWalletSelect(walletType)}
                  disabled={!!connecting}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl transition-all"
                  style={{
                    background: isActive
                      ? "rgba(34,233,122,0.08)"
                      : "rgba(15,21,19,0.8)",
                    border: isActive
                      ? "1px solid rgba(34,233,122,0.4)"
                      : "1px solid rgba(34,233,122,0.12)",
                    opacity: connecting && !isConnecting ? 0.5 : 1,
                  }}
                  data-ocid={`wallet.${walletType.toLowerCase().replace(/\s+/g, "_")}.button`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: `${WALLET_COLORS[walletType] ?? "#555"}22`,
                      color: WALLET_COLORS[walletType] ?? "#A9B3AF",
                      border: `1px solid ${WALLET_COLORS[walletType] ?? "#555"}44`,
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
                  {isActive && (
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(34,233,122,0.15)",
                        color: "#22E97A",
                      }}
                    >
                      Connected
                    </span>
                  )}
                  {isConnecting && (
                    <div
                      className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{
                        borderColor: "#22E97A",
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
          style={{ borderTop: "1px solid rgba(34,233,122,0.08)" }}
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
                    ? `1px solid ${WALLET_COLORS[w] ?? "#22E97A"}`
                    : "1px solid rgba(80,80,80,0.4)",
                  color: isActive ? (WALLET_COLORS[w] ?? "#22E97A") : "#555",
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
