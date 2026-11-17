import Link from "next/link";
import Navbar from "@/components/Navbar";
import { LIGAS_ESPN } from "@/lib/ligasESPN";

export const metadata = {
  title: "Más ligas: Libertadores, Sudamericana, Champions y Amistosos | Min90 Bolivia",
  description: "Calendarios, resultados y detalles de Libertadores, Sudamericana, Champions League y Amistosos Internacionales con horario de Bolivia.",
};

export default function MasLigas() {
  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-5xl px-5 py-10">
        <Link href="/ligas" className="text-sm font-semibold text-oro-700">← Todas las ligas</Link>
        <h1 className="mt-3 text-3xl font-extrabold titulo-oro">Más ligas</h1>
        <p className="mt-2 text-sm text-slate-600">Partidos, resultados y estadísticas disponibles. Horarios de Bolivia.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LIGAS_ESPN.map((liga) => (
            <Link
              key={liga.slug}
              href={`/mas-ligas/${liga.slug}`}
              className="rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white p-5 shadow-md transition hover:shadow-lg"
            >
              <p className="text-xl font-extrabold">{liga.nombre}</p>
              <p className="mt-1 text-sm text-slate-500">{liga.zona}</p>
              <p className="mt-4 text-sm font-bold text-oro-700">Ver partidos ›</p>
            </Link>
          ))}
        </div>

        <p className="mt-7 text-xs text-slate-500">La cobertura de estadísticas y alineaciones depende de cada partido. Datos obtenidos de ESPN mediante una interfaz pública no oficial.</p>
      </section>
    </main>
  );
}
