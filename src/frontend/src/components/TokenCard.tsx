import { useState } from "react";
import type { TokenWithMeta } from "../contexts/TokenContext";
import { useWallet } from "../contexts/WalletContext";
import {
  NETWORK_COLORS,
  type TokenMeta,
  formatBalance,
  formatPrice,
  getTextColorForBg,
} from "../data/tokens";
import ActionModal from "./ActionModal";

type ActionType = "buy" | "swap" | "send";

interface TokenCardProps {
  token: TokenWithMeta;
  index: number;
  onNavigateToToken?: (symbol: string) => void;
}

export default function TokenCard({
  token,
  index,
  onNavigateToToken,
}: TokenCardProps) {
  const { activeWallet, getBalance } = useWallet();
  const [action, setAction] = useState<ActionType | null>(null);
  const [hovered, setHovered] = useState(false);

  const balance = activeWallet
    ? getBalance(activeWallet.network, activeWallet.address, token.symbol)
    : 0;

  const isPositive = token.change24h >= 0;
  const textColor = getTextColorForBg(token.color);
  const networkColor = NETWORK_COLORS[token.network] ?? "#22E97A";

  return (
    <>
      <article
        className="neon-border rounded-xl p-4 flex flex-col gap-3 transition-all duration-200"
        style={{
          background: "#0F1513",
          boxShadow: hovered
            ? `0 0 20px ${token.color}60, 0 0 0 1px ${token.color}44`
            : `0 0 0px ${token.color}00`,
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          position: "relative",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-ocid={`token.item.${index + 1}`}
      >
        {/* Network badge */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          title={token.network}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: networkColor,
              boxShadow: `0 0 4px ${networkColor}88`,
            }}
          />
          <span
            style={{
              fontSize: "9px",
              fontWeight: "700",
              color: networkColor,
              letterSpacing: "0.06em",
              opacity: 0.85,
            }}
          >
            {token.network}
          </span>
        </div>
        {token.depin && (
          <div
            style={{
              position: "absolute",
              top: "28px",
              right: "10px",
              padding: "1px 6px",
              borderRadius: "4px",
              background: "rgba(34,233,122,0.12)",
              border: "1px solid rgba(34,233,122,0.35)",
              fontSize: "8px",
              fontWeight: "700",
              color: "#22E97A",
              letterSpacing: "0.06em",
            }}
            title="Decentralized Physical Infrastructure"
          >
            DePIN
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-md"
              style={{ background: token.color, color: textColor }}
            >
              {token.symbol.slice(0, 3)}
            </div>
            <div>
              <button
                type="button"
                className="text-sm font-semibold text-left"
                style={{
                  color: "#E8ECEB",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: onNavigateToToken ? "pointer" : "default",
                  textDecoration:
                    onNavigateToToken && hovered ? "underline" : "none",
                  textUnderlineOffset: "2px",
                }}
                onClick={() => onNavigateToToken?.(token.symbol)}
                data-ocid={`token.detail.${index + 1}.button`}
              >
                {token.name}
              </button>
              <div className="text-xs font-mono" style={{ color: "#A9B3AF" }}>
                {token.symbol}
              </div>
            </div>
          </div>
          <div className="text-right" style={{ paddingRight: "4px" }}>
            <div
              className="text-sm font-bold font-mono"
              style={{ color: "#22E97A" }}
            >
              {formatPrice(token.price)}
            </div>
            <div
              className="text-xs font-mono"
              style={{ color: isPositive ? "#36F28A" : "#ef4444" }}
            >
              {isPositive ? "+" : ""}
              {token.change24h.toFixed(2)}%
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between rounded-lg px-3 py-2"
          style={{
            background: "rgba(34,233,122,0.05)",
            border: "1px solid rgba(34,233,122,0.08)",
          }}
        >
          <span className="text-xs" style={{ color: "#A9B3AF" }}>
            Balance
          </span>
          <span
            className="text-xs font-mono font-medium"
            style={{ color: "#E8ECEB" }}
          >
            {formatBalance(balance)} {token.symbol}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAction("buy")}
            className="flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all"
            style={{ background: "#C9A24A", color: "#070B0A" }}
            data-ocid={`token.buy_button.${index + 1}`}
          >
            BUY
          </button>
          <button
            type="button"
            onClick={() => setAction("swap")}
            className="flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-all"
            style={{
              background: "transparent",
              borderColor: "rgba(201,162,74,0.5)",
              color: "#C9A24A",
            }}
            data-ocid={`token.swap_button.${index + 1}`}
          >
            SWAP
          </button>
          <button
            type="button"
            onClick={() => setAction("send")}
            className="flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-all"
            style={{
              background: "transparent",
              borderColor: "rgba(201,162,74,0.5)",
              color: "#C9A24A",
            }}
            data-ocid={`token.send_button.${index + 1}`}
          >
            SEND
          </button>
        </div>
      </article>

      {action && (
        <ActionModal
          open={!!action}
          onClose={() => setAction(null)}
          action={action}
          token={
            token as TokenMeta & {
              price: number;
              change24h: number;
              id: bigint;
            }
          }
        />
      )}
    </>
  );
}
