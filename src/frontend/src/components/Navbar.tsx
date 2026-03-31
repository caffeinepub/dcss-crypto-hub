import {
  Activity,
  ArrowLeftRight,
  Briefcase,
  Coins,
  Layers,
  LayoutDashboard,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { useTheme } from "../hooks/useTheme";

export type Tab =
  | "dashboard"
  | "tokens"
  | "bridge"
  | "activity"
  | "project"
  | "staking"
  | "wallets";

const NAV_ITEMS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tokens", label: "Tokens", icon: Coins },
  { id: "bridge", label: "Bridge", icon: ArrowLeftRight },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "project", label: "Project", icon: Briefcase },
  { id: "staking", label: "Staking", icon: Layers },
];

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onOpenWalletModal?: () => void;
}

export default function Navbar({
  activeTab,
  onTabChange,
  onOpenWalletModal,
}: NavbarProps) {
  const { activeWallet, disconnectWallet } = useWallet();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "midnight";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function truncateAddr(addr: string): string {
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: isDark ? "rgba(7,11,10,0.88)" : "rgba(250,248,245,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 flex items-center h-16 gap-4">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onTabChange("dashboard")}
          className="flex items-center gap-2 flex-shrink-0"
          aria-label="DCSS Crypto Hub — Ir al dashboard"
          data-ocid="nav.dashboard.link"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "rgba(34,233,122,0.15)", color: "#22E97A" }}
          >
            D
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span
              className="text-sm font-bold tracking-wide"
              style={{ color: "#22E97A" }}
            >
              DCSS
            </span>
            <span
              className="text-[9px] tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              CRYPTO HUB
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-0.5 flex-1 justify-center"
          aria-label="Navegación principal"
        >
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                aria-current={isActive ? "page" : undefined}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all"
                style={{
                  background: isActive
                    ? "rgba(34,233,122,0.12)"
                    : "transparent",
                  color: isActive ? "#22E97A" : "var(--text-muted)",
                  border: isActive
                    ? "1px solid rgba(34,233,122,0.25)"
                    : "1px solid transparent",
                }}
                data-ocid={`nav.${id}.link`}
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
            }
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-secondary)",
            }}
            data-ocid="nav.theme.toggle"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Wallet button */}
          {activeWallet ? (
            <button
              type="button"
              onClick={() => disconnectWallet(activeWallet.address)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: "rgba(34,233,122,0.1)",
                border: "1px solid rgba(34,233,122,0.3)",
                color: "#22E97A",
              }}
              title="Desconectar wallet"
              data-ocid="nav.wallet.button"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#22E97A" }}
              />
              {truncateAddr(activeWallet.address)}
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenWalletModal}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: "rgba(34,233,122,0.15)",
                border: "1px solid rgba(34,233,122,0.35)",
                color: "#22E97A",
              }}
              data-ocid="nav.connect_wallet.button"
            >
              Conectar Wallet
            </button>
          )}

          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-secondary)",
            }}
            data-ocid="nav.menu.button"
          >
            {menuOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden border-t"
          style={{
            background: isDark
              ? "rgba(7,11,10,0.96)"
              : "rgba(250,248,245,0.96)",
            borderColor: "var(--glass-border)",
          }}
        >
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onTabChange(id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors"
                style={{
                  color: isActive ? "#22E97A" : "var(--text-secondary)",
                  background: isActive
                    ? "rgba(34,233,122,0.06)"
                    : "transparent",
                }}
                data-ocid={`nav.${id}.link`}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
