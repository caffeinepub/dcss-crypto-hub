import { SiGithub, SiX } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="w-full mt-auto"
      style={{
        background: "var(--bg-base)",
        borderTop: "1px solid rgba(34,233,122,0.08)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "rgba(34,233,122,0.12)", color: "#22E97A" }}
            >
              D
            </div>
            <div>
              <div
                className="text-sm font-bold tracking-widest"
                style={{ color: "#22E97A" }}
              >
                DCSS
              </div>
              <div
                className="text-[10px] tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                CRYPTO HUB
              </div>
            </div>
          </div>

          {/* Links */}
          <div
            className="flex gap-6 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <span className="cursor-default">Recursos</span>
            <span className="cursor-default">Comunidad</span>
            <span className="cursor-default">Legal</span>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/ducassephil-cmyk/dcss-crypto-hub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-all hover:border-[#22E97A]"
              style={{
                background: "rgba(34,233,122,0.04)",
                borderColor: "rgba(34,233,122,0.12)",
              }}
            >
              <SiGithub size={13} style={{ color: "var(--text-secondary)" }} />
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter/X"
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-all hover:border-[#22E97A]"
              style={{
                background: "rgba(34,233,122,0.04)",
                borderColor: "rgba(34,233,122,0.12)",
              }}
            >
              <SiX size={12} style={{ color: "var(--text-secondary)" }} />
            </a>
          </div>
        </div>

        <div
          className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]"
          style={{
            borderTop: "1px solid rgba(34,233,122,0.06)",
            color: "var(--text-muted)",
          }}
        >
          <p>© {year} DCSS Crypto Hub. Todos los derechos reservados.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#22E97A" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
