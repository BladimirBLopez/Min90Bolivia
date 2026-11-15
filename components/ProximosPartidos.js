import { proximosTodos2026, equipos2026, statsEquipo2026 } from "@/lib/liga2026";
import { Escudo } from "@/components/LigaUI";
import { Chip } from "@/components/Ui";
import { waLinkDe } from "@/components/WhatsAppButton";

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => {
  const [y, m, d] = String(f).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} ${MESES[m - 1]}`;
};
const pct = (x, n) => (n ? Math.round((100 * x) / n) : 0);

export default function ProximosPartidos() {
  const lista = proximosTodos2026(8);
  if (!lista.length) return null;
  const cache = {};
  const stats = (id) => cache[id] || (cache[id] = statsEquipo2026(id));
  const slugDe = (id) => (equipos2026.find((e) => e.id === id) || {}).slug;

  return (
    <section id="partidos" className="mx-auto max-w-5xl px-5 py-10">
      <h2 className="mb-1 text-2xl font-extrabold tracking-tight">Próximos partidos</h2>
      <p className="mb-4 text-sm text-neutral-400">Primera División 2026 · hora de Bolivia. Las tendencias salen de los resultados de la temporada.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {lista.map((m) => {
          const sa = stats(m.local.id);
          const sb = stats(m.visitante.id);
          const ambos = Math.round((pct(sa.btts, sa.pj) + pct(sb.btts, sb.pj)) / 2);
          const o25 = Math.round((pct(sa.o25, sa.pj) + pct(sb.o25, sb.pj)) / 2);
          const slug = `${slugDe(m.local.id)}-vs-${slugDe(m.visitante.id)}`;
          const texto = `Hola, quiero cargar y jugar ${m.local.nombre} vs ${m.visitante.nombre}. Vi el partido en Min90 Bolivia`;
          return (
            <div key={m.id} className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 p-4">
              <p className="text-xs text-neutral-400">
                {fmt(m.fecha)}{m.hora ? ` · ${m.hora}` : ""} · Ronda {m.ronda}
                {m.estadio ? <span className="block text-neutral-600">{m.estadio}</span> : null}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2 text-center">
                <div className="flex flex-1 flex-col items-center"><Escudo e={m.local} size={44} /><span className="mt-1 text-sm font-semibold">{m.local.nombre}</span></div>
                <span className="text-sm font-bold text-neutral-500">vs</span>
                <div className="flex flex-1 flex-col items-center"><Escudo e={m.visitante} size={44} /><span className="mt-1 text-sm font-semibold">{m.visitante.nombre}</span></div>
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Chip tono="verde">Ambos marcan {ambos}%</Chip>
                <Chip tono="amarillo">Más de 2.5 goles {o25}%</Chip>
              </div>
              <div className="mt-4 flex items-center justify-center gap-3">
                <a href={`/partido/${slug}`} className="text-sm font-semibold text-green-400 hover:underline">Ver análisis</a>
                <a href={waLinkDe(texto)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-black hover:bg-green-400">Jugar este partido</a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
