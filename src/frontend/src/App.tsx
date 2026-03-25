import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import ActivityFeed from "./components/ActivityFeed";
import AnnouncementBanner from "./components/AnnouncementBanner";
import BridgePanel from "./components/BridgePanel";
import CircuitBackground from "./components/CircuitBackground";
import DCSSHero from "./components/DCSSHero";
import Footer from "./components/Footer";
import Navbar, { type Tab } from "./components/Navbar";
import SplashOverlay from "./components/SplashOverlay";
import TokenGrid from "./components/TokenGrid";
import { TokenProvider } from "./contexts/TokenContext";
import { TransactionProvider } from "./contexts/TransactionContext";
import { WalletProvider } from "./contexts/WalletContext";
import ProjectPage from "./pages/ProjectPage";
import StakingPage from "./pages/StakingPage";
import TokenDetailPage from "./pages/TokenDetailPage";

function Dashboard({
  onNavigateToToken,
  onConnectWallet,
  onBridge,
}: {
  onNavigateToToken: (symbol: string) => void;
  onConnectWallet: (network: string) => void;
  onBridge: () => void;
}) {
  return (
    <div>
      <DCSSHero />
      <section className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#E8ECEB" }}>
              All Tokens
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#A9B3AF" }}>
              43 assets across ICP, EVM, Solana &amp; Cosmos
            </p>
          </div>
          <div
            className="text-xs px-3 py-1.5 rounded-full font-mono"
            style={{
              background: "rgba(34,233,122,0.08)",
              border: "1px solid rgba(34,233,122,0.2)",
              color: "#22E97A",
            }}
          >
            Live prices • 30s refresh
          </div>
        </div>
        <TokenGrid
          onNavigateToToken={onNavigateToToken}
          onConnectWallet={onConnectWallet}
          onBridge={onBridge}
        />
      </section>
    </div>
  );
}

function TokensPage({
  onNavigateToToken,
}: {
  onNavigateToToken: (symbol: string) => void;
}) {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "#E8ECEB" }}>
          Tokens
        </h2>
        <p className="text-sm mt-1" style={{ color: "#A9B3AF" }}>
          Search and filter across all 43 supported assets
        </p>
      </div>
      <TokenGrid showSearch onNavigateToToken={onNavigateToToken} />
    </section>
  );
}

function BridgePage() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-10">
      <BridgePanel />
    </section>
  );
}

function ActivityPage() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-10">
      <ActivityFeed />
    </section>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [tokenDetailSymbol, setTokenDetailSymbol] = useState<string | null>(
    null,
  );
  function handleNavigateToToken(symbol: string) {
    setTokenDetailSymbol(symbol);
  }

  function handleBackFromToken() {
    setTokenDetailSymbol(null);
  }

  function handleConnectWallet(_network: string) {
    // Will open wallet connect modal with network pre-selected in future
  }

  function handleBridge() {
    setActiveTab("bridge");
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setTokenDetailSymbol(null);
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#070B0A", position: "relative" }}
    >
      <SplashOverlay />
      <CircuitBackground />

      {/* All content sits above the circuit background */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
        <AnnouncementBanner />

        <main className="flex-1">
          {tokenDetailSymbol ? (
            <TokenDetailPage
              symbol={tokenDetailSymbol}
              onBack={handleBackFromToken}
            />
          ) : (
            <>
              {activeTab === "dashboard" && (
                <Dashboard
                  onNavigateToToken={handleNavigateToToken}
                  onConnectWallet={handleConnectWallet}
                  onBridge={handleBridge}
                />
              )}
              {activeTab === "tokens" && (
                <TokensPage onNavigateToToken={handleNavigateToToken} />
              )}
              {activeTab === "bridge" && <BridgePage />}
              {activeTab === "activity" && <ActivityPage />}
              {activeTab === "project" && (
                <ProjectPage onNavigateToTab={handleTabChange} />
              )}
              {activeTab === "staking" && <StakingPage />}
            </>
          )}
        </main>

        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0F1513",
              border: "1px solid rgba(34,233,122,0.25)",
              color: "#E8ECEB",
            },
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <TransactionProvider>
        <TokenProvider>
          <AppContent />
        </TokenProvider>
      </TransactionProvider>
    </WalletProvider>
  );
}
