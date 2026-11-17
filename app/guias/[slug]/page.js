import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { guias } from "@/app/guias/data";

export function generateStaticParams() {
  return guias.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = guias.find((x) => x.slug === slug);
  if (!g) return {};
  const title = `${g.titulo} | Min90 Bolivia`;
  return { title, description: g.descripcion, openGraph: { title, description: g.descripcion, type: "article" } };
}

export default async function Guia({ params }) {
  const { slug } = await params;
  const g = guias.find((x) => x.slug === slug);
  if (!g) notFound();
  const otras = guias.filter((x) => x.slug !== slug);
  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />
      <article className="mx-auto max-w-3xl px-5 py-8">
        <Link href="/guias" className="text-sm text-oro-700">← Todas las guías</Link>
        <h1 className="mt-4 text-3xl font-extrabold">{g.titulo}</h1>
        <p className="mt-3 text-slate-700">{g.intro}</p>
        {g.secciones.map((s, i) => (
          <section key={i} className="mt-8">
            <h2 className="text-xl font-bold">{s.t}</h2>
            {s.p.map((t, j) => (
              <p key={j} className="mt-2 text-slate-700">{t}</p>
            ))}
            {s.lista ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
                {s.lista.map((t, j) => (
                  <li key={j}>{t}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-bold">Más guías</p>
          <ul className="mt-2 space-y-1 text-sm">
            {otras.map((o) => (
              <li key={o.slug}>
                <Link href={`/guias/${o.slug}`} className="text-oro-700 hover:underline">{o.titulo}</Link>
              </li>
            ))}
            <li>
              <Link href="/pronosticos-hoy" className="text-oro-700 hover:underline">Próximos partidos y estadísticas</Link>
            </li>
          </ul>
        </div>
      </article>
      <footer className="mx-auto max-w-3xl px-5 pb-16 pt-8 text-center text-xs text-slate-500">
        <p>Solo +18. Juega con responsabilidad.</p>
        <p className="mt-1">Esta guía es informativa y no garantiza resultados ni ganancias.</p>
      </footer>
    </main>
  );
}
