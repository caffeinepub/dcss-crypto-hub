import { useState } from "react";
import type { TokenWithMeta } from "../contexts/TokenContext";
import { useWallet } from "../contexts/WalletContext";
import {
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
}

export default function TokenCard({ token, index }: TokenCardProps) {
  const { activeWallet, getBalance } = useWallet();
  const [action, setAction] = useState<ActionType | null>(null);

  const balance = activeWallet
    ? getBalance(activeWallet.network, activeWallet.address, token.symbol)
    : 0;

  const isPositive = token.change24h >= 0;
  const textColor = getTextColorForBg(token.color);

  return (
    <>
      <article
        className="neon-border rounded-xl p-4 flex flex-col gap-3 transition-all duration-200"
        style={{ background: "#0F1513" }}
        data-ocid={`token.item.${index + 1}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-md"
              style={{ background: token.color, color: textColor }}
            >
              {token.symbol.slice(0, 3)}
            </div>
            <div>
              <div
                className="text-sm font-semibold"
                style={{ color: "#E8ECEB" }}
              >
                {token.name}
              </div>
              <div className="text-xs font-mono" style={{ color: "#A9B3AF" }}>
                {token.symbol}
              </div>
            </div>
          </div>
          <div className="text-right">
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
