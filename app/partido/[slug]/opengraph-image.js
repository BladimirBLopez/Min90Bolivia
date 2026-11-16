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

const col = (t, src) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 420 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 210, height: 210, borderRadius: 105, background: "white", border: "8px solid #C9A227" }}>
      {src ? (
        <img src={src} width={140} height={140} style={{ objectFit: "contain" }} />
      ) : (
        <div style={{ display: "flex", fontSize: 100, fontWeight: 900, color: "#C9A227" }}>{t.nombre[0]}</div>
      )}
    </div>
    <div style={{ display: "flex", justifyContent: "center", textAlign: "center", marginTop: 12, fontSize: fsn(t.nombre), fontWeight: 900, color: "#0f172a" }}>{t.nombre}</div>
  </div>
);

const pildora = { display: "flex", padding: "8px 26px", borderRadius: 999, background: "white", border: "3px solid #C9A227", fontSize: 30, fontWeight: 800, color: "#334155" };

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
          <div style={{ display: "flex", fontSize: 104, fontWeight: 900 }}>Min90 Bolivia</div>
          <div style={{ display: "flex", fontSize: 42, color: "#85670F", marginTop: 12 }}>Pronósticos del fútbol boliviano</div>
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
  const [srcA, srcB] = await Promise.all([escudo(ta.slug), escudo(tb.slug)]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "linear-gradient(180deg, #FDF9EC, #FFFFFF)", color: "#0f172a" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 84, background: "#C9A227", fontSize: 36, fontWeight: 900, color: "#0f172a" }}>MIN90 BOLIVIA · PRIMERA DIVISIÓN 2026</div>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {col(ta, srcA)}
            <div style={{ display: "flex", width: 240, justifyContent: "center", fontSize: jugado ? 84 : 76, fontWeight: 900, color: jugado ? "#85670F" : "#C9A227" }}>{centro}</div>
            {col(tb, srcB)}
          </div>
          <div style={{ display: "flex", marginTop: 14, padding: "10px 40px", borderRadius: 999, background: "#0f172a", color: "#F4E19C", fontSize: 38, fontWeight: 800 }}>{linea}</div>
          {ambos !== null ? (
            <div style={{ display: "flex", marginTop: 14 }}>
              <div style={pildora}>{`Ambos marcan ${ambos}%`}</div>
              <div style={{ ...pildora, marginLeft: 16 }}>{`Más de 2.5 goles ${o25}%`}</div>
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 22 }}>
          <div style={{ display: "flex", padding: "14px 40px", borderRadius: 999, background: "#22c55e", color: "black", fontSize: 36, fontWeight: 800 }}>Cargar saldo por WhatsApp</div>
          <div style={{ display: "flex", marginLeft: 22, fontSize: 26, color: "#64748b" }}>+18 · Juega con responsabilidad</div>
        </div>
      </div>
    ),
    size
  );
}
