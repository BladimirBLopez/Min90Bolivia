import { ImageResponse } from "next/og";

export const conSocial = (m) => ({
  ...m,
  openGraph: { title: m.title, description: m.description, type: "website", locale: "es_BO", siteName: "Min90 Bolivia" },
  twitter: { card: "summary_large_image", title: m.title, description: m.description },
});

const SIZE = { width: 1200, height: 630 };
const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => {
  const [y, m, d] = String(f).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} ${MESES[m - 1]}`;
};
const tam = (n) => (n.length <= 13 ? 62 : n.length <= 17 ? 52 : n.length <= 20 ? 44 : 36);
const fondo = { width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "linear-gradient(135deg, #0b1220, #172554)", color: "white" };
const barra = { display: "flex", width: "100%", height: 14, background: "#C9A227" };

async function img(url) {
  if (!url) return null;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const t = (r.headers.get("content-type") || "").split(";")[0];
    if (r.ok && /^image\/(png|jpeg|jpg)$/.test(t)) {
      return `data:${t};base64,` + Buffer.from(await r.arrayBuffer()).toString("base64");
    }
  } catch {}
  return null;
}

const cabecera = (derecha) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 48px 0 48px" }}>
    <div style={{ display: "flex", fontSize: 40, fontWeight: 900, color: "#F4E19C" }}>MIN90 BOLIVIA</div>
    <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#CBD5E1" }}>{derecha}</div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 74, height: 74, borderRadius: 37, border: "5px solid white", fontSize: 30, fontWeight: 900, color: "white" }}>+18</div>
  </div>
);

const circulo = (nombre, src, t) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: t, height: t, borderRadius: t / 2, background: "white", border: "8px solid #C9A227" }}>
    {src ? (
      <img src={src} width={Math.round(t * 0.68)} height={Math.round(t * 0.68)} style={{ objectFit: "contain" }} />
    ) : (
      <div style={{ display: "flex", fontSize: Math.round(t * 0.48), fontWeight: 900, color: "#C9A227" }}>{String(nombre)[0]}</div>
    )}
  </div>
);

const pastilla = (txt, size) => (
  <div style={{ display: "flex", marginTop: 22, padding: "10px 52px", borderRadius: 999, background: "#C9A227", color: "#0b1220", fontSize: size, fontWeight: 900 }}>{txt}</div>
);

export function imagenGenerica(sub) {
  return new ImageResponse(
    (
      <div style={{ ...fondo, alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", fontSize: 108, fontWeight: 900, color: "white" }}>Min90 Bolivia</div>
        <div style={{ display: "flex", fontSize: 44, color: "#F4E19C", marginTop: 12 }}>{sub || "Pronósticos del fútbol boliviano"}</div>
      </div>
    ),
    SIZE
  );
}

export async function imagenPartido(m, liga) {
  const [sa, sb] = await Promise.all([img(m.local.logo), img(m.visitante.logo)]);
  const jug = m.estado === "FT" && m.goles && m.goles.local !== null && m.goles.visitante !== null;
  const centro = jug ? `${m.goles.local} - ${m.goles.visitante}` : "VS";
  const linea = ((jug ? "FINAL · " : "") + fmt(m.fecha) + (!jug && m.hora ? ` · ${m.hora}` : "")).toUpperCase();
  const col = (t, src) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 420 }}>
      <div style={{ display: "flex", borderRadius: 100, boxShadow: "0 0 70px rgba(201,162,39,0.55)" }}>
        {circulo(t.nombre, src, 190)}
      </div>
      <div style={{ display: "flex", justifyContent: "center", textAlign: "center", marginTop: 12, fontSize: tam(t.nombre), fontWeight: 900, color: "white" }}>{t.nombre}</div>
    </div>
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", color: "white", background: "linear-gradient(160deg, #050a14 0%, #0d1a3a 40%, #172554 70%, #0a1020 100%)" }}>
        <div style={{ display: "flex", position: "absolute", top: -220, left: 300, width: 600, height: 600, borderRadius: 300, background: "radial-gradient(circle, rgba(201,162,39,0.30) 0%, rgba(201,162,39,0) 70%)" }} />
        <div style={{ display: "flex", position: "absolute", bottom: -260, right: -120, width: 560, height: 560, borderRadius: 280, background: "radial-gradient(circle, rgba(37,99,235,0.35) 0%, rgba(37,99,235,0) 70%)" }} />
        <div style={barra} />
        {cabecera(`${liga.nombre} ${liga.temporada}`.toUpperCase())}
        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
            {col(m.local, sa)}
            <div style={{ display: "flex", width: 260, height: 190, alignItems: "center", justifyContent: "center", fontSize: jug ? 88 : 96, fontWeight: 900, color: "#E8C547" }}>{centro}</div>
            {col(m.visitante, sb)}
          </div>
          {pastilla(linea, 44)}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 84, background: "linear-gradient(90deg, #16a34a 0%, #22c55e 50%, #16a34a 100%)", color: "#052e16", fontSize: 30, fontWeight: 900 }}>RECARGA METABET AL INSTANTE · PAGO POR QR · 24 H</div>
        <div style={barra} />
      </div>
    ),
    SIZE
  );
}

export function imagenEquipoBase({ nombre, src, liga, sub }) {
  return new ImageResponse(
    (
      <div style={fondo}>
        <div style={barra} />
        {cabecera(String(liga).toUpperCase())}
        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {circulo(nombre, src, 250)}
          <div style={{ display: "flex", justifyContent: "center", textAlign: "center", marginTop: 18, fontSize: tam(nombre) + 14, fontWeight: 900, color: "white" }}>{nombre}</div>
          {pastilla(String(sub).toUpperCase(), 40)}
        </div>
        <div style={barra} />
      </div>
    ),
    SIZE
  );
}

export async function imagenEquipo(e, liga) {
  const src = await img(e.logo);
  return imagenEquipoBase({ nombre: e.nombre, src, liga: `${liga.nombre} ${liga.temporada}`, sub: "Partidos, forma y estadísticas" });
}

export function imagenLiga(l) {
  if (!l) return imagenGenerica();
  return new ImageResponse(
    (
      <div style={fondo}>
        <div style={barra} />
        {cabecera(String(l.pais).toUpperCase())}
        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 60px" }}>
          <div style={{ display: "flex", justifyContent: "center", textAlign: "center", fontSize: l.nombre.length <= 20 ? 92 : 70, fontWeight: 900, color: "white" }}>{l.nombre}</div>
          {pastilla(`TEMPORADA ${l.temporada}`, 46)}
          <div style={{ display: "flex", marginTop: 26, fontSize: 36, fontWeight: 700, color: "#CBD5E1" }}>{l.tabla ? "Partidos, resultados y tabla" : "Partidos y resultados"}</div>
        </div>
        <div style={barra} />
      </div>
    ),
    SIZE
  );
}
