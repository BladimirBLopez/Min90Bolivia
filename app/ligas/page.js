import Link from "next/link";
import Navbar from "@/components/Navbar";
import { LIGAS } from "@/lib/ligas";

export const metadata = {
  title: "Ligas y torneos | Min90 Bolivia",
  description: "Partidos y tablas de más ligas y torneos, con hora de Bolivia. Si quieres jugar, te cargo por WhatsApp.",
};

const card = "block rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white p-5 shadow-md shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-lg";

export default function LigasPage() {
  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="text-3xl font-extrabold titulo-oro">Ligas y torneos</h1>
        <p className="mt-2 text-sm text-slate-600">Horario de Bolivia. Elige una liga para ver sus partidos.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/#pronosticos" className={card}>
            <p className="text-lg font-bold">Primera División de Bolivia</p>
            <p className="text-sm text-slate-600">Bolivia · 2026</p>
            <p className="mt-3 text-sm font-semibold text-oro-700">Ver partidos ›</p>
          </Link>
          {LIGAS.map((l) => (
            <Link key={l.slug} href={`/liga/${l.slug}`} className={card}>
              <p className="text-lg font-bold">{l.nombre}</p>
              <p className="text-sm text-slate-600">{l.pais} · {l.temporada}</p>
              <p className="mt-3 text-sm font-semibold text-oro-700">Ver partidos ›</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
