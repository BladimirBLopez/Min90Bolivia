import Link from "next/link";
import { notFound } from "next/navigation";
import { conSocial } from "@/lib/ogLiga";
import Navbar from "@/components/Navbar";
import CtaRecarga from "@/components/CtaRecarga";
import EscudoLiga from "@/components/EscudoLiga";
import FormaLiga from "@/components/FormaLiga";
import { ligaPorSlug, partidoPorId, datosEquipo, h2hLiga, slugEquipo, jugado } from "@/lib/ligas";

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
const box = "rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white shadow-md shadow-slate-200/70";

export async function generateMetadata({ params }) {
  const { slug, id } = await params;
  const l = ligaPorSlug(slug);
  const m = l && partidoPorId(slug, id);
  if (!m) return {};
  return conSocial({
    title: `${m.local.nombre} vs ${m.visitante.nombre}: ${l.nombre} | Min90 Bolivia`,
    description: `${m.local.nombre} vs ${m.visitante.nombre} (${fmt(m.fecha)}${m.hora ? ` · ${m.hora}` : ""}, hora de Bolivia). Estadísticas y tendencias de ambos equipos. Recarga Metabet por WhatsApp, pago por QR.`,
  });
}

export default async function PartidoLiga({ params }) {
  const { slug, id } = await params;
  const liga = ligaPorSlug(slug);
  if (!liga) notFound();
  const m = partidoPorId(slug, id);
  if (!m) notFound();

  const sa = datosEquipo(slug, m.local.id);
  const sb = datosEquipo(slug, m.visitante.id);
  const duelos = h2hLiga(slug, m.local.id, m.visitante.id, 5).filter((x) => x.id !== m.id);
  const fin = jugado(m);
  const prom = (x, n) => (n ? (x / n).toFixed(2) : "—");
  const filas = [
    ["Partidos jugados", sa.pj, sb.pj],
    ["Goles a favor por partido", prom(sa.gf, sa.pj), prom(sb.gf, sb.pj)],
    ["Goles en contra por partido", prom(sa.gc, sa.pj), prom(sb.gc, sb.pj)],
    ["Ambos marcan", `${pct(sa.btts, sa.pj)}%`, `${pct(sb.btts, sb.pj)}%`],
    ["Más de 2.5 goles", `${pct(sa.o25, sa.pj)}%`, `${pct(sb.o25, sb.pj)}%`],
  ];
  const eq = (t) => `/liga/${slug}/equipo/${slugEquipo(t.nombre)}`;

  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-3xl px-5 py-8">
        <Link href={`/liga/${slug}`} className="text-sm font-semibold text-oro-700 hover:underline">← {liga.nombre}</Link>
        <div className={`${box} mt-4 p-5 text-center`}>
          <p className="text-xs text-slate-600">
            {fmt(m.fecha)}{m.hora ? ` · ${m.hora}` : ""} · Ronda {m.ronda} · hora de Bolivia
            {m.estadio ? <span className="block text-slate-400">{m.estadio}</span> : null}
          </p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <Link href={eq(m.local)} className="flex flex-1 flex-col items-center">
              <EscudoLiga e={m.local} size={64} />
              <span className="mt-2 text-sm font-bold">{m.local.nombre}</span>
            </Link>
            {fin ? (
              <span className="text-3xl font-black text-oro-700">{m.goles.local} - {m.goles.visitante}</span>
            ) : (
              <span className="text-sm font-bold text-slate-500">vs</span>
            )}
            <Link href={eq(m.visitante)} className="flex flex-1 flex-col items-center">
              <EscudoLiga e={m.visitante} size={64} />
              <span className="mt-2 text-sm font-bold">{m.visitante.nombre}</span>
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <FormaLiga lista={sa.forma} />
            <span>Forma</span>
            <FormaLiga lista={sb.forma} />
          </div>
        </div>

        <h2 className="mb-3 mt-8 text-xl font-extrabold">Comparación</h2>
        <div className={`${box} divide-y divide-slate-100 px-4`}>
          {filas.map(([k, a, b]) => (
            <div key={k} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-3 text-sm">
              <span className="font-semibold">{a}</span>
              <span className="text-center text-xs text-slate-500">{k}</span>
              <span className="text-right font-semibold">{b}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Estadísticas de la temporada, no son pronósticos. Los pronósticos Min90 van en el grupo de WhatsApp.</p>

        {duelos.length > 0 && (
          <>
            <h2 className="mb-3 mt-8 text-xl font-extrabold">Cara a cara esta temporada</h2>
            <div className={box}>
              {duelos.map((d) => (
                <Link key={d.id} href={`/liga/${slug}/partido/${d.id}`} className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm first:border-t-0 hover:bg-oro-50">
                  <span className="text-xs text-slate-500">{fmt(d.fecha)}</span>
                  <span className="min-w-0 flex-1 truncate">{d.local.nombre} <span className="text-slate-400">vs</span> {d.visitante.nombre}</span>
                  <span className="font-bold text-oro-700">{d.goles.local}-{d.goles.visitante}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      <CtaRecarga texto={`Hola, quiero cargar y jugar ${m.local.nombre} vs ${m.visitante.nombre}. Vi el partido en Min90 Bolivia. Soy mayor de 18 años.`} />
      <footer className="mx-auto max-w-3xl px-5 pb-16 pt-8 text-center text-xs text-slate-500">
        <p>Solo +18. Juega con responsabilidad.</p>
      </footer>
    </main>
  );
}
