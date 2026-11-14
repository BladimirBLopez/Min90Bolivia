import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Escudo, Forma } from "@/components/LigaUI";
import { equipos2026, porSlug2026, statsEquipo2026, ultimos2026, proximos2026, resultado2026, tabla2026, filaDe2026, partidos2026 } from "@/lib/liga2026";
import { equipos2024, info2024 } from "@/lib/stats2024";

const WA = "59169356292";
const SOLO24 = equipos2024.filter((x) => !equipos2026.some((y) => y.slug === x.slug));

export const dynamicParams = false;
export const generateStaticParams = () => [...equipos2026, ...SOLO24].map((e) => ({ slug: e.slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const e = porSlug2026(slug);
  if (!e) {
    const o = SOLO24.find((x) => x.slug === slug);
    return o ? { title: `${o.nombre} | Min90 Bolivia`, description: `${o.nombre} en la Primera División de Bolivia.` } : {};
  }
  const f = filaDe2026(e.id);
  const title = `${e.nombre}: tabla, forma y próximos partidos 2026 | Min90 Bolivia`;
  const description = `${e.nombre} en la Primera División de Bolivia 2026${f ? `: puesto ${f.pos}, ${f.pts} puntos en ${f.pj} partidos` : ""}. Forma, estadísticas, últimos resultados y próximos partidos.`;
  return { title, description, openGraph: { title, description, type: "website", ...(e.logo ? { images: [e.logo] } : {}) } };
}

const col = { G: "bg-green-500 text-black", E: "bg-yellow-500 text-black", P: "bg-red-500 text-white" };
const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => {
  const [y, m, d] = String(f).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} ${MESES[m - 1]}`;
};
const pct = (x, n) => (n ? Math.round((100 * x) / n) : 0);
const sign = (n) => (n > 0 ? `+${n}` : `${n}`);
const rachaTxt = (r) => (r && r.n >= 2 ? `${r.n} ${r.tipo === "G" ? "victorias" : r.tipo === "E" ? "empates" : "derrotas"} seguidas` : null);

function Nombre({ t, id }) {
  const x = equipos2026.find((q) => q.id === t.id);
  const cls = t.id === id ? "font-bold" : "";
  return x ? <a href={`/equipo/${x.slug}`} className={`hover:text-green-400 ${cls}`}>{t.nombre}</a> : <span className={cls}>{t.nombre}</span>;
}

function FilaRes({ m, id }) {
  const r = resultado2026(m, id);
  return (
    <tr className="border-t border-neutral-800">
      <td className="p-3 text-neutral-500">{fmt(m.fecha)}</td>
      <td className="p-3"><Nombre t={m.local} id={id} /></td>
      <td className="p-3 font-bold text-green-400">{m.goles.local}-{m.goles.visitante}</td>
      <td className="p-3"><Nombre t={m.visitante} id={id} /></td>
      <td className="p-3"><span className={`rounded px-2 py-0.5 text-xs font-bold ${col[r]}`}>{r}</span></td>
    </tr>
  );
}

function FilaProx({ m, id }) {
  return (
    <tr className="border-t border-neutral-800">
      <td className="p-3 text-neutral-500">
        {fmt(m.fecha)}{m.hora ? ` · ${m.hora}` : ""}
        {m.estadio ? <span className="block text-xs text-neutral-600">{m.estadio}</span> : null}
      </td>
      <td className="p-3"><Nombre t={m.local} id={id} /></td>
      <td className="p-3 text-neutral-500">vs</td>
      <td className="p-3"><Nombre t={m.visitante} id={id} /></td>
      <td className="p-3 text-xs text-neutral-500">R{m.ronda}</td>
    </tr>
  );
}

function Minutos({ titulo, datos, color }) {
  const max = Math.max(1, ...datos.map((d) => d.total));
  return (
    <div className="mb-5">
      <p className="mb-2 text-sm font-bold text-neutral-300">{titulo}</p>
      <div className="flex items-end gap-2">
        {datos.map((d) => (
          <div key={d.t} className="flex flex-1 flex-col items-center justify-end">
            <span className="text-xs text-neutral-300">{d.total}</span>
            <div className={`w-full rounded-t ${color}`} style={{ height: `${Math.max(4, Math.round((d.total / max) * 80))}px` }} />
            <span className="mt-1 text-[10px] text-neutral-500">{d.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Lista({ filas }) {
  return (
    <div className="divide-y divide-neutral-800 rounded-2xl border border-neutral-800 bg-neutral-900 px-4">
      {filas.map(([k, v]) => (
        <div key={k} className="flex justify-between py-3 text-sm">
          <span className="text-neutral-400">{k}</span>
          <span className="font-semibold">{v}</span>
        </div>
      ))}
    </div>
  );
}

export default async function Equipo({ params }) {
  const { slug } = await params;
  const e = porSlug2026(slug);

  if (!e) {
    const o = SOLO24.find((x) => x.slug === slug);
    if (!o) notFound();
    return (
      <main className="min-h-screen bg-neutral-950 text-white">
        <Navbar />
        <section className="mx-auto max-w-3xl px-5 pb-16 pt-10">
          <a href="/equipos" className="text-xs text-green-400">← Todos los equipos</a>
          <div className="mt-4 flex items-center gap-4">
            <Escudo e={o} size={72} />
            <div>
              <h1 className="text-3xl font-extrabold">{o.nombre}</h1>
              <p className="text-sm text-neutral-400">{o.ciudad} · {o.estadio}</p>
            </div>
          </div>
          <p className="mt-6 rounded-xl bg-neutral-900 p-4 text-sm text-neutral-300">
            {o.nombre} no está en la Primera División 2026. Mira los equipos de esta temporada.
          </p>
        </section>
      </main>
    );
  }

  const s = statsEquipo2026(e.id);
  const fila = filaDe2026(e.id);
  const tabla = tabla2026();
  const ult = ultimos2026(e.id, 10);
  const prox = proximos2026(e.id, 5);
  const info = info2024(e.nombre);
  const eq24 = info ? info.equipo : null;
  const st24 = info ? info.stats : null;
  const estadio = (eq24 && eq24.estadio) || (partidos2026.find((m) => m.local.id === e.id && m.estadio) || {}).estadio;
  const ultRonda = Math.max(0, ...partidos2026.filter((m) => m.estado === "FT").map((m) => m.ronda));
  const wa = `https://wa.me/${WA}?text=${encodeURIComponent(`Hola, quiero cargar saldo. Vi la página de ${e.nombre} en Min90 Bolivia`)}`;
  const racha = rachaTxt(s.racha);

  const caja = [
    ["Posición", fila ? `#${fila.pos}` : "—"],
    ["Puntos", s.pts],
    ["PJ", s.pj],
    ["G-E-P", `${s.g}-${s.e}-${s.p}`],
    ["Goles", `${s.gf}:${s.gc}`],
    ["Dif.", sign(s.dif)],
  ];
  const medias = [
    ["Goles a favor por partido", s.promGf.toFixed(2)],
    ["Goles en contra por partido", s.promGc.toFixed(2)],
    ["Partidos sin recibir gol", `${s.cs} (${pct(s.cs, s.pj)}%)`],
    ["Partidos sin marcar", `${s.fts} (${pct(s.fts, s.pj)}%)`],
    ["Ambos marcan", `${pct(s.btts, s.pj)}%`],
    ["Más de 2.5 goles", `${pct(s.o25, s.pj)}%`],
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <div className="bg-neutral-800 p-2 text-center text-xs text-neutral-300">
        Temporada 2026 · datos hasta la ronda {ultRonda}
      </div>

      <section className="mx-auto max-w-3xl px-5 pb-4 pt-10">
        <a href="/equipos" className="text-xs text-green-400">← Todos los equipos</a>
        <div className="mt-4 flex items-center gap-4">
          <Escudo e={e} size={72} />
          <div>
            <h1 className="text-3xl font-extrabold">{e.nombre}</h1>
            <p className="text-sm text-neutral-400">
              {[eq24 && eq24.ciudad, estadio, eq24 && eq24.capacidad ? `${eq24.capacidad} personas` : null, eq24 && eq24.fundado ? `Fundado en ${eq24.fundado}` : null].filter(Boolean).join(" · ")}
            </p>
            {fila ? <p className="mt-1 text-sm font-semibold text-green-400">Puesto {fila.pos} de {tabla.length} · {fila.pts} puntos</p> : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Temporada 2026</h2>
        <div className="grid grid-cols-3 gap-2 text-center sm:grid-cols-6">
          {caja.map(([k, v]) => (
            <div key={k} className="rounded-xl bg-neutral-900 p-3">
              <p className="text-xs text-neutral-500">{k}</p>
              <p className="text-lg font-bold text-green-400">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-center">
          {[["De local", s.casa], ["De visita", s.fuera]].map(([k, x]) => (
            <div key={k} className="rounded-xl bg-neutral-900 p-3">
              <p className="text-xs text-neutral-500">{k} · {x.pj} PJ</p>
              <p className="text-lg font-bold text-green-400">{x.g}-{x.e}-{x.p}</p>
              <p className="text-xs text-neutral-400">Goles {x.gf}:{x.gc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Forma (últimos 5)</h2>
        <Forma lista={s.forma} />
        <p className="mt-2 text-xs text-neutral-500">G ganó · E empató · P perdió. El más reciente va a la derecha.{racha ? ` Racha: ${racha}.` : ""}</p>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Estadísticas 2026</h2>
        <Lista filas={medias} />
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Próximos partidos</h2>
        {prox.length ? (
          <div className="overflow-x-auto rounded-2xl border border-neutral-800">
            <table className="w-full min-w-[520px] text-left text-sm">
              <tbody>{prox.map((m) => <FilaProx key={m.id} m={m} id={e.id} />)}</tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">Aún no hay partidos programados. Hora de Bolivia.</p>
        )}
        <p className="mt-2 text-xs text-neutral-500">Horarios en hora de Bolivia.</p>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Últimos {ult.length} partidos</h2>
        <div className="overflow-x-auto rounded-2xl border border-neutral-800">
          <table className="w-full min-w-[520px] text-left text-sm">
            <tbody>{ult.map((m) => <FilaRes key={m.id} m={m} id={e.id} />)}</tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <div className="rounded-2xl border border-green-700 bg-neutral-900 p-5 text-center">
          <p className="text-lg font-bold">¿Quieres jugar con {e.nombre}?</p>
          <p className="mt-1 text-sm text-neutral-400">Escríbeme por WhatsApp y te cargo saldo al instante.</p>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-xl bg-green-500 px-6 py-3 font-bold text-black">Cargar por WhatsApp</a>
        </div>
      </section>

      {st24 && st24.favor.length > 0 ? (
        <section className="mx-auto max-w-3xl px-5 py-4">
          <h2 className="mb-1 text-xl font-bold">Detalle de la temporada 2024</h2>
          <p className="mb-4 text-xs text-neutral-500">Estos datos son de 2024: la fuente gratis no trae minutos, tarjetas ni formaciones de 2026.</p>
          <Minutos titulo="Goles a favor por minutos" datos={st24.favor} color="bg-green-500" />
          <Minutos titulo="Goles en contra por minutos" datos={st24.contra} color="bg-red-500" />
          <Lista filas={[
            ["Formación más usada", st24.formacion ? `${st24.formacion.nombre} (${st24.formacion.pj} partidos)` : "—"],
            ["Tarjetas amarillas", st24.amarillas],
            ["Tarjetas rojas", st24.rojas],
            ["Porterías en cero", st24.cs === null ? "—" : st24.cs],
            ["Partidos sin marcar", st24.fts === null ? "—" : st24.fts],
            ["Penales marcados / fallados", `${st24.penMarcados || 0} / ${st24.penFallados || 0}`],
          ]} />
        </section>
      ) : null}

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Tabla de posiciones 2026</h2>
        <div className="overflow-x-auto rounded-2xl border border-neutral-800">
          <table className="w-full min-w-[380px] text-left text-sm">
            <thead>
              <tr className="text-xs text-neutral-500">
                <th className="p-3">#</th><th className="p-3">Equipo</th><th className="p-3">PJ</th><th className="p-3">Dif.</th><th className="p-3">Pts</th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((x) => (
                <tr key={x.id} className={`border-t border-neutral-800 ${x.id === e.id ? "bg-neutral-800" : ""}`}>
                  <td className="p-3 text-neutral-500">{x.pos}</td>
                  <td className="p-3">
                    <a href={`/equipo/${x.slug}`} className="flex items-center gap-2 hover:text-green-400">
                      <Escudo e={x} size={20} />
                      <span className={x.id === e.id ? "font-bold" : ""}>{x.nombre}</span>
                    </a>
                  </td>
                  <td className="p-3">{x.pj}</td>
                  <td className="p-3">{sign(x.dif)}</td>
                  <td className="p-3 font-bold text-green-400">{x.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mx-auto max-w-3xl px-5 pb-16 pt-8 text-center text-xs text-neutral-500">
        <p>Solo +18. Juega con responsabilidad.</p>
      </footer>
    </main>
  );
}
