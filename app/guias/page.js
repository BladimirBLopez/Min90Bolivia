import Link from "next/link";
import Navbar from "@/components/Navbar";
import CtaRecarga from "@/components/CtaRecarga";
import { guias } from "@/app/guias/data";

export const metadata = {
  title: "Guías de apuestas deportivas para principiantes | Min90 Bolivia",
  description: "Guías simples sobre cuotas, tipos de apuesta en fútbol y cómo apostar con responsabilidad.",
};

export default function Guias() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-3xl font-extrabold">Guías para apostar mejor</h1>
        <p className="mt-2 text-slate-700">Explicaciones simples para entender cuotas, mercados y cómo mantener el control.</p>
        <div className="mt-6 space-y-3">
          {guias.map((g) => (
            <Link key={g.slug} href={`/guias/${g.slug}`} className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:border-amber-500">
              <p className="text-lg font-bold">{g.titulo}</p>
              <p className="mt-1 text-sm text-slate-600">{g.descripcion}</p>
              <p className="mt-2 text-sm font-semibold text-amber-700">Leer guía →</p>
            </Link>
          ))}
        </div>
      </section>
      <CtaRecarga />
      <footer className="mx-auto max-w-3xl px-5 pb-16 pt-8 text-center text-xs text-slate-500">
        <p>Solo +18. Juega con responsabilidad.</p>
      </footer>
    </main>
  );
}
