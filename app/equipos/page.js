import Navbar from "@/components/Navbar";
import { Escudo } from "@/components/LigaUI";
import { tabla2026, partidos2026 } from "@/lib/liga2026";
import { info2024 } from "@/lib/stats2024";

export const metadata = {
  title: "Equipos de la Primera División de Bolivia 2026 | Min90 Bolivia",
  description: "Los 16 equipos de la Primera División de Bolivia 2026: posición, puntos y estadísticas de cada uno.",
};

export default function Equipos() {
  const tabla = tabla2026();
  const ultRonda = Math.max(0, ...partidos2026.filter((m) => m.estado === "FT").map((m) => m.ronda));
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <div className="bg-slate-100 p-2 text-center text-xs text-slate-700">
        Temporada 2026 · datos hasta la ronda {ultRonda}
      </div>
      <section className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="text-3xl font-extrabold">Equipos de la Primera División</h1>
        <p className="mb-6 mt-1 text-sm text-slate-600">Orden según la tabla 2026.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {tabla.map((t) => {
            const i = info2024(t.nombre);
            const ciudad = i && i.equipo ? i.equipo.ciudad : null;
            return (
              <a key={t.id} href={`/equipo/${t.slug}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center hover:border-oro-500">
                <div className="flex justify-center"><Escudo e={t} size={56} /></div>
                <p className="mt-2 font-semibold">{t.nombre}</p>
                {ciudad ? <p className="text-xs text-slate-500">{ciudad}</p> : null}
                <p className="mt-1 text-xs text-oro-700">#{t.pos} · {t.pts} pts</p>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
