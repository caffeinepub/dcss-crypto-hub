import {
  ChevronLeft,
  ExternalLink,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ActionModal from "../components/ActionModal";
import TokenCard from "../components/TokenCard";
import type { TokenWithMeta } from "../contexts/TokenContext";
import { useTokens } from "../contexts/TokenContext";
import { TOKEN_DEEP_DATA } from "../data/tokenDeepData";
import { NETWORK_COLORS, formatPrice } from "../data/tokens";

type RangeKey = "7D" | "30D" | "90D" | "1Y";
type ActionType = "buy" | "swap" | "send";

const RANGE_DAYS: Record<RangeKey, number> = {
  "7D": 7,
  "30D": 30,
  "90D": 90,
  "1Y": 365,
};

function generatePriceHistory(
  basePrice: number,
  days: number,
  seed: number,
): Array<{ date: string; price: number }> {
  const data: Array<{ date: string; price: number }> = [];
  let price = basePrice * (0.7 + (seed % 30) / 100);
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    const label =
      days <= 7
        ? d.toLocaleDateString("es-CL", { weekday: "short" })
        : days <= 90
          ? `${d.getDate()}/${d.getMonth() + 1}`
          : d.toLocaleDateString("es-CL", { month: "short", year: "2-digit" });
    const change = (Math.random() - 0.48) * 0.06;
    price = Math.max(price * (1 + change), 0.000001);
    data.push({
      date: label,
      price: Number.parseFloat(price.toFixed(price > 1 ? 4 : 8)),
    });
  }
  return data;
}

