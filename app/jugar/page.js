import Link from "next/link";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

const TITULO = "Recarga ahora en Metabet con atención directa por WhatsApp | Min90 Bolivia";
const DESC = "Te creamos tu cuenta, pagas por QR y cargamos tu saldo. Además recibes picks gratis en nuestro grupo de WhatsApp.";
const GRUPO = "https://chat.whatsapp.com/CB3GeNfmOqe31XQGjjDVwN?s=cl&p=a&iam=2";
const MSG = "Hola, quiero recargar ahora en Metabet. Soy mayor de 18 años.";

export const metadata = {
  title: TITULO,
  description: DESC,
  openGraph: { title: TITULO, description: DESC, type: "website", locale: "es_BO" },
  twitter: { card: "summary_large_image", title: TITULO, description: DESC },
};

const beneficios = [
  { t: "Te creamos la cuenta", d: "Sin trámites: nosotros abrimos tu cuenta en Metabet y te la enviamos por WhatsApp." },
  { t: "Pagas por QR", d: "Escaneas el QR desde la app de tu banco, sin complicarte." },
  { t: "Atención directa", d: "Hablas con una persona por WhatsApp, no con un formulario." },
  { t: "Picks gratis en el grupo", d: "Publicamos pronósticos gratis en nuestro grupo de WhatsApp." },
  { t: "Estadísticas gratis", d: "Tabla, forma y cara a cara de cada partido de la liga boliviana, en esta web." },
];

const pasos = [
  { t: "Escríbenos por WhatsApp", d: "Dinos que quieres jugar y cuánto quieres cargar." },
  { t: "Te creamos tu cuenta", d: "Te enviamos tu usuario y contraseña de Metabet." },
  { t: "Pagas por QR", d: "Te mandamos el QR. Pagas y nos envías el comprobante." },
  { t: "Recibes tu saldo", d: "Cargamos tu cuenta y te avisamos. Ya puedes jugar." },
];

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-oro-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12.5 2.8 2.8L16 9.5" />
    </svg>
  );
}

export default function Jugar() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <section className="bg-gradient-to-b from-oro-50 to-white px-5 pb-10 pt-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Recarga ahora y juega en Metabet con atención directa
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Te creamos tu cuenta, pagas por QR y cargamos tu saldo. Además recibes picks gratis en nuestro grupo.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton texto={MSG} className="w-full sm:w-auto">Recarga ahora</WhatsAppButton>
            <a
              href={GRUPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-oro-500 px-6 py-3 font-bold text-oro-700 hover:bg-oro-50"
            >
              Unirme al grupo de picks
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500">Solo mayores de 18 años.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-8">
        <h2 className="titulo-oro text-2xl font-extrabold">Por qué jugar con nosotros</h2>
        <ul className="mt-5 space-y-4">
          {beneficios.map((b) => (
            <li key={b.t} className="flex gap-3 rounded-2xl border border-oro-200 bg-white p-4">
              <Check />
              <div>
                <p className="font-bold">{b.t}</p>
                <p className="mt-1 text-sm text-slate-600">{b.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-8">
        <h2 className="titulo-oro text-2xl font-extrabold">Cómo funciona</h2>
        <ol className="mt-5 space-y-3">
          {pasos.map((p, i) => (
            <li key={p.t} className="flex gap-4 rounded-2xl bg-oro-50 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-oro-500 font-bold text-white">{i + 1}</span>
              <div>
                <p className="font-bold">{p.t}</p>
                <p className="text-sm text-slate-600">{p.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-8">
        <div className="rounded-3xl bg-slate-900 p-6 text-center text-white">
          <h2 className="text-2xl font-extrabold">¿Listo para recargar?</h2>
          <p className="mt-2 text-sm text-slate-300">Escríbenos y te atendemos directo por WhatsApp.</p>
          <div className="mt-5 flex justify-center">
            <WhatsAppButton texto={MSG}>Recarga ahora</WhatsAppButton>
          </div>
          <Link href="/pronosticos-hoy" className="mt-4 inline-block text-sm text-oro-300 underline">
            Antes, mira los próximos partidos y estadísticas
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-3xl px-5 pb-16 pt-4 text-center text-xs text-slate-500">
        <p>Solo +18. Juega con responsabilidad.</p>
        <p className="mt-1">Los pronósticos son opiniones y no garantizan resultados ni ganancias. Apostar implica riesgo de perder dinero.</p>
      </footer>
    </main>
  );
}
