import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import ActivityFeed from "./components/ActivityFeed";
import BridgePanel from "./components/BridgePanel";
import DCSSHero from "./components/DCSSHero";
import Footer from "./components/Footer";
import Navbar, { type Tab } from "./components/Navbar";
import TokenGrid from "./components/TokenGrid";
import { TokenProvider } from "./contexts/TokenContext";
import { TransactionProvider } from "./contexts/TransactionContext";
import { WalletProvider } from "./contexts/WalletContext";

function Dashboard() {
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
              40 assets across ICP, EVM, Solana &amp; Cosmos
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
        <TokenGrid />
      </section>
    </div>
  );
}

function TokensPage() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "#E8ECEB" }}>
          Tokens
        </h2>
        <p className="text-sm mt-1" style={{ color: "#A9B3AF" }}>
          Search and filter across all 40 supported assets
        </p>
      </div>
      <TokenGrid showSearch />
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

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#070B0A" }}
    >
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "tokens" && <TokensPage />}
        {activeTab === "bridge" && <BridgePage />}
        {activeTab === "activity" && <ActivityPage />}
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
