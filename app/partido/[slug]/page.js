import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShareButton from "@/components/ShareButton";
import { Escudo, Forma, Barra, AvisoPrueba, FilaPartido, fmtFecha } from "@/components/LigaUI";
import { pares, parseSlugPartido, filaDe, ultimos, resultado, statsEquipo, h2h, rutaPartido, TEMPORADA } from "@/lib/liga";
import { estrella, pronosticos } from "@/app/data/pronosticos";

export const dynamicParams = false;
export const generateStaticParams = () => pares.map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const par = parseSlugPartido(slug);
  if (!par) return {};
  const t = `${par[0].nombre} vs ${par[1].nombre}: pronóstico y estadísticas | Min90 Bolivia`;
  return { title: t, description: `Forma, tabla, estadísticas y cara a cara de ${par[0].nombre} vs ${par[1].nombre}.`, openGraph: { title: t } };
}

export default async function Partido({ params }) {
  const { slug } = await params;
  const par = parseSlugPartido(slug);
  if (!par) notFound();
  const [a, b] = par;
  const sa = statsEquipo(a.id);
  const sb = statsEquipo(b.id);
  const fa = filaDe(a.id);
  const fb = filaDe(b.id);
  const forma = (e) => ultimos(e.id, 5).map((m) => resultado(m, e.id)).reverse();
  const duelos = h2h(a.id, b.id, 5);
  const gana = (id) => duelos.filter((m) => resultado(m, id) === "G").length;
  const empates = duelos.filter((m) => m.goles.local === m.goles.visitante).length;
  const pick = [estrella, ...pronosticos].find((p) => rutaPartido(p.partido) === `/partido/${slug}`);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <AvisoPrueba />
      <section className="mx-auto max-w-3xl px-5 pb-4 pt-10 text-center">
        <Link href="/" className="text-xs text-green-400">← Volver a pronósticos</Link>
        <p className="mt-4 text-xs uppercase tracking-widest text-green-400">Primera División de Bolivia</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <a href={`/equipo/${a.slug}`} className="flex flex-col items-center"><Escudo e={a} size={64} /><span className="mt-1 text-sm font-semibold">{a.nombre}</span></a>
          <span className="text-2xl font-bold text-neutral-500">vs</span>
          <a href={`/equipo/${b.slug}`} className="flex flex-col items-center"><Escudo e={b} size={64} /><span className="mt-1 text-sm font-semibold">{b.nombre}</span></a>
        </div>
        <p className="mt-3 text-sm text-neutral-400">{pick ? pick.fecha : "Fecha por confirmar"} (hora Bolivia) · {a.estadio}</p>
      </section>

      {pick && (
        <section className="mx-auto max-w-3xl px-5 py-4">
          <div className="rounded-2xl border border-green-500/60 bg-green-950/30 p-5">
            <p className="text-xs uppercase text-green-400">Pronóstico Min90 · {pick.mercado}</p>
            <p className="mt-1 text-2xl font-bold">{pick.pick}</p>
            <p className="text-sm text-neutral-300">Cuota {pick.cuota} · Confianza {"★".repeat(pick.confianza)}{"☆".repeat(3 - pick.confianza)}</p>
            <p className="mt-3 text-sm text-neutral-300">{pick.analisis}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <WhatsAppButton>Quiero cargar</WhatsAppButton>
              <ShareButton texto={`Pronóstico Min90: ${pick.partido} - ${pick.pick} (cuota ${pick.cuota})`} />
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Tabla {TEMPORADA}</h2>
        <div className="grid grid-cols-2 gap-2 text-center text-sm">
          {[[a, fa], [b, fb]].map(([e, f]) => (
            <div key={e.id} className="rounded-xl bg-neutral-900 p-3">
              <p className="font-semibold">{e.nombre}</p>
              <p className="text-green-400">{f ? `#${f.pos} · ${f.pts} pts` : "—"}</p>
              <p className="text-xs text-neutral-500">{f ? `PJ ${f.pj} · ${f.g}-${f.e}-${f.p}` : ""}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Forma (últimos 5)</h2>
        <div className="space-y-2">
          {[a, b].map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-xl bg-neutral-900 p-3">
              <span className="text-sm font-semibold">{e.nombre}</span>
              <Forma lista={forma(e)} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-1 text-xl font-bold">Estadísticas</h2>
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-green-400">{a.nombre}</span>
          <span className="text-yellow-400">{b.nombre}</span>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-2">
          <Barra label="Goles a favor por partido" a={sa.gf} b={sb.gf} />
          <Barra label="Goles en contra por partido" a={sa.gc} b={sb.gc} />
          <Barra label="Sin recibir gol" a={sa.sinGol} b={sb.sinGol} suf="%" />
          <Barra label="Ambos marcan" a={sa.ambos} b={sb.ambos} suf="%" />
          <Barra label="Más de 2.5 goles" a={sa.mas25} b={sb.mas25} suf="%" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Cara a cara</h2>
        {duelos.length === 0 ? (
          <p className="rounded-xl bg-neutral-900 p-4 text-center text-sm text-neutral-500">Sin enfrentamientos registrados.</p>
        ) : (
          <>
            <p className="mb-2 text-sm text-neutral-300">
              Últimos {duelos.length}: {a.nombre} {gana(a.id)} · Empates {empates} · {b.nombre} {gana(b.id)}
            </p>
            <div className="overflow-x-auto rounded-2xl border border-neutral-800">
              <table className="w-full min-w-[520px] text-left text-sm">
                <tbody>{duelos.map((m) => <FilaPartido key={m.id} m={m} id={a.id} />)}</tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-neutral-500">La columna G/E/P es desde el punto de vista de {a.nombre}. Último duelo: {fmtFecha(duelos[0].fecha)}.</p>
          </>
        )}
      </section>

      <footer className="mx-auto max-w-3xl px-5 pb-16 pt-8 text-center text-xs text-neutral-500">
        <p>Solo +18. Juega con responsabilidad.</p>
        <p className="mt-1">Los pronósticos son opiniones y no garantizan resultados.</p>
      </footer>
    </main>
  );
}
