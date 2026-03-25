import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, Eye, MapPin, Shield } from "lucide-react";
import type { ReactNode } from "react";
import type { Tab } from "../components/Navbar";
import { NETWORK_CONTENT } from "../data/networkContent";
import {
  BLOCKCHAIN_EDUCATION,
  CHILE_SECTION,
  DCSS_MANIFESTO,
  DCSS_TOKEN_INFO,
  DIFFERENTIATORS,
  ROADMAP,
} from "../data/projectContent";
import { TOKEN_LIST } from "../data/tokens";

const ICON_MAP: Record<string, ReactNode> = {
  Shield: <Shield size={22} />,
  BookOpen: <BookOpen size={22} />,
  MapPin: <MapPin size={22} />,
  Eye: <Eye size={22} />,
};

interface ProjectPageProps {
  onNavigateToTab: (tab: Tab) => void;
}

export default function ProjectPage({ onNavigateToTab }: ProjectPageProps) {
  const tokensPerNetwork = NETWORK_CONTENT.map((n) => ({
    ...n,
    count: TOKEN_LIST.filter((t) => t.network === n.id).length,
  }));

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 16px" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", marginBottom: "64px" }}>
        <div
          style={{
            width: "90px",
            height: "90px",
            margin: "0 auto 24px",
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(34,233,122,0.35)",
            animation: "project-pulse 3s ease-in-out infinite",
          }}
        >
          <img
            src="/assets/generated/dcss-logo-transparent.dim_200x200.png"
            alt="DCSS Logo"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: "800",
            color: "#E8ECEB",
            lineHeight: 1.2,
            marginBottom: "16px",
          }}
        >
          {DCSS_MANIFESTO.title}
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "#22E97A",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          {DCSS_MANIFESTO.subtitle}
        </p>
      </section>

      {/* Manifesto body */}
      <section style={{ marginBottom: "64px" }}>
        {DCSS_MANIFESTO.body.map((para, i) => (
          <p
            key={para.slice(0, 20)}
            style={
              {
                fontSize: "17px",
                color: i === 0 ? "#E8ECEB" : "#A9B3AF",
                lineHeight: 1.8,
                marginBottom: "24px",
                borderLeft: i === 3 ? "3px solid #22E97A" : "none",
                paddingLeft: i === 3 ? "16px" : "0",
              } as React.CSSProperties
            }
          >
            {para}
          </p>
        ))}
      </section>

      {/* Differentiators */}
      <section style={{ marginBottom: "64px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#E8ECEB",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          ¿Por qué DCSS?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
          }}
          className="diff-grid"
        >
          {DIFFERENTIATORS.map((d) => (
            <div
              key={d.title}
              style={{
                padding: "24px",
                borderRadius: "12px",
                background: "#0F1513",
                border: "1px solid rgba(34,233,122,0.12)",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(34,233,122,0.1)",
                  border: "1px solid rgba(34,233,122,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#22E97A",
                  flexShrink: 0,
                }}
              >
                {ICON_MAP[d.icon]}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#E8ECEB",
                    marginBottom: "6px",
                  }}
                >
                  {d.title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#A9B3AF",
                    lineHeight: 1.5,
                  }}
                >
                  {d.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ecosystem */}
      <section style={{ marginBottom: "64px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#E8ECEB",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          El Ecosistema
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
          }}
          className="eco-grid"
        >
          {tokensPerNetwork.map((n) => (
            <div
              key={n.id}
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "#0F1513",
                borderLeft: `4px solid ${n.color}`,
                border: `1px solid ${n.color}22`,
                borderLeftWidth: "4px",
                borderLeftColor: n.color,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: n.color,
                  }}
                >
                  {n.name}
                </div>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: `${n.color}18`,
                    fontSize: "11px",
                    color: n.color,
                    fontWeight: "600",
                  }}
                >
                  {n.count} tokens
                </span>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#A9B3AF",
                  lineHeight: 1.5,
                  marginBottom: "12px",
                }}
              >
                {n.intro25words}
              </p>
              <button
                type="button"
                onClick={() => onNavigateToTab("dashboard" as Tab)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  background: `${n.color}18`,
                  border: `1px solid ${n.color}44`,
                  color: n.color,
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                data-ocid="project.ecosystem.button"
              >
                Explorar →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section style={{ marginBottom: "64px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#E8ECEB",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Roadmap
        </h2>
        <div style={{ position: "relative", paddingLeft: "32px" }}>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: "11px",
              top: "0",
              bottom: "0",
              width: "2px",
              background: "rgba(34,233,122,0.15)",
            }}
          />
          {ROADMAP.map((phase) => (
            <div
              key={phase.phase}
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "28px",
                position: "relative",
              }}
            >
              {/* Dot */}
              <div
                style={{
                  position: "absolute",
                  left: "-25px",
                  top: "4px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background:
                    phase.status === "completed"
                      ? "#22E97A"
                      : phase.status === "current"
                        ? "#FFD700"
                        : "#0F1513",
                  border: `2px solid ${
                    phase.status === "completed"
                      ? "#22E97A"
                      : phase.status === "current"
                        ? "#FFD700"
                        : "rgba(169,179,175,0.3)"
                  }`,
                  boxShadow:
                    phase.status === "current"
                      ? "0 0 12px rgba(255,215,0,0.4)"
                      : phase.status === "completed"
                        ? "0 0 8px rgba(34,233,122,0.3)"
                        : "none",
                }}
              />
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color:
                        phase.status === "completed"
                          ? "#22E97A"
                          : phase.status === "current"
                            ? "#FFD700"
                            : "#A9B3AF",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {phase.phase.toUpperCase()}
                  </span>
                  {phase.status === "current" && (
                    <span
                      style={{
                        padding: "1px 6px",
                        borderRadius: "4px",
                        background: "rgba(255,215,0,0.12)",
                        color: "#FFD700",
                        fontSize: "9px",
                        fontWeight: "700",
                        letterSpacing: "0.08em",
                      }}
                    >
                      EN CURSO
                    </span>
                  )}
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: phase.status === "upcoming" ? "#A9B3AF" : "#E8ECEB",
                    marginBottom: "4px",
                  }}
                >
                  {phase.title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(169,179,175,0.7)",
                    lineHeight: 1.4,
                  }}
                >
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DCSS Token */}
      <section style={{ marginBottom: "64px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#E8ECEB",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          El Token DCSS
        </h2>
        <div
          style={{
            padding: "28px",
            borderRadius: "12px",
            background: "#0F1513",
            border: "1px solid rgba(255,215,0,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "#FFD700",
                }}
              >
                DCSS
              </div>
              <div style={{ fontSize: "12px", color: "#A9B3AF" }}>
                {DCSS_TOKEN_INFO.network}
              </div>
            </div>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: "999px",
                background: "rgba(255,215,0,0.12)",
                border: "1px solid rgba(255,215,0,0.3)",
                fontSize: "14px",
                fontWeight: "700",
                color: "#FFD700",
              }}
            >
              🚀 Coming Soon
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h4
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#A9B3AF",
                marginBottom: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Utilidad del Token
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {DCSS_TOKEN_INFO.utility.map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    fontSize: "13px",
                    color: "#A9B3AF",
                  }}
                >
                  <span
                    style={{
                      color: "#22E97A",
                      marginTop: "1px",
                      flexShrink: 0,
                    }}
                  >
                    ✦
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#A9B3AF",
                marginBottom: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Distribución del Supply
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {DCSS_TOKEN_INFO.distribution.map((item) => (
                <div key={item.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#A9B3AF" }}>
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: item.color,
                      }}
                    >
                      {item.pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "6px",
                      borderRadius: "3px",
                      background: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "3px",
                        background: item.color,
                        width: `${item.pct}%`,
                        boxShadow: `0 0 8px ${item.color}44`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chile section */}
      <section style={{ marginBottom: "64px" }}>
        <div
          style={{
            padding: "32px",
            borderRadius: "12px",
            background: "#0F1513",
            border: "1px solid rgba(213,43,30,0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle chile flag bg */}
          <div
            style={{
              position: "absolute",
              right: "-40px",
              top: "-20px",
              fontSize: "120px",
              opacity: 0.04,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            🇨🇱
          </div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#E8ECEB",
              marginBottom: "16px",
            }}
          >
            {CHILE_SECTION.title}
          </h2>
          {CHILE_SECTION.paragraphs.map((p) => (
            <p
              key={p.slice(0, 20)}
              style={{
                fontSize: "14px",
                color: "#A9B3AF",
                lineHeight: 1.7,
                marginBottom: "14px",
              }}
            >
              {p}
            </p>
          ))}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "16px",
            }}
          >
            {CHILE_SECTION.highlights.map((h) => (
              <span
                key={h}
                style={{
                  padding: "5px 12px",
                  borderRadius: "999px",
                  background: "rgba(213,43,30,0.12)",
                  border: "1px solid rgba(213,43,30,0.3)",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#D52B1E",
                }}
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section style={{ marginBottom: "64px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#E8ECEB",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          {BLOCKCHAIN_EDUCATION.title}
        </h2>
        <Accordion
          type="single"
          collapsible
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          {BLOCKCHAIN_EDUCATION.sections.map((section, i) => (
            <AccordionItem
              key={section.title}
              value={`edu-${i}`}
              style={{
                borderRadius: "10px",
                background: "#0F1513",
                border: "1px solid rgba(34,233,122,0.12)",
                paddingLeft: "0",
                overflow: "hidden",
              }}
              data-ocid={`education.item.${i + 1}`}
            >
              <AccordionTrigger
                style={{
                  padding: "16px 20px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#E8ECEB",
                  textDecoration: "none",
                }}
              >
                {section.title}
              </AccordionTrigger>
              <AccordionContent
                style={{
                  padding: "0 20px 16px",
                  fontSize: "14px",
                  color: "#A9B3AF",
                  lineHeight: 1.7,
                }}
              >
                {section.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* DePIN Universe Section */}
      <section style={{ marginBottom: "64px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "#22E97A",
              letterSpacing: "0.15em",
              marginBottom: "8px",
            }}
          >
            DECENTRALIZED PHYSICAL INFRASTRUCTURE
          </div>
          <h2
            style={{
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: "800",
              color: "#E8ECEB",
              marginBottom: "12px",
            }}
          >
            DePIN Universe
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#A9B3AF",
              maxWidth: "580px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Infraestructura física del mundo real controlada por sus usuarios.
            DCSS integra los principales proyectos DePIN: GPU, almacenamiento,
            ancho de banda y datos descentralizados.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px",
          }}
          className="depin-grid"
        >
          {[
            {
              symbol: "RENDER",
              cat: "GPU Rendering",
              emoji: "🖥️",
              color: "#FF4500",
              desc: "Renders 3D descentralizados",
            },
            {
              symbol: "IO",
              cat: "GPU / AI Compute",
              emoji: "🤖",
              color: "#00D4FF",
              desc: "Mercado GPUs para ML",
            },
            {
              symbol: "GRASS",
              cat: "Web Data",
              emoji: "🌐",
              color: "#4CAF50",
              desc: "Datos de entrenamiento IA",
            },
            {
              symbol: "AKT",
              cat: "Cloud Compute",
              emoji: "☁️",
              color: "#FF414C",
              desc: "AWS descentralizado",
            },
            {
              symbol: "TRAC",
              cat: "Data Intelligence",
              emoji: "🔗",
              color: "#3EAFDD",
              desc: "Grafos conocimiento on-chain",
            },
            {
              symbol: "ATH",
              cat: "GPU / Gaming",
              emoji: "🎮",
              color: "#6EFF6E",
              desc: "Infraestructura GPU gaming",
            },
            {
              symbol: "GRT",
              cat: "Data Indexing",
              emoji: "📊",
              color: "#6747ED",
              desc: "Indexación datos blockchain",
            },
            {
              symbol: "TAO",
              cat: "AI Networks",
              emoji: "🧠",
              color: "#36A18B",
              desc: "Red descentralizada de IA",
            },
            {
              symbol: "AR",
              cat: "Permanent Storage",
              emoji: "💾",
              color: "#888888",
              desc: "Almacenamiento permanente",
            },
            {
              symbol: "DVPN",
              cat: "Bandwidth / VPN",
              emoji: "🛡️",
              color: "#4AB44A",
              desc: "VPN descentralizada",
            },
            {
              symbol: "ASI",
              cat: "AI Agents",
              emoji: "⚡",
              color: "#1B2B4B",
              desc: "Agentes autónomos de IA",
            },
          ].map((token) => (
            <div
              key={token.symbol}
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#0F1513",
                border: `1px solid ${token.color}22`,
                borderTop: `3px solid ${token.color}`,
                display: "flex",
                flexDirection: "column" as const,
                gap: "8px",
              }}
              data-ocid={"depin.token.card"}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "22px" }}>{token.emoji}</span>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#E8ECEB",
                    }}
                  >
                    {token.symbol}
                  </div>
                  <div style={{ fontSize: "11px", color: "#A9B3AF" }}>
                    {token.desc}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "3px 8px",
                  borderRadius: "999px",
                  background: `${token.color}14`,
                  border: `1px solid ${token.color}44`,
                  fontSize: "10px",
                  fontWeight: "700",
                  color: token.color,
                  alignSelf: "flex-start" as const,
                }}
              >
                {token.cat}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CLP Token Whitepaper Section */}
      <section style={{ marginBottom: "64px" }}>
        <div
          style={{
            padding: "32px",
            borderRadius: "16px",
            background: "#0F1513",
            border: "1px solid rgba(213,43,30,0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Chile flag subtle bg */}
          <div
            style={{
              position: "absolute",
              right: "-30px",
              top: "-30px",
              fontSize: "160px",
              opacity: 0.04,
              pointerEvents: "none",
              userSelect: "none" as const,
            }}
          >
            🇨🇱
          </div>

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                fontSize: "12px",
                color: "#D52B1E",
                letterSpacing: "0.15em",
                marginBottom: "8px",
              }}
            >
              WHITEPAPER — VERSIÓN SIMPLIFICADA
            </div>
            <h2
              style={{
                fontSize: "clamp(22px, 4vw, 32px)",
                fontWeight: "800",
                color: "#E8ECEB",
                marginBottom: "12px",
              }}
            >
              CLP Token — El Peso Chileno en la Blockchain
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#A9B3AF",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Stablecoin respaldada 1:1, diseñada para representar el peso
              chileno en Internet Computer. Fidelidad, seguridad y eficacia —
              sin el riesgo algorítmico de Terra.
            </p>
          </div>

          {/* Architecture */}
          <div style={{ marginBottom: "28px" }}>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#D52B1E",
                letterSpacing: "0.1em",
                marginBottom: "16px",
              }}
            >
              ⚙️ ARQUITECTURA DEL SISTEMA
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
              }}
              className="clp-arch-grid"
            >
              {[
                {
                  title: "Respaldo 1:1",
                  desc: "Cada CLP emitido está cubierto por USDT/USDC en contratos ICP. Sin algoritmo, sin colateral volátil.",
                  icon: "🏦",
                  color: "#003DA5",
                },
                {
                  title: "Liquidez Balanceada",
                  desc: "30–40% líquido para traders. 60–70% bloqueado en staking de largo plazo.",
                  icon: "💧",
                  color: "#D52B1E",
                },
                {
                  title: "Mecanismo de Quema",
                  desc: "Cada redención destruye CLP token. La oferta circulante siempre coincide con las reservas.",
                  icon: "🔥",
                  color: "#FF6B35",
                },
                {
                  title: "Interoperabilidad",
                  desc: "Puentes Wormhole, LayerZero e IBC permiten mover CLP a EVM, Solana y otras cadenas.",
                  icon: "🌉",
                  color: "#22E97A",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: "16px",
                    borderRadius: "10px",
                    background: "rgba(7,11,10,0.6)",
                    border: `1px solid ${item.color}22`,
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: item.color,
                        marginBottom: "4px",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#A9B3AF",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Governance */}
          <div style={{ marginBottom: "28px" }}>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#003DA5",
                letterSpacing: "0.1em",
                marginBottom: "16px",
              }}
            >
              🏛️ GOBERNANZA
            </h3>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[
                {
                  label: "Comité Validadores",
                  desc: "Curaduría de propuestas antes de votar",
                },
                {
                  label: "Quórum Mínimo",
                  desc: "Participación significativa requerida",
                },
                {
                  label: "Guardianes de Emergencia",
                  desc: "Veto ante propuestas maliciosas",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    flex: "1",
                    minWidth: "140px",
                    padding: "14px",
                    borderRadius: "10px",
                    background: "rgba(0,61,165,0.08)",
                    border: "1px solid rgba(0,61,165,0.25)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#003DA5",
                      marginBottom: "4px",
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "#A9B3AF" }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparativa DAI vs USDC vs CLP */}
          <div style={{ marginBottom: "28px" }}>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#E8ECEB",
                letterSpacing: "0.1em",
                marginBottom: "16px",
              }}
            >
              📊 COMPARATIVA: DAI vs USDC vs CLP vs TERRA
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                  minWidth: "500px",
                }}
              >
                <thead>
                  <tr>
                    {[
                      "Característica",
                      "DAI",
                      "USDC",
                      "CLP Token",
                      "Terra",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 12px",
                          textAlign: "left" as const,
                          color:
                            h === "CLP Token"
                              ? "#D52B1E"
                              : h === "Terra"
                                ? "#ef4444"
                                : "#A9B3AF",
                          fontWeight: "700",
                          borderBottom:
                            h === "CLP Token"
                              ? "2px solid #D52B1E"
                              : "1px solid rgba(255,255,255,0.08)",
                          background:
                            h === "CLP Token"
                              ? "rgba(213,43,30,0.06)"
                              : "transparent",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Respaldo",
                      "ETH/USDC colateral",
                      "Fiat 1:1 auditado",
                      "USDT/USDC + ICP",
                      "LUNA (volátil)",
                    ],
                    [
                      "Gobernanza",
                      "DAO on-chain",
                      "Centralizada Circle",
                      "Comité + quórum",
                      "Algoritmo",
                    ],
                    [
                      "Auditorías",
                      "Transparente on-chain",
                      "Mensual externas",
                      "Planificadas",
                      "Ninguna",
                    ],
                    [
                      "Liquidez",
                      "Alta (DeFi global)",
                      "Alta (institucional)",
                      "30–40% garantizado",
                      "Dependía del algoritmo",
                    ],
                    [
                      "Quema",
                      "Sí (redención DAI)",
                      "Sí (redención USDC)",
                      "Sí (automática)",
                      "Sí (pero col. volátil)",
                    ],
                    [
                      "Red base",
                      "Ethereum",
                      "Multichain",
                      "ICP + puentes",
                      "Terra (colapsó)",
                    ],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) => (
                        <td
                          key={`${row[0]}-${i}`}
                          style={{
                            padding: "10px 12px",
                            color:
                              i === 3
                                ? "#E8ECEB"
                                : i === 4
                                  ? "#ef4444"
                                  : "#A9B3AF",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            fontWeight: i === 3 ? "600" : "400",
                            background:
                              i === 3 ? "rgba(213,43,30,0.04)" : "transparent",
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Why not Terra */}
          <div style={{ marginBottom: "28px" }}>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#D52B1E",
                letterSpacing: "0.1em",
                marginBottom: "16px",
              }}
            >
              ⚠️ ¿POR QUÉ NO COLAPSARÁ COMO TERRA?
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
              className="clp-terra-grid"
            >
              {[
                {
                  factor: "Colateral",
                  terra: "LUNA volátil — colapsó 99% en días",
                  clp: "USDT/USDC estables, auditados",
                  icon: "💰",
                },
                {
                  factor: "Algoritmo",
                  terra: "Dependía de demanda artificial de UST",
                  clp: "Sin algoritmo, respaldo real directo",
                  icon: "⚙️",
                },
                {
                  factor: "Liquidez",
                  terra: "Sin reserva mínima garantizada",
                  clp: "30-40% siempre líquido anti bank-run",
                  icon: "💧",
                },
              ].map((item) => (
                <div
                  key={item.factor}
                  style={{
                    padding: "16px",
                    borderRadius: "10px",
                    background: "rgba(7,11,10,0.8)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div style={{ fontSize: "18px", marginBottom: "8px" }}>
                    {item.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#E8ECEB",
                      marginBottom: "8px",
                    }}
                  >
                    {item.factor}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#ef4444",
                      marginBottom: "6px",
                      display: "flex",
                      gap: "4px",
                    }}
                  >
                    <span>❌</span> {item.terra}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#22E97A",
                      display: "flex",
                      gap: "4px",
                    }}
                  >
                    <span>✅</span> {item.clp}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CLP Roadmap */}
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#003DA5",
                letterSpacing: "0.1em",
                marginBottom: "16px",
              }}
            >
              🗺️ ROADMAP CLP TOKEN
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column" as const,
                gap: "0",
              }}
            >
              {[
                {
                  phase: "Fase 1",
                  desc: "Emisión inicial respaldada en USDT/USDC en contratos ICP",
                  status: "En desarrollo",
                },
                {
                  phase: "Fase 2",
                  desc: "Integración con bancos chilenos — respaldo en CLP fiat auditado",
                  status: "Pendiente",
                },
                {
                  phase: "Fase 3",
                  desc: "Expansión vía puentes Wormhole/LayerZero a EVM y Solana",
                  status: "Pendiente",
                },
                {
                  phase: "Fase 4",
                  desc: "Gobernanza descentralizada con comité validadores y guardianes",
                  status: "Pendiente",
                },
                {
                  phase: "Fase 5",
                  desc: "Auditorías externas + adopción masiva en pagos locales Chile",
                  status: "Pendiente",
                },
              ].map((phase, i, arr) => (
                <div
                  key={phase.phase}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                    paddingBottom: i < arr.length - 1 ? "20px" : 0,
                    position: "relative" as const,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column" as const,
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background:
                          i === 0
                            ? "rgba(213,43,30,0.2)"
                            : "rgba(0,61,165,0.15)",
                        border: `2px solid ${i === 0 ? "#D52B1E" : "#003DA5"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "800",
                        color: i === 0 ? "#D52B1E" : "#003DA5",
                        boxShadow:
                          i === 0 ? "0 0 12px rgba(213,43,30,0.4)" : "none",
                      }}
                    >
                      {i + 1}
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        style={{
                          width: "2px",
                          flex: 1,
                          minHeight: "24px",
                          background: "rgba(0,61,165,0.2)",
                          marginTop: "4px",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ paddingTop: "6px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          color: i === 0 ? "#D52B1E" : "#003DA5",
                        }}
                      >
                        {phase.phase}
                      </span>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "999px",
                          background:
                            i === 0
                              ? "rgba(213,43,30,0.12)"
                              : "rgba(0,61,165,0.08)",
                          border: `1px solid ${i === 0 ? "rgba(213,43,30,0.3)" : "rgba(0,61,165,0.2)"}`,
                          fontSize: "10px",
                          fontWeight: "700",
                          color: i === 0 ? "#D52B1E" : "#A9B3AF",
                        }}
                      >
                        {phase.status}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#A9B3AF",
                        lineHeight: 1.6,
                      }}
                    >
                      {phase.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          textAlign: "center",
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => onNavigateToTab("dashboard" as Tab)}
          style={{
            padding: "14px 32px",
            borderRadius: "10px",
            background: "#22E97A",
            border: "none",
            color: "#070B0A",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(34,233,122,0.3)",
          }}
          data-ocid="project.dashboard.primary_button"
        >
          Ir al Dashboard →
        </button>
        <button
          type="button"
          onClick={() => onNavigateToTab("staking" as Tab)}
          style={{
            padding: "14px 32px",
            borderRadius: "10px",
            background: "transparent",
            border: "1px solid rgba(255,215,0,0.4)",
            color: "#FFD700",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
          }}
          data-ocid="project.staking.secondary_button"
        >
          Ver Staking
        </button>
      </section>

      <style>{`
        @keyframes project-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(34,233,122,0.3); }
          50% { box-shadow: 0 0 50px rgba(34,233,122,0.5), 0 0 80px rgba(34,233,122,0.2); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="project-pulse"] { animation: none !important; }
        }
        @media (max-width: 640px) {
          .diff-grid, .eco-grid, .depin-grid, .clp-arch-grid, .clp-terra-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