function fmtLarge(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

interface TokenDetailPageProps {
  symbol: string;
  onBack: () => void;
}

export default function TokenDetailPage({
  symbol,
  onBack,
}: TokenDetailPageProps) {
  const { tokens } = useTokens();
  const token = tokens.find((t) => t.symbol === symbol);
  const [action, setAction] = useState<ActionType | null>(null);
  const [range, setRange] = useState<RangeKey>("30D");
  const deepData = TOKEN_DEEP_DATA[symbol];

  const chartData = useMemo(
    () =>
      token
        ? generatePriceHistory(
            token.price,
            RANGE_DAYS[range],
            symbol.charCodeAt(0) * 7 + symbol.charCodeAt(1 % symbol.length) * 3,
          )
        : [],
    [token, range, symbol],
  );

  const chartMin = useMemo(
    () => Math.min(...chartData.map((d) => d.price)),
    [chartData],
  );
  const chartMax = useMemo(
    () => Math.max(...chartData.map((d) => d.price)),
    [chartData],
  );
  const firstPrice = chartData[0]?.price ?? 0;
  const lastPrice = chartData[chartData.length - 1]?.price ?? 0;
  const rangeChange =
    firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;
  const isRangePositive = rangeChange >= 0;

  if (!token) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-10 text-center">
        <p style={{ color: "var(--text-muted)" }}>
          Token no encontrado: {symbol}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-sm"
          style={{
            color: "var(--accent-color)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← Volver
        </button>
      </div>
    );
  }

  const networkColor = NETWORK_COLORS[token.network] ?? "#22E97A";
  const isPositive = token.change24h >= 0;
  const marketCap = token.price * 1_000_000_000;
  const volume24h =
    token.price * (50_000 + Math.floor(token.symbol.charCodeAt(0) * 3000));

  const relatedTokens = tokens
    .filter((t) => t.network === token.network && t.symbol !== token.symbol)
    .slice(0, 3);

  const educationText = deepData?.tagline || token.description || null;

  return (
    <>
      <div className="max-w-[960px] mx-auto px-4 py-8">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:opacity-80"
          style={{
            color: "var(--text-secondary)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          data-ocid="token.back.button"
        >
          <ChevronLeft size={16} /> Volver
        </button>

        {/* Header */}
        <div
          className="rounded-[18px] p-6 mb-6"
          style={{
            background: "var(--glass-bg)",
            border: `1px solid ${networkColor}30`,
            backdropFilter: "blur(12px)",
            boxShadow: "var(--card-shadow)",
            borderLeft: `4px solid ${networkColor}`,
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold flex-shrink-0"
              style={{
                background: `${networkColor}20`,
                color: networkColor,
                fontSize: 24,
              }}
            >
              {symbol.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1
                  className="text-2xl font-bold font-display"
                  style={{ color: "var(--text-primary)" }}
                >
                  {token.name}
                </h1>
                <span
                  className="text-sm font-mono px-2.5 py-0.5 rounded-full"
                  style={{
                    background: `${networkColor}18`,
                    color: networkColor,
                  }}
                >
                  {symbol}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "var(--bg-elevated)",
                    color: "var(--text-muted)",
                  }}
                >
                  {token.network}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span
                  className="text-3xl font-bold font-mono"
                  style={{ color: "var(--text-primary)" }}
                  aria-live="polite"
                >
                  {formatPrice(token.price)}
                </span>
                <span
                  className="flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: isPositive
                      ? "rgba(34,233,122,0.1)"
                      : "rgba(255,68,68,0.1)",
                    color: isPositive ? "#22E97A" : "#FF4444",
                  }}
                >
                  {isPositive ? (
                    <TrendingUp size={13} />
                  ) : (
                    <TrendingDown size={13} />
                  )}
                  {isPositive ? "+" : ""}
                  {token.change24h.toFixed(2)}% 24h
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["buy", "swap", "send"] as ActionType[]).map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => setAction(act)}
                  className="text-xs px-4 py-2 rounded-full font-semibold capitalize transition-all"
                  style={{
                    background:
                      act === "buy" ? "var(--accent-color)" : "var(--glass-bg)",
                    color: act === "buy" ? "#070B0A" : "var(--text-primary)",
                    border:
                      act === "buy" ? "none" : "1px solid var(--glass-border)",
                  }}
                  data-ocid={`token.${act}.button`}
                >
                  {act === "buy"
                    ? "Comprar"
                    : act === "swap"
                      ? "Swap"
                      : "Enviar"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div
          className="rounded-[18px] p-6 mb-6"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            backdropFilter: "blur(12px)",
            boxShadow: "var(--card-shadow)",
          }}
          data-ocid="token.chart_point"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                Variación en el rango
              </div>
              <div
                className="flex items-center gap-1.5 mt-0.5"
                style={{ color: isRangePositive ? "#22E97A" : "#FF4444" }}
              >
                {isRangePositive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                <span className="text-lg font-bold font-mono">
                  {isRangePositive ? "+" : ""}
                  {rangeChange.toFixed(2)}%
                </span>
              </div>
              <div
                className="flex gap-3 mt-1 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                <span>
                  Mín:{" "}
                  <strong style={{ color: "var(--text-secondary)" }}>
                    {formatPrice(chartMin)}
                  </strong>
                </span>
                <span>
                  Máx:{" "}
                  <strong style={{ color: "var(--text-secondary)" }}>
                    {formatPrice(chartMax)}
                  </strong>
                </span>
              </div>
            </div>
            <fieldset
              className="flex gap-1.5 border-0 p-0 m-0"
              aria-label="Rango del gráfico"
            >
              {(["7D", "30D", "90D", "1Y"] as RangeKey[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className="text-xs px-3 py-1.5 rounded-full font-mono transition-all"
                  style={{
                    background: range === r ? networkColor : "var(--glass-bg)",
                    color: range === r ? "#070B0A" : "var(--text-muted)",
                    border: `1px solid ${range === r ? networkColor : "var(--glass-border)"}`,
                    fontWeight: range === r ? 700 : 400,
                  }}
                  aria-pressed={range === r}
                  data-ocid={`token.range_${r.toLowerCase()}.button`}
                >
                  {r}
                </button>
              ))}
            </fieldset>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1 ? `$${v.toFixed(0)}` : `$${v.toFixed(4)}`
                  }
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-surface)",
                    border: `1px solid ${networkColor}40`,
                    borderRadius: "10px",
                    fontSize: 11,
                    color: "var(--text-primary)",
                  }}
                  formatter={(value: number) => [formatPrice(value), symbol]}
                  labelStyle={{ color: "var(--text-muted)" }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={networkColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    stroke: networkColor,
                    strokeWidth: 2,
                    fill: "var(--bg-surface)",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p
            className="text-[10px] text-right mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            📊 Datos simulados · Oráculos reales en Fase 2
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "Market Cap",
              value: fmtLarge(marketCap),
              note: "simulado",
            },
            {
              label: "Volumen 24h",
              value: fmtLarge(volume24h),
              note: "simulado",
            },
            { label: "Supply Total", value: `1B ${symbol}`, note: "" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[14px] p-4"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
              <div
                className="text-lg font-bold font-mono mt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                {stat.value}
              </div>
              {stat.note ? (
                <div
                  className="text-[10px] mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {stat.note}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Education / description */}
        {educationText && (
          <div
            className="rounded-[18px] p-6 mb-6"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <h2
              className="text-lg font-bold font-display mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              ¿Qué es {token.name}?
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {educationText}
            </p>
            {deepData?.educationalSection && (
              <div
                className="mt-4 pt-4"
                style={{ borderTop: "1px solid var(--glass-border)" }}
              >
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {deepData.educationalSection.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {deepData.educationalSection.content}
                </p>
              </div>
            )}
          </div>
        )}

        {/* External links */}
        <div className="flex gap-2 flex-wrap mb-8">
          {token.officialUrl && (
            <a
              href={token.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full transition-all"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-secondary)",
              }}
            >
              Sitio oficial <ExternalLink size={11} />
            </a>
          )}
          {token.explorerUrl && (
            <a
              href={token.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full transition-all"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-secondary)",
              }}
            >
              Explorer <ExternalLink size={11} />
            </a>
          )}
        </div>

        {/* Related tokens */}
        {relatedTokens.length > 0 && (
          <div>
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Otros tokens en {token.network}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedTokens.map((rt, i) => (
                <TokenCard
                  key={rt.symbol}
                  token={rt as TokenWithMeta}
                  index={i}
                  onNavigateToToken={() => onBack()}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {action && token && (
        <ActionModal
          token={token as TokenWithMeta}
          action={action}
          open
          onClose={() => setAction(null)}
        />
      )}
    </>
  );
}
