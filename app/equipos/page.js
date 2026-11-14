import Navbar from "@/components/Navbar";
import { Escudo, AvisoPrueba } from "@/components/LigaUI";
import { tabla, porId, TEMPORADA } from "@/lib/liga";

export const metadata = {
  title: "Equipos de la Primera División de Bolivia | Min90 Bolivia",
  description: "Todos los equipos de la Primera División de Bolivia: posición, forma y estadísticas.",
};

export default function Equipos() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <AvisoPrueba />
      <section className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="text-3xl font-extrabold">Equipos de la Primera División</h1>
        <p className="mb-6 mt-1 text-sm text-neutral-400">Orden según la tabla {TEMPORADA}.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {tabla.map((t) => {
            const e = porId(t.id);
            if (!e) return null;
            return (
              <a key={e.id} href={`/equipo/${e.slug}`} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-center hover:border-green-500">
                <div className="flex justify-center"><Escudo e={e} size={56} /></div>
                <p className="mt-2 font-semibold">{e.nombre}</p>
                <p className="text-xs text-neutral-500">{e.ciudad}</p>
                <p className="mt-1 text-xs text-green-400">#{t.pos} · {t.pts} pts</p>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
