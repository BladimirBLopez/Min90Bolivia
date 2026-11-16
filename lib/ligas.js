import fs from "fs";
import path from "path";

const BASE = path.join(process.cwd(), "data", "ligas");

export const LIGAS = [
  { slug: "brasil-2026", nombre: "Brasileirão Serie A", pais: "Brasil", temporada: "2026", tabla: true },
  { slug: "nations-league-2026", nombre: "UEFA Nations League", pais: "Selecciones de Europa", temporada: "2026-27", tabla: false },
];
export const ligaPorSlug = (s) => LIGAS.find((l) => l.slug === s) || null;

const num = (v) => (v === null || v === undefined || v === "" ? null : Number(v));
const hhmm = (ts) => {
  if (!ts) return null;
  const d = new Date(ts + "Z");
  if (Number.isNaN(d.getTime())) return null;
  d.setUTCHours(d.getUTCHours() - 4);
  return { fecha: d.toISOString().slice(0, 10), hora: d.toISOString().slice(11, 16) };
};

const cache = {};
export function cargarLiga(slug) {
  if (cache[slug]) return cache[slug];
  const dir = path.join(BASE, slug);
  const archivos = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^ronda-\d+\.json$/.test(f)) : [];
  const vistos = new Set();
  const partidos = archivos
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")).events || [])
    .filter((m) => !vistos.has(m.idEvent) && vistos.add(m.idEvent))
    .map((m) => {
      const bo = hhmm(m.strTimestamp);
      return {
        id: m.idEvent,
        ronda: Number(m.intRound),
        ts: m.strTimestamp || m.dateEvent || "",
        fecha: bo ? bo.fecha : m.dateEvent,
        hora: bo ? bo.hora : null,
        estado: m.strStatus,
        estadio: m.strVenue || null,
        local: { id: m.idHomeTeam, nombre: m.strHomeTeam, logo: m.strHomeTeamBadge || null },
        visitante: { id: m.idAwayTeam, nombre: m.strAwayTeam, logo: m.strAwayTeamBadge || null },
        goles: { local: num(m.intHomeScore), visitante: num(m.intAwayScore) },
      };
    })
    .sort((a, b) => a.ts.localeCompare(b.ts));
  cache[slug] = partidos;
  return partidos;
}

export const jugado = (m) => m.estado === "FT" && m.goles.local !== null && m.goles.visitante !== null;

function statsLiga(partidos) {
  const t = {};
  const get = (e) => t[e.id] || (t[e.id] = { id: e.id, nombre: e.nombre, logo: e.logo, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, btts: 0, o25: 0 });
  partidos.forEach((m) => {
    const a = get(m.local);
    const b = get(m.visitante);
    if (!jugado(m)) return;
    [[a, m.goles.local, m.goles.visitante], [b, m.goles.visitante, m.goles.local]].forEach(([x, f, c]) => {
      x.pj++; x.gf += f; x.gc += c;
      if (f > c) x.g++; else if (f === c) x.e++; else x.p++;
      if (f > 0 && c > 0) x.btts++;
      if (f + c > 2.5) x.o25++;
    });
  });
  return t;
}

export function tablaLiga(slug) {
  return Object.values(statsLiga(cargarLiga(slug)))
    .map((x) => ({ ...x, dif: x.gf - x.gc, pts: x.g * 3 + x.e }))
    .sort((a, b) => b.pts - a.pts || b.dif - a.dif || b.gf - a.gf)
    .map((x, i) => ({ ...x, pos: i + 1 }));
}

const pct = (x, n) => (n ? Math.round((100 * x) / n) : 0);

export function listasLiga(slug, nTerm = 12) {
  const partidos = cargarLiga(slug);
  const st = statsLiga(partidos);
  const vacio = { pj: 0, btts: 0, o25: 0 };
  const corte = new Date(Date.now() - 28 * 3600 * 1000).toISOString().slice(0, 10);
  const ligero = (m) => {
    const sa = st[m.local.id] || vacio;
    const sb = st[m.visitante.id] || vacio;
    return {
      id: m.id, fecha: m.fecha, hora: m.hora, ronda: m.ronda, estadio: m.estadio,
      goles: m.goles,
      local: { nombre: m.local.nombre, logo: m.local.logo },
      visitante: { nombre: m.visitante.nombre, logo: m.visitante.logo },
      slug: null,
      ambos: Math.round((pct(sa.btts, sa.pj) + pct(sb.btts, sb.pj)) / 2),
      o25: Math.round((pct(sa.o25, sa.pj) + pct(sb.o25, sb.pj)) / 2),
      pick: null,
    };
  };
  const pendientes = partidos.filter((m) => !jugado(m) && (m.fecha || "") >= corte).map(ligero);
  const terminados = partidos.filter(jugado).slice(-nTerm).reverse().map(ligero);
  return { pendientes, terminados };
}
