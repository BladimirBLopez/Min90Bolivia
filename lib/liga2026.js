import fs from "fs";
import path from "path";

export const TEMPORADA_2026 = 2026;
const DIR = path.join(process.cwd(), "data", "liga2026");

export function slug2026(t) {
  return String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const crudos = fs.existsSync(DIR)
  ? fs.readdirSync(DIR).filter((f) => /^ronda-\d+\.json$/.test(f)).flatMap((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")).events || [])
  : [];

const num = (v) => (v === null || v === undefined || v === "" ? null : Number(v));
const vistos = new Set();
const hhmm = (ts) => {
  if (!ts) return null;
  const d = new Date(ts + "Z");
  d.setUTCHours(d.getUTCHours() - 4);
  return { fecha: d.toISOString().slice(0, 10), hora: d.toISOString().slice(11, 16) };
};

export const partidos2026 = crudos
  .filter((m) => !vistos.has(m.idEvent) && vistos.add(m.idEvent))
  .map((m) => {
    const bo = hhmm(m.strTimestamp);
    return {
      id: m.idEvent,
      ronda: Number(m.intRound),
      ts: m.strTimestamp || m.dateEvent,
      fecha: bo ? bo.fecha : m.dateEvent,
      hora: bo ? bo.hora : null,
      estado: m.strStatus,
      estadio: m.strVenue || null,
      local: { id: m.idHomeTeam, nombre: m.strHomeTeam, logo: m.strHomeTeamBadge },
      visitante: { id: m.idAwayTeam, nombre: m.strAwayTeam, logo: m.strAwayTeamBadge },
      goles: { local: num(m.intHomeScore), visitante: num(m.intAwayScore) },
    };
  })
  .sort((a, b) => a.ts.localeCompare(b.ts));

const mapa = {};
partidos2026.forEach((m) => {
  [m.local, m.visitante].forEach((t) => {
    if (!mapa[t.id]) mapa[t.id] = { id: t.id, nombre: t.nombre, logo: t.logo, slug: slug2026(t.nombre) };
  });
});
export const equipos2026 = Object.values(mapa);
export const porSlug2026 = (s) => equipos2026.find((e) => e.slug === s);

const esDe = (m, id) => m.local.id === id || m.visitante.id === id;
const jugado = (m) => m.estado === "FT" && m.goles.local !== null && m.goles.visitante !== null;
const terminados = partidos2026.filter(jugado);
const pendientes = partidos2026.filter((m) => !jugado(m));

export const ultimos2026 = (id, n = 10) => terminados.filter((m) => esDe(m, id)).slice(-n).reverse();
export const proximos2026 = (id, n = 5) => pendientes.filter((m) => esDe(m, id)).slice(0, n);
export const proximosTodos2026 = (n = 8) => pendientes.slice(0, n);

export function resultado2026(m, id) {
  const loc = m.local.id === id;
  const a = loc ? m.goles.local : m.goles.visitante;
  const b = loc ? m.goles.visitante : m.goles.local;
  return a > b ? "G" : a === b ? "E" : "P";
}

const nuevo = () => ({ pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 });
const reg = (x, f, c) => {
  x.pj++; x.gf += f; x.gc += c;
  if (f > c) x.g++; else if (f === c) x.e++; else x.p++;
};

export function statsEquipo2026(id) {
  const ps = terminados.filter((m) => esDe(m, id));
  const tot = nuevo(), casa = nuevo(), fuera = nuevo();
  let cs = 0, fts = 0, btts = 0, o25 = 0;
  ps.forEach((m) => {
    const loc = m.local.id === id;
    const f = loc ? m.goles.local : m.goles.visitante;
    const c = loc ? m.goles.visitante : m.goles.local;
    reg(tot, f, c);
    reg(loc ? casa : fuera, f, c);
    if (c === 0) cs++;
    if (f === 0) fts++;
    if (f > 0 && c > 0) btts++;
    if (f + c > 2.5) o25++;
  });
  const rec = ps.slice().reverse().map((m) => resultado2026(m, id));
  let racha = { tipo: rec[0] || null, n: 0 };
  for (const r of rec) { if (r === racha.tipo) racha.n++; else break; }
  return {
    ...tot, pts: tot.g * 3 + tot.e, dif: tot.gf - tot.gc,
    casa, fuera, cs, fts, btts, o25, racha,
    forma: rec.slice(0, 5).reverse(),
    promGf: tot.pj ? tot.gf / tot.pj : 0,
    promGc: tot.pj ? tot.gc / tot.pj : 0,
  };
}

export function tabla2026() {
  return equipos2026
    .map((e) => { const s = statsEquipo2026(e.id); return { ...e, pj: s.pj, g: s.g, e: s.e, p: s.p, gf: s.gf, gc: s.gc, dif: s.dif, pts: s.pts, forma: s.forma }; })
    .sort((a, b) => b.pts - a.pts || b.dif - a.dif || b.gf - a.gf)
    .map((x, i) => ({ ...x, pos: i + 1 }));
}
export const filaDe2026 = (id) => tabla2026().find((x) => x.id === id) || null;
