import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Escudo, Forma, AvisoPrueba, FilaPartido } from "@/components/LigaUI";
import { equipos, porSlug, filaDe, ultimos, resultado, statsEquipo, TEMPORADA } from "@/lib/liga";

export const dynamicParams = false;
export const generateStaticParams = () => equipos.map((e) => ({ slug: e.slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const e = porSlug(slug);
  if (!e) return {};
  return {
    title: `${e.nombre}: estadísticas y últimos partidos | Min90 Bolivia`,
    description: `Posición, forma, estadísticas y últimos partidos de ${e.nombre} en la Primera División de Bolivia.`,
  };
}

export default async function Equipo({ params }) {
  const { slug } = await params;
  const e = porSlug(slug);
  if (!e) notFound();
  const fila = filaDe(e.id);
  const s = statsEquipo(e.id);
  const ult = ultimos(e.id, 10);
  const forma = ult.slice(0, 5).map((m) => resultado(m, e.id)).reverse();

  const caja = [
    ["Posición", fila ? `#${fila.pos}` : "—"],
    ["Puntos", fila ? fila.pts : "—"],
    ["PJ", s.pj],
    ["G-E-P", `${s.g}-${s.e}-${s.p}`],
    ["Goles", `${s.gfTotal}:${s.gcTotal}`],
    ["Dif.", s.gfTotal - s.gcTotal > 0 ? `+${s.gfTotal - s.gcTotal}` : s.gfTotal - s.gcTotal],
  ];
  const medias = [
    ["Goles a favor por partido", s.gf],
    ["Goles en contra por partido", s.gc],
    ["Partidos sin recibir gol", `${s.sinGol}%`],
    ["Ambos marcan", `${s.ambos}%`],
    ["Más de 2.5 goles", `${s.mas25}%`],
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <AvisoPrueba />
      <section className="mx-auto max-w-3xl px-5 pb-4 pt-10">
        <a href="/equipos" className="text-xs text-green-400">← Todos los equipos</a>
        <div className="mt-4 flex items-center gap-4">
          <Escudo e={e} size={72} />
          <div>
            <h1 className="text-3xl font-extrabold">{e.nombre}</h1>
            <p className="text-sm text-neutral-400">
              {e.ciudad} · {e.estadio}{e.capacidad ? ` (${e.capacidad})` : ""}{e.fundado ? ` · Fundado en ${e.fundado}` : ""}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Temporada {TEMPORADA}</h2>
        <div className="grid grid-cols-3 gap-2 text-center sm:grid-cols-6">
          {caja.map(([k, v]) => (
            <div key={k} className="rounded-xl bg-neutral-900 p-3">
              <p className="text-xs text-neutral-500">{k}</p>
              <p className="text-lg font-bold text-green-400">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Forma (últimos 5)</h2>
        <Forma lista={forma} />
        <p className="mt-2 text-xs text-neutral-500">G ganó · E empató · P perdió. El más reciente va a la derecha.</p>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Estadísticas</h2>
        <div className="divide-y divide-neutral-800 rounded-2xl border border-neutral-800 bg-neutral-900 px-4">
          {medias.map(([k, v]) => (
            <div key={k} className="flex justify-between py-3 text-sm">
              <span className="text-neutral-400">{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Últimos 10 partidos</h2>
        <div className="overflow-x-auto rounded-2xl border border-neutral-800">
          <table className="w-full min-w-[520px] text-left text-sm">
            <tbody>{ult.map((m) => <FilaPartido key={m.id} m={m} id={e.id} />)}</tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-neutral-500">Próximos partidos: se activan cuando conectemos la temporada actual.</p>
      </section>

      <footer className="mx-auto max-w-3xl px-5 pb-16 pt-8 text-center text-xs text-neutral-500">
        <p>Solo +18. Juega con responsabilidad.</p>
      </footer>
    </main>
  );
}
