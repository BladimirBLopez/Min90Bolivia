import Link from "next/link";
import Navbar from "@/components/Navbar";
import { GRUPOS_LIGAS } from "@/lib/navegacionLigas";

export const metadata = {
  title: "Ligas y torneos | Min90 Bolivia",
  description: "Todas las ligas y competiciones disponibles en Min90Bolivia, con resultados y horarios de Bolivia.",
};

const card = "block rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md";

export default function LigasPage() {
  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="text-3xl font-extrabold titulo-oro">
          Ligas y torneos
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Explora las competiciones, sus partidos y resultados. Horarios de Bolivia.
        </p>

        {GRUPOS_LIGAS.map((grupo) => (
          <section key={grupo.nombre} className="mt-8">
            <h2 className="mb-4 text-xl font-extrabold">
              {grupo.nombre}
            </h2>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {grupo.ligas.map((liga) => (
                <Link key={liga.href} href={liga.href} className={card}>
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="text-2xl">
                      {liga.icono}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold">{liga.nombre}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {liga.descripcion}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-bold text-oro-700">
                    Ver partidos ›
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
