import { ImageResponse } from "next/og";
import { porSlug2026, filaDe2026, statsEquipo2026, proximos2026, tabla2026 } from "@/lib/liga2026";

export const alt = "Equipo | Min90 Bolivia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => {
  const [y, m, d] = String(f).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} ${MESES[m - 1]}`;
};
const colores = { G: "#22c55e", E: "#eab308", P: "#ef4444" };

export default async function Image({ params }) {
  const { slug } = await params;
  const e = porSlug2026(slug);
  const f = e ? filaDe2026(e.id) : null;
  const s = e ? statsEquipo2026(e.id) : null;
  const total = e ? tabla2026().length : 0;
  const prox = e ? proximos2026(e.id, 1)[0] : null;
  const nombre = e ? e.nombre : "Min90 Bolivia";
  const tam = nombre.length > 18 ? 84 : 110;
  const forma = s && Array.isArray(s.forma) ? s.forma.slice(0, 6) : [];
  const linea1 = f ? `Puesto ${f.pos} de ${total} · ${f.pts} pts · ${f.pj} partidos` : "Pronósticos del fútbol boliviano";
  let linea2 = "Tabla, forma y próximos partidos 2026";
  if (prox) {
    const rival = prox.local.id === e.id ? prox.visitante.nombre : prox.local.nombre;
    linea2 = `Próximo: vs ${rival} · ${fmt(prox.fecha)}${prox.hora ? `, ${prox.hora}` : ""}`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "44px 60px",
          background: "linear-gradient(135deg, #052e16, #0f172a)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800 }}>
          <span>Min</span>
          <span style={{ color: "#22c55e" }}>90</span>
          <span style={{ marginLeft: 12 }}>Bolivia</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ display: "flex", fontSize: tam, fontWeight: 800 }}>{nombre}</div>
          <div style={{ display: "flex", fontSize: 38, color: "#22c55e", marginTop: 8 }}>{linea1}</div>
          {forma.length > 0 ? (
            <div style={{ display: "flex", marginTop: 22 }}>
              {forma.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    marginLeft: i ? 12 : 0,
                    background: colores[r] || "#64748b",
                    color: r === "P" ? "white" : "black",
                    fontSize: 30,
                    fontWeight: 800,
                  }}
                >
                  {r}
                </div>
              ))}
            </div>
          ) : null}
          <div style={{ display: "flex", fontSize: 32, color: "#cbd5e1", marginTop: 22 }}>{linea2}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              padding: "14px 36px",
              borderRadius: 999,
              background: "#22c55e",
              color: "black",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            Cargar saldo por WhatsApp
          </div>
          <div style={{ display: "flex", marginLeft: 24, fontSize: 26, color: "#94a3b8" }}>+18 · Juega con responsabilidad</div>
        </div>
      </div>
    ),
    size
  );
}
