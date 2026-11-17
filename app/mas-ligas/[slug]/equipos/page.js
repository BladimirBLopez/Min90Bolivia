import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ligaESPN } from "@/lib/ligasESPN";
import { equiposESPN } from "@/lib/equiposESPN";

export const revalidate = 600;

export default async function EquiposLigaESPN({ params }) {
  const { slug } = await params;
  const liga = ligaESPN(slug);

  if (!liga) notFound();

  let equipos = [];
  let error = false;

  try {
    equipos = await equiposESPN(liga);
  } catch {
    error = true;
  }

  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-5xl px-5 py-8">
        <Link
          href={`/mas-ligas/${slug}`}
          className="text-sm font-bold text-oro-700"
        >
          ← {liga.nombre}
        </Link>

        <h1 className="mt-4 text-3xl font-extrabold titulo-oro">
          Equipos
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {liga.nombre} · información disponible en ESPN
        </p>

        {error ? (
          <p className="mt-6 rounded-xl bg-white p-5 text-sm">
            No se pudo consultar la lista de equipos temporalmente.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {equipos.map((e) => (
              <Link
                key={e.id}
                href={`/mas-ligas/${slug}/equipo/${e.id}`}
                className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm hover:border-oro-500"
              >
                {e.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.logo}
                    alt=""
                    width={55}
                    height={55}
                    loading="lazy"
                    className="h-14 w-14 object-contain"
                  />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 font-bold">
                    {e.nombre[0]}
                  </span>
                )}

                <span className="mt-3 text-sm font-bold">
                  {e.nombre}
                </span>
              </Link>
            ))}
          </div>
        )}

        {!error && !equipos.length && (
          <p className="mt-6 text-sm text-slate-500">
            No hay equipos disponibles en la fuente.
          </p>
        )}
      </section>
    </main>
  );
}
