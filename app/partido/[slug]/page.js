import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import CtaRecarga from "@/components/CtaRecarga";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShareButton from "@/components/ShareButton";
import { Escudo, Forma, FilaPartido, fmtFecha } from "@/components/LigaUI";
import { pares, parseSlugPartido, porSlug, h2h, resultado as resultado24, rutaPartido } from "@/lib/liga";
import { equipos2026, porSlug2026, statsEquipo2026, resultado2026, filaDe2026, h2h2026, partidoEntre2026, partidos2026 } from "@/lib/liga2026";
import { estrella, pronosticos, EJEMPLO } from "@/app/data/pronosticos";

const todos2026 = equipos2026.flatMap((a) => equipos2026.filter((b) => b.id !== a.id).map((b) => `${a.slug}-vs-${b.slug}`));

export const dynamicParams = false;
export const generateStaticParams = () => [...new Set([...todos2026, ...pares])].map((slug) => ({ slug }));

const parse2026 = (slug) => {
  const [x, y] = String(slug).split("-vs-");
  const a = porSlug2026(x);
  const b = porSlug2026(y);
  return a && b && a.id !== b.id ? [a, b] : null;
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const par = parse2026(slug) || parseSlugPartido(slug);
  if (!par) return {};
  const p26 = parse2026(slug);
  const mm = p26 ? partidoEntre2026(p26[0].id, p26[1].id) || partidoEntre2026(p26[1].id, p26[0].id) : null;
  let t = `${par[0].nombre} vs ${par[1].nombre}: pronóstico y estadísticas | Min90 Bolivia`;
  let d = `Forma, estadísticas y cara a cara de ${par[0].nombre} vs ${par[1].nombre} en la Primera División de Bolivia.`;
  if (mm) {
    const A = mm.local.nombre;
    const B = mm.visitante.nombre;
    const cuando = `${fmt(mm.fecha)}${mm.hora ? `, ${mm.hora}` : ""}`;
    if (jugado(mm)) {
      t = `${A} ${mm.goles.local}-${mm.goles.visitante} ${B}: resultado y estadísticas | Min90 Bolivia`;
      d = `Resultado y análisis de ${A} vs ${B} (${fmt(mm.fecha)}): forma de ambos, tabla 2026 y cara a cara en la Primera División de Bolivia.`;
    } else {
      t = `${A} vs ${B} (${cuando}): pronóstico y estadísticas | Min90 Bolivia`;
      const sa = statsEquipo2026(mm.local.id);
      const sb = statsEquipo2026(mm.visitante.id);
      const tend = sa.pj && sb.pj ? ` Ambos marcan ${Math.round((pct(sa.btts, sa.pj) + pct(sb.btts, sb.pj)) / 2)}% · Más de 2.5 goles ${Math.round((pct(sa.o25, sa.pj) + pct(sb.o25, sb.pj)) / 2)}%.` : '';
      d = `${A} vs ${B}, ${cuando} (hora de Bolivia).${tend} Forma, tabla 2026 y cara a cara: míralo antes del partido.`;
    }
  }
  return { title: t, description: d, openGraph: { title: t, description: d, type: "website" } };
}

