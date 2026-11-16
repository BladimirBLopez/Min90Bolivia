import CtaRecarga from "@/components/CtaRecarga";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Escudo, Forma } from "@/components/LigaUI";
import { ListaPartidos2026 } from "@/components/FilaPartido2026";
import { Chip, Tarjeta, Tabs } from "@/components/Ui";
import { equipos2026, porSlug2026, statsEquipo2026, ultimos2026, proximos2026, resultado2026, tabla2026, filaDe2026, partidos2026 } from "@/lib/liga2026";
import { equipos2024, info2024 } from "@/lib/stats2024";

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
  return { title, description, openGraph: { title, description, type: "website" } };
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
  return x ? <a href={`/equipo/${x.slug}`} className={`hover:text-amber-700 ${cls}`}>{t.nombre}</a> : <span className={cls}>{t.nombre}</span>;
}

function FilaRes({ m, id }) {
  const r = resultado2026(m, id);
  return (
    <tr className="border-t border-slate-200">
      <td className="p-3 text-slate-500">{fmt(m.fecha)}</td>
      <td className="p-3"><Nombre t={m.local} id={id} /></td>
      <td className="p-3 font-bold text-amber-700">{m.goles.local}-{m.goles.visitante}</td>
      <td className="p-3"><Nombre t={m.visitante} id={id} /></td>
      <td className="p-3"><span className={`rounded px-2 py-0.5 text-xs font-bold ${col[r]}`}>{r}</span></td>
    </tr>
  );
}

function FilaProx({ m, id }) {
  const sl = equipos2026.find((x) => x.id === m.local.id)?.slug;
  const sv = equipos2026.find((x) => x.id === m.visitante.id)?.slug;
  const href = sl && sv ? `/partido/${sl}-vs-${sv}` : null;
  const celda = (hijo, extra = "") =>
    href ? (
      <a href={href} className={`block p-3 hover:text-amber-700 ${extra}`}>{hijo}</a>
    ) : (
      <div className={`p-3 ${extra}`}>{hijo}</div>
    );
  return (
    <tr className="border-t border-slate-200 hover:bg-slate-100">
      <td className="p-0 text-slate-500">
        {celda(<>{fmt(m.fecha)}{m.hora ? ` · ${m.hora}` : ""}{m.estadio ? <span className="block text-xs text-slate-400">{m.estadio}</span> : null}</>)}
      </td>
      <td className="p-0">{celda(m.local.nombre, m.local.id === id ? "font-bold" : "")}</td>
      <td className="p-0 text-slate-500">{celda("vs")}</td>
      <td className="p-0">{celda(m.visitante.nombre, m.visitante.id === id ? "font-bold" : "")}</td>
      <td className="p-0 text-xs text-slate-500">{celda(`R${m.ronda}`)}</td>
    </tr>
  );
}

