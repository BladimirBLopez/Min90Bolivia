import { ImageResponse } from "next/og";
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
const fsn = (n) => (n.length <= 13 ? 44 : n.length <= 17 ? 38 : 32);

const cache = new Map();
const escudo = (slug) => {
  if (cache.has(slug)) return cache.get(slug);
  let v = null;
  try {
    const f = path.join(process.cwd(), "public", "escudos", `${slug}.png`);
    if (fs.existsSync(f)) v = "data:image/png;base64," + fs.readFileSync(f).toString("base64");
  } catch {}
  cache.set(slug, v);
  return v;
};

const col = (t) => {
  const src = escudo(t.slug);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 380 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 190, height: 190, borderRadius: 95, background: "white", border: "6px solid #C9A227" }}>
        {src ? (
          <img src={src} width={130} height={130} style={{ objectFit: "contain" }} />
        ) : (
          <div style={{ display: "flex", fontSize: 88, fontWeight: 800, color: "#C9A227" }}>{t.nombre[0]}</div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", textAlign: "center", marginTop: 14, fontSize: fsn(t.nombre), fontWeight: 800, color: "#0f172a" }}>{t.nombre}</div>
    </div>
  );
};

const pildora = { display: "flex", padding: "8px 24px", borderRadius: 999, background: "white", border: "2px solid #C9A227", fontSize: 26, fontWeight: 700, color: "#334155" };

export default async function Image({ params }) {
  const { slug } = await params;
  const [x, y] = String(slug).split("-vs-");
  const a = porSlug2026(x);
  const b = porSlug2026(y);
  const ok = !!(a && b && a.id !== b.id);

  if (!ok) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, #FDF9EC, #FFFFFF)", color: "#0f172a" }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 900 }}>Min90 Bolivia</div>
          <div style={{ display: "flex", fontSize: 38, color: "#85670F", marginTop: 12 }}>Pronósticos del fútbol boliviano</div>
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
      ? `Final · ${fmt(m.fecha)}`
      : `${fmt(m.fecha)}${m.hora ? ` · ${m.hora}` : ""} (hora de Bolivia)`
    : "Pronóstico, forma y estadísticas";
  const centro = jugado ? `${m.goles.local} - ${m.goles.visitante}` : "VS";

  let ambos = null;
  let o25 = null;
  const sa = statsEquipo2026(a.id);
  const sb = statsEquipo2026(b.id);
  if (sa.pj && sb.pj) {
    ambos = Math.round((pct(sa.btts, sa.pj) + pct(sb.btts, sb.pj)) / 2);
    o25 = Math.round((pct(sa.o25, sa.pj) + pct(sb.o25, sb.pj)) / 2);
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "linear-gradient(180deg, #FDF9EC, #FFFFFF)", color: "#0f172a" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 70, background: "#C9A227", fontSize: 28, fontWeight: 800, color: "#0f172a" }}>MIN90 BOLIVIA · PRIMERA DIVISIÓN 2026</div>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {col(ta)}
            <div style={{ display: "flex", width: 200, justifyContent: "center", fontSize: jugado ? 72 : 60, fontWeight: 900, color: jugado ? "#85670F" : "#C9A227" }}>{centro}</div>
            {col(tb)}
          </div>
          <div style={{ display: "flex", marginTop: 18, padding: "10px 34px", borderRadius: 999, background: "#0f172a", color: "#F4E19C", fontSize: 32, fontWeight: 700 }}>{linea}</div>
          {ambos !== null ? (
            <div style={{ display: "flex", marginTop: 14 }}>
              <div style={pildora}>{`Ambos marcan ${ambos}%`}</div>
              <div style={{ ...pildora, marginLeft: 16 }}>{`Más de 2.5 goles ${o25}%`}</div>
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 26 }}>
          <div style={{ display: "flex", padding: "14px 36px", borderRadius: 999, background: "#22c55e", color: "black", fontSize: 30, fontWeight: 700 }}>Cargar saldo por WhatsApp</div>
          <div style={{ display: "flex", marginLeft: 22, fontSize: 24, color: "#64748b" }}>+18 · Juega con responsabilidad</div>
        </div>
      </div>
    ),
    size
  );
}
