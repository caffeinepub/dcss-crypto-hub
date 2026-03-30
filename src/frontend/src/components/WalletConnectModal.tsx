import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SUPPORTED_WALLETS, useWallet } from "../contexts/WalletContext";

interface WalletConnectModalProps {
  open: boolean;
  onClose: () => void;
}

const WALLET_GROUP: Record<string, string> = {
  "Internet Identity": "ICP",
  Oisy: "ICP",
  MetaMask: "EVM",
  Rabby: "EVM",
  "Coinbase Wallet": "EVM",
  "Trust Wallet": "EVM",
  "OKX Wallet": "EVM",
  "Binance Web3": "EVM",
  Phantom: "Solana",
  Solflare: "Solana",
  Backpack: "Solana",
  Keplr: "Cosmos",
  Leap: "Cosmos",
  Talisman: "Polkadot",
  SubWallet: "Polkadot",
  Unisat: "Bitcoin",
  Xverse: "Bitcoin",
  ArConnect: "Arweave",
  "NEAR Wallet": "NEAR",
};

const WALLET_DESC: Record<string, string> = {
  "Internet Identity": "Login sin seed phrase — nativo ICP",
  Oisy: "Wallet multi-chain nativa ICP — ICRC-25",
  MetaMask: "La wallet EVM más popular",
  Rabby: "Wallet EVM multi-chain, segura",
  "Coinbase Wallet": "Wallet de Coinbase — EVM",
  "Trust Wallet": "Wallet móvil multi-chain",
  "OKX Wallet": "Wallet OKX — EVM + BTC",
  "Binance Web3": "Wallet Web3 de Binance",
  Phantom: "La wallet líder de Solana",
  Solflare: "Wallet Solana con staking",
  Backpack: "Wallet xNFT de Solana",
  Keplr: "La wallet del ecosistema Cosmos",
  Leap: "Wallet Cosmos — ATOM, OSMO",
  Talisman: "Wallet Polkadot + EVM",
  SubWallet: "Wallet Polkadot / Substrate",
  Unisat: "Wallet Bitcoin + BRC-20",
  Xverse: "Wallet Bitcoin + Ordinals",
  ArConnect: "Wallet Arweave",
  "NEAR Wallet": "Wallet del ecosistema NEAR",
};

const GROUP_ORDER = [
  "ICP",
  "EVM",
  "Solana",
  "Cosmos",
  "Polkadot",
  "Bitcoin",
  "Arweave",
  "NEAR",
];

async function connectOisyICRC25(): Promise<{
  address: string;
  isReal: boolean;
}> {
  return new Promise((resolve, reject) => {
    const popup = window.open(
      "https://oisy.com/sign-in",
      "oisy_connect",
      "width=480,height=700,left=200,top=100",
    );
    if (!popup) {
      reject(new Error("Popup bloqueado. Permite popups para este sitio."));
      return;
    }
    const safePopup = popup;

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Oisy: tiempo de espera agotado (2 min)"));
    }, 120000);

    const checkClosed = setInterval(() => {
      if (safePopup.closed) {
        cleanup();
        reject(new Error("Oisy: popup cerrado por el usuario"));
      }
    }, 500);

    function cleanup() {
      clearTimeout(timer);
      clearInterval(checkClosed);
      window.removeEventListener("message", handler);
    }

    // Send permissions after popup loads
    setTimeout(() => {
      if (!safePopup.closed) {
        safePopup.postMessage(
          {
            jsonrpc: "2.0",
            id: 1,
            method: "icrc25_request_permissions",
            params: {
              scopes: [
                { method: "icrc27_accounts" },
                { method: "icrc49_call_canister" },
              ],
            },
          },
          "https://oisy.com",
        );
      }
    }, 2000);

    function handler(event: MessageEvent) {
      if (event.origin !== "https://oisy.com") return;
      const data = event.data as Record<string, unknown>;

      if (data?.method === "icrc29_ready") {
        safePopup.postMessage(
          {
            jsonrpc: "2.0",
            id: 1,
            method: "icrc25_request_permissions",
            params: {
              scopes: [
                { method: "icrc27_accounts" },
                { method: "icrc49_call_canister" },
              ],
            },
          },
          "https://oisy.com",
        );
      }

      if (data?.id === 1 && data?.result) {
        safePopup.postMessage(
          { jsonrpc: "2.0", id: 2, method: "icrc27_accounts", params: {} },
          "https://oisy.com",
        );
      }

      if (data?.id === 2) {
        const result = data?.result as Record<string, unknown> | undefined;
        const accounts = result?.accounts as { owner?: string }[] | undefined;
        cleanup();
        if (!safePopup.closed) safePopup.close();
        const principal = accounts?.[0]?.owner ?? "";
        if (principal) {
          resolve({ address: principal, isReal: true });
        } else {
          reject(new Error("Oisy no devolvió ninguna cuenta"));
        }
      }

      if (data?.error) {
        cleanup();
        if (!safePopup.closed) safePopup.close();
        const err = data.error as { message?: string };
        reject(new Error(err.message ?? "Oisy: conexión rechazada"));
      }
    }

    window.addEventListener("message", handler);
  });
}

