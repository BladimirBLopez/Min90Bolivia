import { ImageResponse } from "next/og";
import CanchaFondo from "@/lib/ogCancha";

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
const fondo = { width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative", background: "#103522", color: "white" };
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
        <CanchaFondo />
        <div style={{ display: "flex", fontSize: 108, fontWeight: 900, color: "white" }}>Min90 Bolivia</div>
        <div style={{ display: "flex", fontSize: 44, color: "#F4E19C", marginTop: 12 }}>{sub || "Pronósticos del fútbol boliviano"}</div>
      </div>
    ),
    SIZE
  );
}

async function cargarFuente(texto) {
  try {
    const letras = Array.from(new Set(texto)).join("");
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&text=${encodeURIComponent(letras)}`, { signal: AbortSignal.timeout(4000) })).text();
    const url = (css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/) || [])[1];
    if (!url) return null;
    const r = await fetch(url, { signal: AbortSignal.timeout(4000) });
    return r.ok ? await r.arrayBuffer() : null;
  } catch {
    return null;
  }
}

const tam2 = (n) => (n.length <= 12 ? 70 : n.length <= 16 ? 60 : n.length <= 21 ? 50 : 42);

export async function imagenPartido(m, liga) {
  const [sa, sb] = await Promise.all([img(m.local.logo), img(m.visitante.logo)]);
  const jug = m.estado === "FT" && m.goles && m.goles.local !== null && m.goles.visitante !== null;
  const centro = jug ? `${m.goles.local} - ${m.goles.visitante}` : "VS";
  const linea = ((jug ? "FINAL · " : "") + fmt(m.fecha) + (!jug && m.hora ? ` · ${m.hora}` : "")).toUpperCase();
  const CTA = "RECARGA METABET AL INSTANTE · PAGO POR QR · 24 H";
  const nl = String(m.local.nombre).toUpperCase();
  const nv = String(m.visitante.nombre).toUpperCase();
  const cab = `${liga.nombre} ${liga.temporada}`.toUpperCase();
  const fuente = await cargarFuente(`${nl}${nv}${linea}${centro}${cab}${CTA}MIN90 BOLIVIA +18 VS ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ·+-:.,ÁÉÍÓÚÑÜ`);
  const escudo = (nombre, src) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 300, height: 230, background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 68%)" }}>
      {src ? (
        <img src={src} width={190} height={190} style={{ objectFit: "contain" }} />
      ) : (
        <div style={{ display: "flex", fontSize: 150, fontWeight: 800, color: "#C9A227" }}>{String(nombre)[0]}</div>
      )}
    </div>
  );
  const col = (nombre, src) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 440 }}>
      {escudo(nombre, src)}
      <div style={{ display: "flex", justifyContent: "center", textAlign: "center", marginTop: 4, fontSize: tam2(nombre), fontWeight: 800, letterSpacing: 1, color: "white" }}>{nombre}</div>
    </div>
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", color: "white", fontFamily: "Barlow Condensed", position: "relative", background: "#103522" }}>
        <CanchaFondo />
        <div style={barra} />
        {cabecera(cab)}
        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
            {col(nl, sa)}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 240, height: 230 }}>
              <div style={{ display: "flex", width: 4, height: 50, background: "#C9A227" }} />
              <div style={{ display: "flex", fontSize: jug ? 84 : 96, fontWeight: 800, color: "#E8C547", margin: "6px 0" }}>{centro}</div>
              <div style={{ display: "flex", width: 4, height: 50, background: "#C9A227" }} />
            </div>
            {col(nv, sb)}
          </div>
          <div style={{ display: "flex", marginTop: 14, padding: "8px 48px", borderRadius: 999, background: "linear-gradient(90deg, #B8901F, #E8C547, #B8901F)", color: "#0b1220", fontSize: 40, fontWeight: 800, letterSpacing: 2 }}>{linea}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 84, background: "linear-gradient(90deg, #15803d 0%, #22c55e 50%, #15803d 100%)", color: "#052e16", fontSize: 38, fontWeight: 800, letterSpacing: 1 }}>{CTA}</div>
        <div style={barra} />
      </div>
    ),
    { ...SIZE, fonts: fuente ? [{ name: "Barlow Condensed", data: fuente, weight: 800, style: "normal" }] : undefined }
  );
}

export function imagenEquipoBase({ nombre, src, liga, sub }) {
  return new ImageResponse(
    (
      <div style={fondo}>
        <CanchaFondo />
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
        <CanchaFondo />
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
