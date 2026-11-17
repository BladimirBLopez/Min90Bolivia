import { partidos2026, equipos2026, statsEquipo2026, slug2026 } from "@/lib/liga2026";
import { EJEMPLO, estrella, pronosticos } from "@/app/data/pronosticos";
import PickCard from "@/components/PickCard";
import PartidosLista from "@/components/PartidosLista";
import { listasLiga } from "@/lib/ligas";
import { fechaActualBolivia } from "@/lib/fechaPartidos";

const pct = (x, n) => (n ? Math.round((100 * x) / n) : 0);
const jugado = (m) => m.estado === "FT" && m.goles.local !== null && m.goles.visitante !== null;
const slugDe = (id) => (equipos2026.find((e) => e.id === id) || {}).slug;
const buscar = (n) => {
  const s = slug2026(n);
  if (!s) return null;
  return equipos2026.find((e) => e.slug === s) || equipos2026.find((e) => e.slug.includes(s) || s.includes(e.slug)) || null;
};
const cruce = (partido) => {
  const [a, b] = String(partido).split(/\s+vs\s+/i);
  const ea = a && buscar(a);
  const eb = b && buscar(b);
  return ea && eb && ea.id !== eb.id ? [ea, eb] : null;
};

const ordenar = (l) => [...l].sort((x, y) => `${x.fecha || ""} ${x.hora || ""}`.localeCompare(`${y.fecha || ""} ${y.hora || ""}`)).slice(0, 60);
const seguro = (slug) => {
  try {
    return listasLiga(slug);
  } catch {
    return { pendientes: [], terminados: [] };
  }
};

export default function Partidos() {
  const cache = {};
  const stats = (id) => cache[id] || (cache[id] = statsEquipo2026(id));
  const picks = {};
  if (!EJEMPLO) {
    [estrella, ...pronosticos].forEach((p) => {
      const c = cruce(p.partido);
      if (c) {
        const k = `${c[0].id}-${c[1].id}`;
        if (!picks[k]) picks[k] = p;
      }
    });
  }
  const usados = new Set();
  const ligero = (m) => {
    const sa = stats(m.local.id);
    const sb = stats(m.visitante.id);
    const k = `${m.local.id}-${m.visitante.id}`;
    let pick = null;
    if (!jugado(m) && picks[k] && !usados.has(k)) {
      usados.add(k);
      const p = picks[k];
      pick = { pick: p.pick, cuota: p.cuota, confianza: p.confianza, analisis: p.analisis || null, mercado: p.mercado || null };
    }
    return {
      id: m.id, fecha: m.fecha, hora: m.hora || null, ronda: m.ronda, estadio: m.estadio || null,
      goles: { local: m.goles.local, visitante: m.goles.visitante },
      local: { nombre: m.local.nombre, logo: m.local.logo || null },
      visitante: { nombre: m.visitante.nombre, logo: m.visitante.logo || null },
      slug: `${slugDe(m.local.id)}-vs-${slugDe(m.visitante.id)}`,
      ambos: Math.round((pct(sa.btts, sa.pj) + pct(sb.btts, sb.pj)) / 2),
      o25: Math.round((pct(sa.o25, sa.pj) + pct(sb.o25, sb.pj)) / 2),
      pick,
    };
  };
  const hoyBolivia = fechaActualBolivia();
  const pendientes = partidos2026
    .filter((m) => !jugado(m) && m.fecha >= hoyBolivia)
    .map(ligero);
  const terminados = partidos2026.filter(jugado).slice(-10).reverse().map(ligero);
  const ce = !EJEMPLO && estrella ? cruce(estrella.partido) : null;
  const brasil = seguro("brasil-2026");
  const nations = seguro("nations-league-2026");
  const ligas = [
    { k: "bolivia", nombre: "Bolivia", pendientes: ordenar(pendientes), terminados },
    { k: "brasil", nombre: "Brasil", pendientes: ordenar(brasil.pendientes.filter((m) => m.fecha >= hoyBolivia)), terminados: brasil.terminados },
    { k: "nations", nombre: "Nations League", pendientes: ordenar(nations.pendientes.filter((m) => m.fecha >= hoyBolivia)), terminados: nations.terminados },
  ].filter((x) => x.pendientes.length || x.terminados.length);
  const etiquetar = (lista, nombre) => lista.map((m) => ({ ...m, liga: nombre }));
  const clave = (m) => `${m.fecha || ""} ${m.hora || ""}`;
  const proximos = ligas.flatMap((x) => etiquetar(x.pendientes, x.nombre)).sort((p, q) => clave(p).localeCompare(clave(q))).slice(0, 80);
  const recientes = ligas.flatMap((x) => etiquetar(x.terminados, x.nombre)).sort((p, q) => clave(q).localeCompare(clave(p))).slice(0, 16);

  return (
    <section id="pronosticos" className="mx-auto max-w-5xl px-5 py-10">
      <h2 className="mb-1 text-2xl font-extrabold tracking-tight titulo-oro">Partidos y pronósticos</h2>
      <p className="mb-4 text-sm text-slate-600">Próximos partidos de Bolivia, Brasil y Nations League · hora de Bolivia. Los pronósticos Min90 aparecen en el partido que corresponde.</p>
      {!EJEMPLO && estrella ? (
        <div className="mb-6">
          <PickCard p={{ ...estrella, href: ce ? `/partido/${ce[0].slug}-vs-${ce[1].slug}` : null }} grande />
        </div>
      ) : null}
      <PartidosLista pendientes={proximos} terminados={recientes} />
    </section>
  );
}
