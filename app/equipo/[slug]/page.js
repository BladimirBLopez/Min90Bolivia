import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Escudo, Forma, AvisoPrueba, FilaPartido } from "@/components/LigaUI";
import { equipos, porSlug, filaDe, ultimos, resultado, statsEquipo, partidosDe, TEMPORADA } from "@/lib/liga";

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
  const resumen = (lista) => {
    const r = lista.map((m) => resultado(m, e.id));
    return `${r.filter((x) => x === "G").length} ganó · ${r.filter((x) => x === "E").length} empató · ${r.filter((x) => x === "P").length} perdió`;
  };
  const temp = partidosDe(e.id, TEMPORADA);
  const golesDe = (lista) => lista.reduce((acc, m) => {
    const esLocal = m.local.id === e.id;
    acc.gf += esLocal ? m.goles.local : m.goles.visitante;
    acc.gc += esLocal ? m.goles.visitante : m.goles.local;
    return acc;
  }, { gf: 0, gc: 0 });
  const cuenta = (lista) => {
    const r = lista.map((m) => resultado(m, e.id));
    return { gan: r.filter((x) => x === "G").length, emp: r.filter((x) => x === "E").length, per: r.filter((x) => x === "P").length };
  };
  const porTemp = [TEMPORADA, TEMPORADA - 1, TEMPORADA - 2].map((t) => {
    const ps = partidosDe(e.id, t);
    return { t, pj: ps.length, ...cuenta(ps), ...golesDe(ps) };
  }).filter((x) => x.pj > 0);
  const t10 = { ...cuenta(ult), ...golesDe(ult) };
  const prom10 = (x) => (x / (ult.length || 1)).toFixed(2);
  const otros = equipos.filter((x) => x.id !== e.id).slice(0, 6);
  const deLocal = temp.filter((m) => m.local.id === e.id);
  const deVisita = temp.filter((m) => m.visitante.id === e.id);
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
        <h3 className="mb-2 mt-6 text-sm font-bold text-neutral-300">Local y visita · temporada {TEMPORADA}</h3>
        <div className="divide-y divide-neutral-800 rounded-2xl border border-neutral-800 bg-neutral-900 px-4">
          <div className="flex justify-between py-3 text-sm">
            <span className="text-neutral-400">De local ({deLocal.length} partidos)</span>
            <span className="font-semibold">{resumen(deLocal)}</span>
          </div>
          <div className="flex justify-between py-3 text-sm">
            <span className="text-neutral-400">De visita ({deVisita.length} partidos)</span>
            <span className="font-semibold">{resumen(deVisita)}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-neutral-500">Próximos partidos: se activan cuando conectemos la temporada actual.</p>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Resumen de los últimos {ult.length} partidos</h2>
        <div className="divide-y divide-neutral-800 rounded-2xl border border-neutral-800 bg-neutral-900 px-4">
          {[["Ganó", t10.gan], ["Empató", t10.emp], ["Perdió", t10.per], ["Goles a favor por partido", prom10(t10.gf)], ["Goles en contra por partido", prom10(t10.gc)]].map(([k, v]) => (
            <div key={k} className="flex justify-between py-3 text-sm">
              <span className="text-neutral-400">{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Por temporada</h2>
        <div className="overflow-x-auto rounded-2xl border border-neutral-800">
          <table className="w-full min-w-[360px] text-left text-sm">
            <thead>
              <tr className="text-xs text-neutral-500">
                <th className="p-3">Año</th><th className="p-3">Partidos</th><th className="p-3">Ganó-Empató-Perdió</th><th className="p-3">Goles</th>
              </tr>
            </thead>
            <tbody>
              {porTemp.map((x) => (
                <tr key={x.t} className="border-t border-neutral-800">
                  <td className="p-3 text-neutral-400">{x.t}</td>
                  <td className="p-3">{x.pj}</td>
                  <td className="p-3 font-bold text-green-400">{x.gan}-{x.emp}-{x.per}</td>
                  <td className="p-3">{x.gf}:{x.gc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-green-400">Ver todos los partidos de {TEMPORADA} ({temp.length})</summary>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-800">
            <table className="w-full min-w-[520px] text-left text-sm">
              <tbody>{temp.map((m) => <FilaPartido key={m.id} m={m} id={e.id} />)}</tbody>
            </table>
          </div>
        </details>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Otros equipos</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {otros.map((o) => (
            <a key={o.id} href={`/equipo/${o.slug}`} className="flex flex-col items-center rounded-xl bg-neutral-900 p-3 text-center text-xs hover:bg-neutral-800">
              <Escudo e={o} size={40} />
              <span className="mt-2">{o.nombre}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-3xl px-5 pb-16 pt-8 text-center text-xs text-neutral-500">
        <p>Solo +18. Juega con responsabilidad.</p>
      </footer>
    </main>
  );
}
