import Link from "next/link";
import { notFound } from "next/navigation";
import { conSocial } from "@/lib/ogLiga";
import Navbar from "@/components/Navbar";
import CtaRecarga from "@/components/CtaRecarga";
import EscudoLiga from "@/components/EscudoLiga";
import FormaLiga from "@/components/FormaLiga";
import { ligaPorSlug, equipoPorSlug, datosEquipo, tablaLiga, jugado } from "@/lib/ligas";

export const revalidate = 3600;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => {
  const [y, m, d] = String(f).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} ${MESES[m - 1]}`;
};
const pct = (x, n) => (n ? Math.round((100 * x) / n) : 0);
const sign = (n) => (n > 0 ? `+${n}` : `${n}`);
const box = "rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white shadow-md shadow-slate-200/70";

export async function generateMetadata({ params }) {
  const { slug, equipo } = await params;
  const l = ligaPorSlug(slug);
  const e = l && equipoPorSlug(slug, equipo);
  if (!e) return {};
  return conSocial({
    title: `${e.nombre}: partidos y estadísticas ${l.nombre} ${l.temporada} | Min90 Bolivia`,
    description: `Resultados, forma y próximos partidos de ${e.nombre} en ${l.nombre} ${l.temporada}, con hora de Bolivia.`,
  });
}

function Fila({ m, slug, id }) {
  const fin = jugado(m);
  return (
    <Link href={`/liga/${slug}/partido/${m.id}`} className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm first:border-t-0 hover:bg-oro-50">
      <span className="w-20 shrink-0 text-xs text-slate-500">{fmt(m.fecha)}{m.hora ? <span className="block">{m.hora}</span> : null}</span>
      <span className="min-w-0 flex-1 truncate">
        <span className={m.local.id === id ? "font-bold" : ""}>{m.local.nombre}</span>
        <span className="text-slate-400"> vs </span>
        <span className={m.visitante.id === id ? "font-bold" : ""}>{m.visitante.nombre}</span>
      </span>
      <span className="shrink-0 font-bold text-oro-700">{fin ? `${m.goles.local}-${m.goles.visitante}` : `R${m.ronda}`}</span>
    </Link>
  );
}

export default async function EquipoLiga({ params }) {
  const { slug, equipo } = await params;
  const liga = ligaPorSlug(slug);
  if (!liga) notFound();
  const e = equipoPorSlug(slug, equipo);
  if (!e) notFound();
  const s = datosEquipo(slug, e.id);
  const fila = liga.tabla ? tablaLiga(slug).find((x) => x.id === e.id) : null;

  const caja = [
    ...(fila ? [["Posición", `#${fila.pos}`], ["Puntos", fila.pts]] : []),
    ["PJ", s.pj],
    ["G-E-P", `${s.g}-${s.e}-${s.p}`],
    ["Goles", `${s.gf}:${s.gc}`],
    ["Dif.", sign(s.dif)],
  ];
  const medias = [
    ["Goles a favor por partido", s.pj ? (s.gf / s.pj).toFixed(2) : "—"],
    ["Goles en contra por partido", s.pj ? (s.gc / s.pj).toFixed(2) : "—"],
    ["Partidos sin recibir gol", `${s.cs} (${pct(s.cs, s.pj)}%)`],
    ["Ambos marcan", `${pct(s.btts, s.pj)}%`],
    ["Más de 2.5 goles", `${pct(s.o25, s.pj)}%`],
  ];

  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-3xl px-5 py-8">
        <Link href={`/liga/${slug}`} className="text-sm font-semibold text-oro-700 hover:underline">← {liga.nombre}</Link>
        <div className="mt-4 flex items-center gap-4">
          <div className="rounded-3xl bg-white p-3 ring-1 ring-slate-200"><EscudoLiga e={e} size={72} /></div>
          <div className="min-w-0">
            <h1 className="text-3xl font-black tracking-tight">{e.nombre}</h1>
            <p className="text-sm text-slate-600">{liga.nombre} {liga.temporada}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-slate-500">Forma</span>
          <FormaLiga lista={s.forma} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          {caja.map(([k, v]) => (
            <div key={k} className={`${box} p-3`}>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">{k}</p>
              <p className="text-xl font-black text-slate-900">{v}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-3 mt-8 text-xl font-extrabold">Estadísticas</h2>
        <div className={`${box} divide-y divide-slate-100 px-4`}>
          {medias.map(([k, v]) => (
            <div key={k} className="flex justify-between py-3 text-sm">
              <span className="text-slate-600">{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Son estadísticas de la temporada, no pronósticos.</p>

        <h2 className="mb-3 mt-8 text-xl font-extrabold">Próximos partidos</h2>
        {s.proximos.length ? (
          <div className={box}>{s.proximos.map((m) => <Fila key={m.id} m={m} slug={slug} id={e.id} />)}</div>
        ) : (
          <p className="text-sm text-slate-500">Aún no hay partidos programados.</p>
        )}
        <p className="mt-2 text-xs text-slate-500">Horarios en hora de Bolivia.</p>

        <h2 className="mb-3 mt-8 text-xl font-extrabold">Últimos {s.ultimos.length} partidos</h2>
        <div className={box}>{s.ultimos.map((m) => <Fila key={m.id} m={m} slug={slug} id={e.id} />)}</div>
      </section>

      <CtaRecarga texto={`Hola, quiero jugar en Metabet y cargar saldo. Vi la página de ${e.nombre} en Min90 Bolivia. Soy mayor de 18 años.`} />
      <footer className="mx-auto max-w-3xl px-5 pb-16 pt-8 text-center text-xs text-slate-500">
        <p>Solo +18. Juega con responsabilidad.</p>
      </footer>
    </main>
  );
}
