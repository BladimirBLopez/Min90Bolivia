import { ImageResponse } from "next/og";
import CanchaFondo from "@/lib/ogCancha";
import BadgeVivo from "@/lib/ogBadgeVivo";
import fs from "fs";
import path from "path";
import { porSlug2026, partidoEntre2026, statsEquipo2026 } from "@/lib/liga2026";

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
const pct = (x, n) => (n ? Math.round((100 * x) / n) : 0);
const fsn = (n) => (n.length <= 13 ? 54 : n.length <= 17 ? 46 : n.length <= 20 ? 38 : 32);

const base = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null;
const cache = new Map();
async function escudo(slug) {
  if (cache.has(slug)) return cache.get(slug);
  let v = null;
  try {
    const f = path.join(process.cwd(), "public", "escudos", `${slug}.png`);
    if (fs.existsSync(f)) v = "data:image/png;base64," + fs.readFileSync(f).toString("base64");
  } catch {}
  if (!v && base) {
    try {
      const r = await fetch(`${base}/escudos/${slug}.png`, { signal: AbortSignal.timeout(5000) });
      if (r.ok && (r.headers.get("content-type") || "").startsWith("image")) {
        v = "data:image/png;base64," + Buffer.from(await r.arrayBuffer()).toString("base64");
      }
    } catch {}
  }
  if (v) cache.set(slug, v);
  return v;
}

const tam = (n) => (n.length <= 13 ? 62 : n.length <= 17 ? 52 : n.length <= 20 ? 44 : 36);
const fondo = { width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative", background: "#103522", color: "white" };
const barra = { display: "flex", width: "100%", height: 14, background: "#C9A227" };

const col = (t, src) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 420 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 210, height: 210, borderRadius: 105, background: "white", border: "8px solid #C9A227" }}>
      {src ? (
        <img src={src} width={144} height={144} style={{ objectFit: "contain" }} />
      ) : (
        <div style={{ display: "flex", fontSize: 100, fontWeight: 900, color: "#C9A227" }}>{t.nombre[0]}</div>
      )}
    </div>
    <div style={{ display: "flex", justifyContent: "center", textAlign: "center", marginTop: 14, fontSize: tam(t.nombre), fontWeight: 900, color: "white" }}>{t.nombre}</div>
  </div>
);

export default async function Image({ params }) {
  const { slug } = await params;
  const [x, y] = String(slug).split("-vs-");
  const a = porSlug2026(x);
  const b = porSlug2026(y);
  const ok = !!(a && b && a.id !== b.id);

  if (!ok) {
    return new ImageResponse(
      (
        <div style={{ ...fondo, alignItems: "center", justifyContent: "center" }}>
          <CanchaFondo />
          <BadgeVivo size={40} />
          <div style={{ display: "flex", fontSize: 44, color: "#F4E19C", marginTop: 12 }}>Pronósticos del fútbol boliviano</div>
        </div>
      ),
      size
    );
  }

  const m = partidoEntre2026(a.id, b.id) || partidoEntre2026(b.id, a.id);
  const invertido = !!m && m.local.id === b.id;
  const ta = invertido ? b : a;
  const tb = invertido ? a : b;
  const jugado = !!m && m.estado === "FT" && m.goles.local !== null && m.goles.visitante !== null;
  const linea = m
    ? jugado
      ? `FINAL · ${fmt(m.fecha)}`
      : `${fmt(m.fecha)}${m.hora ? ` · ${m.hora}` : ""}`
    : "Pronóstico, forma y estadísticas";
  const centro = jugado ? `${m.goles.local} - ${m.goles.visitante}` : "VS";
  const [srcA, srcB] = await Promise.all([escudo(ta.slug), escudo(tb.slug)]);

  return new ImageResponse(
    (
      <div style={fondo}>
        <CanchaFondo />
        <div style={barra} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 48px 0 48px" }}>
          <BadgeVivo size={28} />
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#CBD5E1" }}>PRIMERA DIVISIÓN 2026</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 74, height: 74, borderRadius: 37, border: "5px solid white", fontSize: 30, fontWeight: 900, color: "white" }}>+18</div>
        </div>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
            {col(ta, srcA)}
            <div style={{ display: "flex", width: 280, height: 210, alignItems: "center", justifyContent: "center", fontSize: jugado ? 92 : 100, fontWeight: 900, color: "#D4AF37" }}>{centro}</div>
            {col(tb, srcB)}
          </div>
          <div style={{ display: "flex", marginTop: 22, padding: "10px 52px", borderRadius: 999, background: "#C9A227", color: "#0b1220", fontSize: 50, fontWeight: 900 }}>{linea.toUpperCase()}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 24, fontSize: 32, fontWeight: 700, color: "#CBD5E1" }}>Pronóstico, forma y cara a cara</div>
        <div style={barra} />
      </div>
    ),
    size
  );
}