const col = { G: "bg-green-500 text-black", E: "bg-yellow-500 text-black", P: "bg-red-500 text-white" };
const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => {
  const [y, m, d] = String(f).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} ${MESES[m - 1]}`;
};
const cnt = (l, x) => l.filter((r) => r === x).length;
const pct = (x, n) => (n ? Math.round((100 * x) / n) : 0);
const jugado = (m) => !!m && m.estado === "FT" && m.goles.local !== null && m.goles.visitante !== null;

function Nombre({ t, id }) {
  const x = equipos2026.find((q) => q.id === t.id);
  const cls = t.id === id ? "font-bold" : "";
  return x ? <a href={`/equipo/${x.slug}`} className={`hover:text-oro-700 ${cls}`}>{t.nombre}</a> : <span className={cls}>{t.nombre}</span>;
}

function FilaRes({ m, id }) {
  const r = resultado2026(m, id);
  return (
    <tr className="border-t border-slate-200">
      <td className="p-3 text-slate-500">{fmt(m.fecha)}</td>
      <td className="p-3"><Nombre t={m.local} id={id} /></td>
      <td className="p-3 font-bold text-oro-700">{m.goles.local}-{m.goles.visitante}</td>
      <td className="p-3"><Nombre t={m.visitante} id={id} /></td>
      <td className="p-3"><span className={`rounded px-2 py-0.5 text-xs font-bold ${col[r]}`}>{r}</span></td>
    </tr>
  );
}

function Comp({ label, a, b, suf = "", dec = 0 }) {
  const t = a + b;
  const pa = t ? Math.round((a / t) * 100) : 50;
  return (
    <div className="py-2">
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-semibold text-oro-700">{a.toFixed(dec)}{suf}</span>
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-yellow-700">{b.toFixed(dec)}{suf}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded bg-slate-100">
        <div className="bg-green-500" style={{ width: `${pa}%` }} />
        <div className="flex-1 bg-yellow-500" />
      </div>
    </div>
  );
}

export default async function Partido({ params }) {
  const { slug } = await params;
  const par = parse2026(slug);

  if (!par) {
    const old = parseSlugPartido(slug);
    if (!old) notFound();
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <Navbar />
        <section className="mx-auto max-w-3xl px-5 pb-16 pt-10 text-center">
          <Link href="/" className="text-xs text-oro-700">← Volver a pronósticos</Link>
          <h1 className="mt-4 text-2xl font-extrabold">{old[0].nombre} vs {old[1].nombre}</h1>
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            Uno de estos equipos no está en la Primera División 2026. Mira los equipos de esta temporada.
          </p>
          <a href="/equipos" className="mt-4 inline-block text-sm text-oro-700">Ver equipos 2026</a>
        </section>
      </main>
    );
  }

  const [a, b] = par;
  const sa = statsEquipo2026(a.id);
  const sb = statsEquipo2026(b.id);
  const fa = filaDe2026(a.id);
  const fb = filaDe2026(b.id);
  const real = partidoEntre2026(a.id, b.id);
  const duelos = h2h2026(a.id, b.id, 5);
  const d26 = duelos.map((m) => resultado2026(m, a.id));
  const ha = porSlug(a.slug);
  const hb = porSlug(b.slug);
  const hist = ha && hb ? h2h(ha.id, hb.id, 5) : [];
  const dh = hist.map((m) => resultado24(m, ha.id));
  const ultRonda = Math.max(0, ...partidos2026.filter((m) => m.estado === "FT").map((m) => m.ronda));
  const pick = [estrella, ...pronosticos].find((p) => rutaPartido(p.partido) === `/partido/${slug}`);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <div className="bg-slate-100 p-2 text-center text-xs text-slate-700">
        Temporada 2026 · datos hasta la ronda {ultRonda}
      </div>

      <section className="mx-auto max-w-3xl px-5 pb-4 pt-10 text-center">
        <Link href="/" className="text-xs text-oro-700">← Volver a pronósticos</Link>
        <p className="mt-4 text-xs uppercase tracking-widest text-oro-700">Primera División de Bolivia</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <a href={`/equipo/${a.slug}`} className="flex flex-col items-center"><Escudo e={a} size={64} /><span className="mt-1 text-sm font-semibold">{a.nombre}</span></a>
          <span className="text-2xl font-bold text-slate-500">vs</span>
          <a href={`/equipo/${b.slug}`} className="flex flex-col items-center"><Escudo e={b} size={64} /><span className="mt-1 text-sm font-semibold">{b.nombre}</span></a>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          {real ? `${fmt(real.fecha)}${real.hora ? ` · ${real.hora}` : ""} (hora Bolivia)${real.estadio ? ` · ${real.estadio}` : ""} · Ronda ${real.ronda}` : "Fecha por confirmar"}
        </p>
        {jugado(real) ? <p className="mt-1 text-lg font-bold text-oro-700">Resultado final: {real.goles.local}-{real.goles.visitante}</p> : null}
      </section>

      {pick && (
        <section className="mx-auto max-w-3xl px-5 py-4">
          <div className="rounded-2xl border border-oro-500/60 bg-oro-50 p-5">
            <p className="text-xs uppercase text-oro-700">Pronóstico Min90 · {pick.mercado}</p>
            {EJEMPLO ? <p className="text-xs text-yellow-700">Pronóstico de ejemplo</p> : null}
            <p className="mt-1 text-2xl font-bold">{pick.pick}</p>
            <p className="text-sm text-slate-700">Cuota {pick.cuota} · Confianza {"★".repeat(pick.confianza)}{"☆".repeat(3 - pick.confianza)}</p>
            <p className="mt-3 text-sm text-slate-700">{pick.analisis}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <WhatsAppButton texto={`Hola, quiero cargar y jugar ${a.nombre} vs ${b.nombre}. Vi el partido en Min90 Bolivia`}>Quiero cargar</WhatsAppButton>
              <ShareButton texto={`Pronóstico Min90: ${pick.partido} - ${pick.pick} (cuota ${pick.cuota})`} />
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Tabla 2026</h2>
        <div className="grid grid-cols-2 gap-2 text-center text-sm">
          {[[a, fa], [b, fb]].map(([e, f]) => (
            <div key={e.id} className="rounded-xl bg-slate-50 p-3">
              <p className="font-semibold">{e.nombre}</p>
              <p className="text-oro-700">{f ? `#${f.pos} · ${f.pts} pts` : "—"}</p>
              <p className="text-xs text-slate-500">{f ? `PJ ${f.pj} · ${f.g}-${f.e}-${f.p}` : ""}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Forma (últimos 5)</h2>
        <div className="space-y-2">
          {[[a, sa], [b, sb]].map(([e, s]) => (
            <div key={e.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <span className="text-sm font-semibold">{e.nombre}</span>
              <Forma lista={s.forma} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-1 text-xl font-bold">Estadísticas 2026</h2>
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-oro-700">{a.nombre}</span>
          <span className="text-yellow-700">{b.nombre}</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
          <Comp label="Goles a favor por partido" a={sa.promGf} b={sb.promGf} dec={2} />
          <Comp label="Goles en contra por partido" a={sa.promGc} b={sb.promGc} dec={2} />
          <Comp label="Sin recibir gol" a={pct(sa.cs, sa.pj)} b={pct(sb.cs, sb.pj)} suf="%" />
          <Comp label="Ambos marcan" a={pct(sa.btts, sa.pj)} b={pct(sb.btts, sb.pj)} suf="%" />
          <Comp label="Más de 2.5 goles" a={pct(sa.o25, sa.pj)} b={pct(sb.o25, sb.pj)} suf="%" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{a.nombre} de local · {sa.casa.pj} PJ</p>
            <p className="font-bold text-oro-700">{sa.casa.g}-{sa.casa.e}-{sa.casa.p}</p>
            <p className="text-xs text-slate-600">Goles {sa.casa.gf}:{sa.casa.gc}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{b.nombre} de visita · {sb.fuera.pj} PJ</p>
            <p className="font-bold text-yellow-700">{sb.fuera.g}-{sb.fuera.e}-{sb.fuera.p}</p>
            <p className="text-xs text-slate-600">Goles {sb.fuera.gf}:{sb.fuera.gc}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="mb-3 text-xl font-bold">Cara a cara 2026</h2>
        {duelos.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">Aún no se enfrentaron en 2026.</p>
        ) : (
          <>
            <p className="mb-2 text-sm text-slate-700">
              {a.nombre} {cnt(d26, "G")} · Empates {cnt(d26, "E")} · {b.nombre} {cnt(d26, "P")}
            </p>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[520px] text-left text-sm">
                <tbody>{duelos.map((m) => <FilaRes key={m.id} m={m} id={a.id} />)}</tbody>
              </table>
            </div>
          </>
        )}
        {hist.length > 0 && (
          <>
            <h3 className="mb-2 mt-6 text-sm font-bold text-slate-700">Duelos anteriores (2022 a 2024)</h3>
            <p className="mb-2 text-sm text-slate-700">
              {a.nombre} {cnt(dh, "G")} · Empates {cnt(dh, "E")} · {b.nombre} {cnt(dh, "P")}
            </p>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[520px] text-left text-sm">
                <tbody>{hist.map((m) => <FilaPartido key={m.id} m={m} id={ha.id} />)}</tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">La columna G/E/P es desde el punto de vista de {a.nombre}. Último duelo: {fmtFecha(hist[0].fecha)}.</p>
          </>
        )}
      </section>

      <CtaRecarga texto={`Hola, quiero jugar en Metabet y cargar saldo. Vi el partido ${a.nombre} vs ${b.nombre} en Min90 Bolivia. Soy mayor de 18 años.`} />

      <footer className="mx-auto max-w-3xl px-5 pb-16 pt-8 text-center text-xs text-slate-500">
        <p>Solo +18. Juega con responsabilidad.</p>
        <p className="mt-1">Los pronósticos son opiniones y no garantizan resultados.</p>
      </footer>
    </main>
  );
}
