import Link from "next/link";
import { notFound } from "next/navigation";
import { conSocial } from "@/lib/ogLiga";
import Navbar from "@/components/Navbar";
import CtaRecarga from "@/components/CtaRecarga";
import EscudoLiga from "@/components/EscudoLiga";
import FormaLiga from "@/components/FormaLiga";
import { ligaPorSlug, partidoPorId, datosEquipo, h2hLiga, slugEquipo, jugado, cargarLiga } from "@/lib/ligas";
import { aPartidos, ajustar, predecir } from "@/lib/modelo";
import WhatsAppButton from "@/components/WhatsAppButton";

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

        {!fin && (() => {
          try {
            const p = predecir(ajustar(aPartidos(cargarLiga(slug))), m.local.id, m.visitante.id);
            if (!p) return null;
            const r = (x) => Math.round(x * 100);
            const amb = sa.pj && sb.pj ? Math.round((pct(sa.btts, sa.pj) + pct(sb.btts, sb.pj)) / 2) : null;
            const dc = p.x1 >= p.x2 ? { t: `${m.local.nombre} o empate`, v: p.x1 } : { t: `${m.visitante.nombre} o empate`, v: p.x2 };
            const gl = p.o25 >= 0.5 ? { t: "Más de 2.5 goles", v: p.o25 } : { t: "Menos de 2.5 goles", v: 1 - p.o25 };
            const lista = [["Resultado", dc], ["Goles", gl]];
            if (amb !== null) lista.push(["Ambos marcan", amb >= 50 ? { t: "Sí", v: amb / 100 } : { t: "No", v: (100 - amb) / 100 }]);
            const texto = `Hola, quiero jugar ${m.local.nombre} vs ${m.visitante.nombre} (${liga.nombre}). Vi las tendencias Min90 en la web y quiero consultar la cuota. Soy mayor de 18 años.`;
            return (
              <div className="mt-8 rounded-2xl border-2 border-oro-500 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl font-extrabold">Tendencias Min90</h2>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-oro-200">Confianza baja</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">En esta liga el modelo aún no supera a la tendencia general: úsalo como referencia, no como pick seguro.</p>
                <div className="mt-4 space-y-3">
                  {lista.map(([k, f]) => (
                    <div key={k}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm"><span className="mr-2 text-xs uppercase text-slate-500">{k}</span><b className={f.v >= 0.55 ? "text-slate-900" : "text-slate-500"}>{f.t}</b></p>
                        <p className={`text-lg font-black ${f.v >= 0.55 ? "text-oro-700" : "text-slate-400"}`}>{r(f.v)}%</p>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200"><div className={f.v >= 0.55 ? "h-full bg-oro-500" : "h-full bg-slate-400"} style={{ width: `${r(f.v)}%` }} /></div>
                      {f.v < 0.55 ? <p className="mt-0.5 text-[11px] text-slate-500">Sin ventaja clara</p> : null}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <WhatsAppButton texto={texto}>Consultar cuota</WhatsAppButton>
                </div>
                <p className="mt-3 text-[11px] text-slate-500">Estimación estadística de confianza baja, no una garantía de resultado. Solo +18. Juega con responsabilidad.</p>
              </div>
            );
          } catch (e) {
            return null;
          }
        })()}

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
