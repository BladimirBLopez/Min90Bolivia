import fs from "fs";
import path from "path";

export const TEMPORADA = 2024;
export const DE_PRUEBA = true;

const DIR = path.join(process.cwd(), "data", "liga");
const leer = (n) => JSON.parse(fs.readFileSync(path.join(DIR, n), "utf8"));

export function slugify(t) {
  return String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const equipos = leer(`equipos-${TEMPORADA}.json`).map((e) => ({ ...e, slug: slugify(e.nombre) }));
export const porId = (id) => equipos.find((e) => e.id === id);
export const porSlug = (s) => equipos.find((e) => e.slug === s);
export function buscarEquipo(nombre) {
  const s = slugify(nombre);
  if (!s) return null;
  return equipos.find((e) => e.slug === s) || equipos.find((e) => e.slug.includes(s) || s.includes(e.slug)) || null;
}

const todos = [TEMPORADA, TEMPORADA - 1, TEMPORADA - 2]
  .filter((s) => fs.existsSync(path.join(DIR, `partidos-${s}.json`)))
  .flatMap((s) => leer(`partidos-${s}.json`).map((m) => ({ ...m, temporada: s })));
const terminados = todos
  .filter((m) => m.estado === "FT" && m.goles.local != null && m.goles.visitante != null)
  .sort((a, b) => b.fecha.localeCompare(a.fecha));

export const partidosDe = (id, temporada) =>
  terminados.filter((m) => (m.local.id === id || m.visitante.id === id) && (!temporada || m.temporada === temporada));

export function resultado(m, id) {
  const loc = m.local.id === id;
  const a = loc ? m.goles.local : m.goles.visitante;
  const b = loc ? m.goles.visitante : m.goles.local;
  return a > b ? "G" : a === b ? "E" : "P";
}
export const ultimos = (id, n = 5) => partidosDe(id).slice(0, n);

export function h2h(a, b, n = 5) {
  return terminados
    .filter((m) => (m.local.id === a && m.visitante.id === b) || (m.local.id === b && m.visitante.id === a))
    .slice(0, n);
}

export function statsEquipo(id) {
  const ps = partidosDe(id, TEMPORADA);
  const n = ps.length || 1;
  let g = 0, e = 0, p = 0, gf = 0, gc = 0, cs = 0, btts = 0, o25 = 0;
  ps.forEach((m) => {
    const loc = m.local.id === id;
    const f = loc ? m.goles.local : m.goles.visitante;
    const c = loc ? m.goles.visitante : m.goles.local;
    gf += f; gc += c;
    if (f > c) g++; else if (f === c) e++; else p++;
    if (c === 0) cs++;
    if (f > 0 && c > 0) btts++;
    if (f + c > 2.5) o25++;
  });
  const pct = (x) => Math.round((x / n) * 100);
  return { pj: ps.length, g, e, p, gfTotal: gf, gcTotal: gc, gf: +(gf / n).toFixed(2), gc: +(gc / n).toFixed(2), sinGol: pct(cs), ambos: pct(btts), mas25: pct(o25) };
}

const filas = leer(`tabla-${TEMPORADA}.json`)[0].league.standings[0];
export const tabla = filas.map((x) => {
  const s = statsEquipo(x.team.id);
  return { pos: x.rank, id: x.team.id, equipo: x.team.name, pj: s.pj, g: s.g, e: s.e, p: s.p, gf: s.gfTotal, gc: s.gcTotal, dg: s.gfTotal - s.gcTotal, pts: x.points };
});
export const tablaSimple = tabla.map((t) => ({
  ...t,
  slug: (porId(t.id) || {}).slug || slugify(t.equipo),
  dg: t.dg > 0 ? "+" + t.dg : String(t.dg),
}));
export const filaDe = (id) => tabla.find((t) => t.id === id);

export function rutaPartido(nombre) {
  const [a, b] = String(nombre).split(/\s+vs\s+/i);
  const ea = a && buscarEquipo(a);
  const eb = b && buscarEquipo(b);
  return ea && eb && ea.id !== eb.id ? `/partido/${ea.slug}-vs-${eb.slug}` : null;
}
export function parseSlugPartido(slug) {
  const [a, b] = String(slug).split("-vs-");
  const ea = porSlug(a);
  const eb = porSlug(b);
  return ea && eb ? [ea, eb] : null;
}
export const pares = equipos.flatMap((a) => equipos.filter((b) => b.id !== a.id).map((b) => `${a.slug}-vs-${b.slug}`));