function Minutos({ titulo, datos, color }) {
  const max = Math.max(1, ...datos.map((d) => d.total));
  return (
    <div className="mb-5">
      <p className="mb-2 text-sm font-bold text-slate-700">{titulo}</p>
      <div className="flex items-end gap-2">
        {datos.map((d) => (
          <div key={d.t} className="flex flex-1 flex-col items-center justify-end">
            <span className="text-xs text-slate-700">{d.total}</span>
            <div className={`w-full rounded-t ${color}`} style={{ height: `${Math.max(4, Math.round((d.total / max) * 80))}px` }} />
            <span className="mt-1 text-[10px] text-slate-500">{d.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Lista({ filas }) {
  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 px-4">
      {filas.map(([k, v]) => (
        <div key={k} className="flex justify-between py-3 text-sm">
          <span className="text-slate-600">{k}</span>
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
      <main className="min-h-screen bg-white text-slate-900">
        <Navbar />
        <section className="mx-auto max-w-3xl px-5 pb-16 pt-10">
          <a href="/equipos" className="text-xs text-amber-700">← Todos los equipos</a>
          <div className="mt-4 flex items-center gap-4">
            <Escudo e={o} size={72} />
            <div>
              <h1 className="text-3xl font-extrabold">{o.nombre}</h1>
              <p className="text-sm text-slate-600">{o.ciudad} · {o.estadio}</p>
            </div>
          </div>
          <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
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
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <div className="bg-slate-100 p-2 text-center text-xs text-slate-700">
        Temporada 2026 · datos hasta la ronda {ultRonda}
      </div>

      <header className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.20),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-5 pb-6 pt-8">
          <a href="/equipos" className="text-xs text-amber-700">← Todos los equipos</a>
          <div className="mt-5 flex items-center gap-5">
            <div className="rounded-3xl bg-slate-50 p-3 ring-1 ring-slate-200"><Escudo e={e} size={88} /></div>
            <div className="min-w-0">
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{e.nombre}</h1>
              <p className="mt-1 text-sm text-slate-600">
                {[eq24 && eq24.ciudad, estadio, eq24 && eq24.capacidad ? `${eq24.capacidad} personas` : null, eq24 && eq24.fundado ? `Fundado en ${eq24.fundado}` : null].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {fila ? <Chip tono="verde">Puesto {fila.pos} de {tabla.length}</Chip> : null}
            <Chip>{s.pts} pts</Chip>
            {racha ? <Chip tono="amarillo">{racha}</Chip> : null}
            <Forma lista={s.forma} />
          </div>
        </div>
      </header>

      <Tabs items={[["Resumen", "#resumen"], ["Partidos", "#partidos"], ["Tabla", "#tabla"]]} />

      <section className="mx-auto max-w-3xl px-5 py-5">
        <h2 id="resumen" className="mb-3 scroll-mt-32 text-lg font-extrabold tracking-tight">Temporada 2026</h2>
        <div className="grid grid-cols-3 gap-2 text-center sm:grid-cols-6">
          {caja.map(([k, v], i) => (
            <Tarjeta key={k} className="p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">{k}</p>
              <p className={`text-xl font-black ${i === 1 ? "text-amber-700" : "text-slate-900"}`}>{v}</p>
            </Tarjeta>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-center">
          {[["De local", s.casa], ["De visita", s.fuera]].map(([k, x]) => (
            <Tarjeta key={k} className="p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">{k} · {x.pj} PJ</p>
              <p className="text-xl font-black text-amber-700">{x.g}-{x.e}-{x.p}</p>
              <p className="text-xs text-slate-600">Goles {x.gf}:{x.gc}</p>
            </Tarjeta>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Forma (últimos 5)</h2>
        <Forma lista={s.forma} />
        <p className="mt-2 text-xs text-slate-500">G ganó · E empató · P perdió. El más reciente va a la derecha.{racha ? ` Racha: ${racha}.` : ""}</p>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Estadísticas 2026</h2>
        <Lista filas={medias} />
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 id="partidos" className="mb-3 scroll-mt-32 text-lg font-extrabold tracking-tight">Próximos partidos</h2>
        {prox.length ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[520px] text-left text-sm">
              <tbody>{prox.map((m) => <FilaProx key={m.id} m={m} id={e.id} />)}</tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Aún no hay partidos programados. Hora de Bolivia.</p>
        )}
        <p className="mt-2 text-xs text-slate-500">Horarios en hora de Bolivia.</p>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Últimos {ult.length} partidos</h2>
        <ListaPartidos2026 lista={ult} id={e.id} />
      </section>


      {st24 && st24.favor.length > 0 ? (
        <section className="mx-auto max-w-3xl px-5 py-4">
          <h2 className="mb-1 text-xl font-bold">Detalle de la temporada 2024</h2>
          <p className="mb-4 text-xs text-slate-500">Estos datos son de 2024: la fuente gratis no trae minutos, tarjetas ni formaciones de 2026.</p>
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
        <h2 id="tabla" className="mb-3 scroll-mt-32 text-lg font-extrabold tracking-tight">Tabla de posiciones 2026</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[380px] text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-500">
                <th className="p-3">#</th><th className="p-3">Equipo</th><th className="p-3">PJ</th><th className="p-3">Dif.</th><th className="p-3">Pts</th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((x) => (
                <tr key={x.id} className={`border-t border-slate-200 ${x.id === e.id ? "bg-slate-100" : ""}`}>
                  <td className="p-3 text-slate-500">{x.pos}</td>
                  <td className="p-3">
                    <a href={`/equipo/${x.slug}`} className="flex items-center gap-2 hover:text-amber-700">
                      <Escudo e={x} size={20} />
                      <span className={x.id === e.id ? "font-bold" : ""}>{x.nombre}</span>
                    </a>
                  </td>
                  <td className="p-3">{x.pj}</td>
                  <td className="p-3">{sign(x.dif)}</td>
                  <td className="p-3 font-bold text-amber-700">{x.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {(() => {
        const miPos = (tabla.find((x) => x.id === e.id) || {}).pos || 0;
        const otros = tabla
          .filter((x) => x.id !== e.id)
          .sort((a, b) => Math.abs(a.pos - miPos) - Math.abs(b.pos - miPos) || a.pos - b.pos);
        return (
          <section className="mx-auto max-w-3xl px-5 py-5">
            <h2 className="mb-1 text-lg font-extrabold tracking-tight">Otros equipos</h2>
            <p className="mb-3 text-xs text-slate-500">Primera División 2026, de los más cercanos a {e.nombre} en la tabla a los más lejanos.</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {otros.map((o) => (
                <a key={o.id} href={`/equipo/${o.slug}`} className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center hover:border-amber-500">
                  <Escudo e={o} size={40} />
                  <span className="mt-2 text-xs font-semibold leading-tight">{o.nombre}</span>
                  <span className="mt-1 text-[11px] text-amber-700">#{o.pos} · {o.pts} pts</span>
                </a>
              ))}
            </div>
          </section>
        );
      })()}

      <CtaRecarga texto={`Hola, quiero jugar en Metabet y cargar saldo. Vi la página de ${e.nombre} en Min90 Bolivia. Soy mayor de 18 años.`} />

      <footer className="mx-auto max-w-3xl px-5 pb-16 pt-8 text-center text-xs text-slate-500">
        <p>Solo +18. Juega con responsabilidad.</p>
      </footer>
    </main>
  );
}
