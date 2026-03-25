import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Activity,
  ArrowLeftRight,
  BookOpen,
  ChevronDown,
  Coins,
  Layers,
  LayoutDashboard,
  LogOut,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { truncateAddr } from "../data/tokens";
import WalletConnectModal from "./WalletConnectModal";

export type Tab =
  | "dashboard"
  | "tokens"
  | "bridge"
  | "activity"
  | "project"
  | "staking";

const NAV_ITEMS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tokens", label: "Tokens", icon: Coins },
  { id: "bridge", label: "Bridge", icon: ArrowLeftRight },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "project", label: "Project", icon: BookOpen },
  { id: "staking", label: "Staking", icon: Layers },
];

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { connectedWallets, activeWallet, setActiveWallet, disconnectWallet } =
    useWallet();
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "rgba(11,17,16,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(34,233,122,0.12)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onTabChange("dashboard")}
            className="flex items-center gap-2.5 shrink-0"
            data-ocid="nav.dashboard.link"
          >
            <img
              src="/assets/generated/dcss-logo-transparent.dim_200x200.png"
              alt="DCSS"
              className="w-9 h-9 rounded-full object-cover"
            />
            <span
              className="font-bold text-sm tracking-widest uppercase"
              style={{ color: "#22E97A" }}
            >
              DCSS
            </span>
            <span className="hidden sm:block text-xs text-muted-foreground tracking-wider font-medium">
              CRYPTO HUB
            </span>
          </button>

          {/* Center nav — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  data-ocid={`nav.${item.id}.link`}
                  className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors"
                  style={{
                    color: isActive ? "#22E97A" : "rgba(169,179,175,1)",
                    background: isActive
                      ? "rgba(34,233,122,0.08)"
                      : "transparent",
                  }}
                >
                  <Icon size={13} />
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ background: "#22E97A" }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: wallet */}
          <div className="flex items-center gap-2">
            {activeWallet ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-colors"
                    style={{
                      background: "rgba(34,233,122,0.08)",
                      borderColor: "rgba(34,233,122,0.35)",
                      color: "#22E97A",
                    }}
                    data-ocid="nav.wallet.toggle"
                  >
                    <span
                      className="w-2 h-2 rounded-full animate-pulse_neon"
                      style={{ background: "#22E97A" }}
                    />
                    {truncateAddr(activeWallet.address)}
                    <ChevronDown size={12} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56"
                  style={{
                    background: "#0F1513",
                    border: "1px solid rgba(34,233,122,0.2)",
                  }}
                >
                  {connectedWallets.map((w) => (
                    <DropdownMenuItem
                      key={w.address}
                      onClick={() => setActiveWallet(w)}
                      className="flex flex-col items-start gap-0.5 cursor-pointer"
                      style={{
                        color:
                          activeWallet.address === w.address
                            ? "#22E97A"
                            : "#E8ECEB",
                      }}
                    >
                      <span className="text-xs font-medium">
                        {w.walletType} · {w.network}
                      </span>
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: "#A9B3AF" }}
                      >
                        {truncateAddr(w.address)}
                      </span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator
                    style={{ background: "rgba(34,233,122,0.1)" }}
                  />
                  <DropdownMenuItem
                    onClick={() => setWalletModalOpen(true)}
                    style={{ color: "#22E97A" }}
                    data-ocid="nav.connect_wallet.button"
                  >
                    <Wallet size={13} className="mr-2" />
                    Add Wallet
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => disconnectWallet(activeWallet.address)}
                    style={{ color: "#ef4444" }}
                    data-ocid="nav.disconnect.button"
                  >
                    <LogOut size={13} className="mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setWalletModalOpen(true)}
                size="sm"
                className="rounded-full text-xs font-semibold px-4"
                style={{
                  background: "#22E97A",
                  color: "#070B0A",
                  border: "none",
                }}
                data-ocid="nav.connect_wallet.button"
              >
                <Wallet size={13} className="mr-1.5" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>

        {/* Mobile nav — horizontal scroll */}
        <div
          className="flex md:hidden border-t items-center px-2 py-1"
          style={{
            borderColor: "rgba(34,233,122,0.08)",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch" as never,
            scrollbarWidth: "none" as never,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium shrink-0"
                style={{ color: isActive ? "#22E97A" : "#A9B3AF" }}
                data-ocid={`nav.${item.id}.link`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      <WalletConnectModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </>
  );
}
