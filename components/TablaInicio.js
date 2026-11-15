import { tabla2026, partidos2026 } from "@/lib/liga2026";
import { Escudo } from "@/components/LigaUI";

const punto = { G: "bg-green-500", E: "bg-yellow-500", P: "bg-red-500" };
const sign = (n) => (n > 0 ? `+${n}` : `${n}`);

export default function TablaInicio() {
  const tabla = tabla2026();
  const ultRonda = Math.max(0, ...partidos2026.filter((m) => m.estado === "FT").map((m) => m.ronda));
  return (
    <section id="tabla" className="mx-auto max-w-5xl px-5 py-10">
      <h2 className="mb-1 text-2xl font-extrabold tracking-tight">Tabla de posiciones 2026</h2>
      <p className="mb-4 text-xs text-slate-400">Primera División de Bolivia · datos hasta la ronda {ultRonda}</p>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="bg-slate-900 text-xs uppercase text-slate-500">
            <tr><th className="p-3">#</th><th className="p-3">Equipo</th><th className="p-3">PJ</th><th className="p-3">DG</th><th className="p-3">Pts</th><th className="p-3">Forma</th></tr>
          </thead>
          <tbody>
            {tabla.map((t) => (
              <tr key={t.id} className="border-t border-white/5">
                <td className="p-3 text-slate-500">{t.pos}</td>
                <td className="p-3">
                  <a href={`/equipo/${t.slug}`} className="flex items-center gap-2 font-semibold hover:text-green-400">
                    <Escudo e={t} size={22} />{t.nombre}
                  </a>
                </td>
                <td className="p-3">{t.pj}</td>
                <td className="p-3">{sign(t.dif)}</td>
                <td className="p-3 font-bold text-green-400">{t.pts}</td>
                <td className="p-3"><div className="flex gap-1">{t.forma.map((r, i) => <span key={i} className={`h-2.5 w-2.5 rounded-full ${punto[r]}`} />)}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
