import fs from "fs";
import path from "path";
import { nombreSeleccion, nombreOriginalSeleccion } from "./nombresSelecciones.js";

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
        local: { id: m.idHomeTeam, nombre: slug === "nations-league-2026" ? nombreSeleccion(m.strHomeTeam) : m.strHomeTeam, logo: m.strHomeTeamBadge || null },
        visitante: { id: m.idAwayTeam, nombre: slug === "nations-league-2026" ? nombreSeleccion(m.strAwayTeam) : m.strAwayTeam, logo: m.strAwayTeamBadge || null },
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
      href: `/liga/${slug}/partido/${m.id}`,
      ambos: Math.round((pct(sa.btts, sa.pj) + pct(sb.btts, sb.pj)) / 2),
      o25: Math.round((pct(sa.o25, sa.pj) + pct(sb.o25, sb.pj)) / 2),
      pick: null,
    };
  };
  const pendientes = partidos.filter((m) => !jugado(m) && (m.fecha || "") >= corte).map(ligero);
  const terminados = partidos.filter(jugado).slice(-nTerm).reverse().map(ligero);
  return { pendientes, terminados };
}

export const slugEquipo = (n) =>
  String(nombreOriginalSeleccion(n)).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function equiposLiga(slug) {
  const mapa = {};
  cargarLiga(slug).forEach((m) => {
    [m.local, m.visitante].forEach((t) => {
      if (!mapa[t.id]) mapa[t.id] = { id: t.id, nombre: t.nombre, logo: t.logo, slug: slugEquipo(t.nombre) };
    });
  });
  return Object.values(mapa).sort((a, b) => a.nombre.localeCompare(b.nombre));
}
export const equipoPorSlug = (slug, s) => equiposLiga(slug).find((e) => e.slug === s) || null;
export const partidoPorId = (slug, id) => cargarLiga(slug).find((m) => String(m.id) === String(id)) || null;

const esDe = (m, id) => m.local.id === id || m.visitante.id === id;
export function resultadoPara(m, id) {
  const loc = m.local.id === id;
  const a = loc ? m.goles.local : m.goles.visitante;
  const b = loc ? m.goles.visitante : m.goles.local;
  return a > b ? "G" : a === b ? "E" : "P";
}

export function datosEquipo(slug, id) {
  const corte = new Date(Date.now() - 28 * 3600 * 1000).toISOString().slice(0, 10);
  const ps = cargarLiga(slug).filter((m) => esDe(m, id));
  const term = ps.filter(jugado);
  const t = { pj: term.length, g: 0, e: 0, p: 0, gf: 0, gc: 0, btts: 0, o25: 0, cs: 0 };
  term.forEach((m) => {
    const loc = m.local.id === id;
    const f = loc ? m.goles.local : m.goles.visitante;
    const c = loc ? m.goles.visitante : m.goles.local;
    t.gf += f; t.gc += c;
    if (f > c) t.g++; else if (f === c) t.e++; else t.p++;
    if (f > 0 && c > 0) t.btts++;
    if (f + c > 2.5) t.o25++;
    if (c === 0) t.cs++;
  });
  return {
    ...t, dif: t.gf - t.gc, pts: t.g * 3 + t.e,
    forma: term.slice(-5).map((m) => resultadoPara(m, id)),
    ultimos: term.slice(-10).reverse(),
    proximos: ps.filter((m) => !jugado(m) && (m.fecha || "") >= corte).slice(0, 5),
  };
}

export function h2hLiga(slug, a, b, n = 5) {
  return cargarLiga(slug)
    .filter((m) => jugado(m) && ((m.local.id === a && m.visitante.id === b) || (m.local.id === b && m.visitante.id === a)))
    .slice(-n)
    .reverse();
}
