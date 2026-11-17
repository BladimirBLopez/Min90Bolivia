import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ActualizadorESPN from "@/components/ActualizadorESPN";
import ExploradorESPN from "@/components/ExploradorESPN";
import { ligaESPN, partidosESPN } from "@/lib/ligasESPN";

export const revalidate = 90;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const liga = ligaESPN(slug);

  return liga
    ? { title: `${liga.nombre}: partidos y resultados | Min90 Bolivia` }
    : {};
}

export default async function LigaExtra({ params }) {
  const { slug } = await params;
  const liga = ligaESPN(slug);

  if (!liga) notFound();

  const {
    partidos,
    error,
    mesesNoDisponibles = [],
  } = await partidosESPN(liga);

  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-5xl px-5 py-8">
        <ActualizadorESPN
          fechas={partidos.map((p) => p.fecha).filter(Boolean).join("|")}
          intervalo={120000}
        />

        <Link
          href="/ligas"
          className="text-sm font-semibold text-oro-700"
        >
          ← Todas las ligas
        </Link>

        <h1 className="mt-3 text-3xl font-extrabold titulo-oro">
          {liga.nombre}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Partidos y resultados · horarios de Bolivia.
        </p>

        <Link
          href={`/mas-ligas/${slug}/equipos`}
          className="mt-5 inline-flex rounded-xl border border-oro-500 bg-white px-5 py-3 text-sm font-bold text-oro-700"
        >
          Ver equipos y estadísticas ›
        </Link>

        {error && (
          <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            ESPN no está disponible temporalmente.
          </p>
        )}

        {mesesNoDisponibles.length > 0 && (
          <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            Algunos meses no pudieron consultarse:
            {" "}{mesesNoDisponibles.join(", ")}.
            Los resultados mostrados pueden estar incompletos.
          </p>
        )}

        <ExploradorESPN
          partidos={partidos}
          slug={slug}
        />

        <p className="mt-8 text-xs text-slate-500">
          Se muestran los meses consultados por Min90Bolivia.
          No representan necesariamente toda la temporada.
          La cobertura de ESPN puede variar.
        </p>
      </section>
    </main>
  );
}