export default function WalletConnectModal({
  open,
  onClose,
}: WalletConnectModalProps) {
  const { connectWallet, connectedWallets } = useWallet();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [wcProjectId, setWcProjectId] = useState(
    () => localStorage.getItem("wc_project_id") ?? "",
  );
  const [showWC, setShowWC] = useState(false);

  const connectedIds = new Set(connectedWallets.map((w) => w.walletType));

  const visibleWallets = SUPPORTED_WALLETS.filter((w) => {
    const matchesSearch = w.label.toLowerCase().includes(search.toLowerCase());
    // Always show ICP wallets; for others, only show if extension detected
    const group = WALLET_GROUP[w.id] ?? "Other";
    if (group === "ICP") return matchesSearch;
    return w.isAvailable() && matchesSearch;
  });

  const groups: Record<string, typeof SUPPORTED_WALLETS> = {};
  for (const w of visibleWallets) {
    const g = WALLET_GROUP[w.id] ?? "Other";
    if (!groups[g]) groups[g] = [];
    groups[g].push(w);
  }

  async function handleConnect(walletId: string) {
    setConnecting(walletId);
    try {
      if (walletId === "Oisy") {
        toast.info("Abriendo Oisy Wallet...", {
          description: "Aprueba los permisos en el popup",
        });
        const result = await connectOisyICRC25();
        if (result.address) {
          toast.success("Oisy conectado");
          // Manually add wallet to context
          await connectWallet("ICP", "Oisy");
        } else {
          toast.warning(
            "Oisy abierto — conexión requiere registro en whitelist de Oisy",
          );
        }
        onClose();
        return;
      }

      const w = await connectWallet("ICP" as const, walletId);
      if (w.redirected) {
        toast.info(w.installNote ?? `Abriendo ${walletId}...`);
      } else if (w.address) {
        toast.success(`${walletId} conectado`, {
          description: `${w.address.slice(0, 20)}...`,
        });
        onClose();
      } else {
        toast.error(`No se pudo conectar ${walletId}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("cerrado") || msg.includes("closed")) {
        toast.info("Conexión cancelada");
      } else {
        toast.error(`Error: ${msg.slice(0, 80)}`);
      }
    } finally {
      setConnecting(null);
    }
  }

  function saveWCProjectId() {
    localStorage.setItem("wc_project_id", wcProjectId);
    toast.success("Project ID guardado");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-y-auto"
        style={{
          background: "rgba(7,11,10,0.97)",
          border: "1px solid rgba(34,233,122,0.25)",
          boxShadow: "0 0 40px rgba(34,233,122,0.1)",
        }}
        data-ocid="wallet.modal"
      >
        <DialogHeader>
          <DialogTitle
            className="text-base font-bold"
            style={{ color: "#E8ECEB" }}
          >
            Conectar Wallet
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#6B7B74" }}
          />
          <input
            type="text"
            placeholder="Buscar wallet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg text-xs font-mono outline-none"
            style={{
              background: "#0F1513",
              border: "1px solid rgba(34,233,122,0.15)",
              color: "#E8ECEB",
            }}
          />
        </div>

        {/* Wallet groups */}
        <div className="space-y-4">
          {GROUP_ORDER.filter((g) => groups[g]?.length).map((group) => (
            <div key={group}>
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-2"
                style={{ color: "#6B7B74" }}
              >
                {group}
              </p>
              <div className="space-y-1.5">
                {groups[group].map((w) => {
                  const isConnected = connectedIds.has(w.id);
                  const isConnecting = connecting === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleConnect(w.id)}
                      disabled={isConnecting || isConnected}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all"
                      style={{
                        background: "rgba(15,21,19,0.8)",
                        border: isConnected
                          ? "1px solid rgba(34,233,122,0.5)"
                          : "1px solid rgba(34,233,122,0.15)",
                        opacity: isConnected ? 0.7 : 1,
                        cursor: isConnected ? "default" : "pointer",
                      }}
                      data-ocid={`wallet.${w.id.toLowerCase().replace(/\s/g, "_")}.button`}
                    >
                      <div>
                        <p
                          className="text-xs font-semibold"
                          style={{ color: isConnected ? "#22E97A" : "#E8ECEB" }}
                        >
                          {w.label} {isConnected && "✓"}
                        </p>
                        <p
                          className="text-[10px] mt-0.5"
                          style={{ color: "#6B7B74" }}
                        >
                          {WALLET_DESC[w.id] ?? ""}
                        </p>
                      </div>
                      {isConnecting ? (
                        <Loader2
                          size={14}
                          className="animate-spin"
                          style={{ color: "#22E97A" }}
                        />
                      ) : !w.isAvailable() && WALLET_GROUP[w.id] !== "ICP" ? (
                        <ExternalLink size={12} style={{ color: "#6B7B74" }} />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* WalletConnect panel */}
        <div
          style={{ borderTop: "1px solid rgba(34,233,122,0.1)" }}
          className="pt-3"
        >
          <button
            type="button"
            className="w-full flex items-center justify-between text-xs"
            style={{ color: "#22E97A" }}
            onClick={() => setShowWC((v) => !v)}
          >
            <span className="font-semibold">WalletConnect (QR / móvil)</span>
            <span>{showWC ? "▲" : "▼"}</span>
          </button>
          {showWC && (
            <div className="mt-2 space-y-2">
              <p className="text-[10px]" style={{ color: "#6B7B74" }}>
                Para usar WalletConnect necesitas un Project ID gratuito de{" "}
                <a
                  href="https://cloud.walletconnect.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: "#22E97A" }}
                >
                  cloud.walletconnect.com
                </a>
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Pega tu Project ID aquí"
                  value={wcProjectId}
                  onChange={(e) => setWcProjectId(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded text-xs font-mono outline-none"
                  style={{
                    background: "#0F1513",
                    border: "1px solid rgba(34,233,122,0.15)",
                    color: "#E8ECEB",
                  }}
                />
                <button
                  type="button"
                  onClick={saveWCProjectId}
                  className="px-3 py-1.5 rounded text-xs font-semibold"
                  style={{ background: "#22E97A", color: "#070B0A" }}
                >
                  Guardar
                </button>
              </div>
              {wcProjectId && (
                <a
                  href={"https://walletconnect.com/explorer?type=wallet"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10px]"
                  style={{ color: "#22E97A" }}
                >
                  <ExternalLink size={11} /> Abrir WalletConnect
                </a>
              )}
            </div>
          )}
        </div>

        <p className="text-[10px] text-center" style={{ color: "#4A5750" }}>
          Las extensiones no detectadas no aparecen en este listado
        </p>
      </DialogContent>
    </Dialog>
  );
}
