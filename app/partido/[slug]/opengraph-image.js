import { ImageResponse } from "next/og";
import { porSlug2026, partidoEntre2026 } from "@/lib/liga2026";

export const alt = "Pronóstico del partido | Min90 Bolivia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => {
  const [y, m, d] = String(f).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} ${MESES[m - 1]}`;
};

export default async function Image({ params }) {
  const { slug } = await params;
  const [x, y] = String(slug).split("-vs-");
  const a = porSlug2026(x);
  const b = porSlug2026(y);
  const ok = !!(a && b && a.id !== b.id);
  const m = ok ? partidoEntre2026(a.id, b.id) || partidoEntre2026(b.id, a.id) : null;

  const n1 = m ? m.local.nombre : ok ? a.nombre : "Min90 Bolivia";
  const n2 = m ? m.visitante.nombre : ok ? b.nombre : null;
  let linea = ok ? "Pronóstico, forma y estadísticas" : "Pronósticos del fútbol boliviano";
  if (m) {
    const jugado = m.estado === "FT" && m.goles.local !== null && m.goles.visitante !== null;
    linea = jugado
      ? `Final ${m.goles.local} - ${m.goles.visitante} · ${fmt(m.fecha)}`
      : `${fmt(m.fecha)}${m.hora ? ` · ${m.hora}` : ""} (hora de Bolivia)`;
  }
  const fs = Math.max(n1.length, n2 ? n2.length : 0) > 18 ? 68 : 88;

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
          padding: "48px 60px",
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
          <div style={{ display: "flex", fontSize: fs, fontWeight: 800 }}>{n1}</div>
          {n2 ? <div style={{ display: "flex", fontSize: 40, color: "#22c55e", margin: "8px 0" }}>VS</div> : null}
          {n2 ? <div style={{ display: "flex", fontSize: fs, fontWeight: 800 }}>{n2}</div> : null}
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#cbd5e1" }}>{linea}</div>
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
