import Link from "next/link";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Escudo } from "@/components/LigaUI";
import { proximosTodos2026, equipos2026 } from "@/lib/liga2026";

const TITULO = "Recarga ahora en Metabet | Min90 Bolivia";
const DESC = "Te creamos tu cuenta, pagas por QR y cargamos tu saldo por WhatsApp. Picks gratis en el grupo. Solo +18.";
const GRUPO = "https://chat.whatsapp.com/CB3GeNfmOqe31XQGjjDVwN?s=cl&p=a&iam=2";
const MSG = "Hola, quiero recargar ahora en Metabet. Soy mayor de 18 años.";

export const metadata = {
  title: TITULO,
  description: DESC,
  openGraph: { title: TITULO, description: DESC, type: "website", locale: "es_BO" },
  twitter: { card: "summary_large_image", title: TITULO, description: DESC },
};

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => {
  const [y, mo, d] = String(f).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} ${MESES[mo - 1]}`;
};
const slugDe = (id) => equipos2026.find((x) => x.id === id)?.slug;

const chips = ["Cuenta lista", "Pago por QR", "Picks gratis"];

const beneficios = [
  { t: "Te creamos la cuenta", d: "Sin trámites: abrimos tu cuenta en Metabet y te la enviamos por WhatsApp." },
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

export default function RecargaAhora() {
  const m = proximosTodos2026(1)[0] || null;
  const sl = m ? slugDe(m.local.id) : null;
  const sv = m ? slugDe(m.visitante.id) : null;
  const href = sl && sv ? `/partido/${sl}-vs-${sv}` : null;
  const msgPartido = m
    ? `Hola, quiero recargar ahora para jugar ${m.local.nombre} vs ${m.visitante.nombre}. Soy mayor de 18 años.`
    : MSG;

  return (
    <main className="min-h-screen bg-white pb-24 text-slate-900 sm:pb-0">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1c1500] to-[#0b0b0b] px-5 pb-12 pt-10 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Recarga ahora y juega en Metabet
            <span className="block text-oro-400">con atención directa</span>
          </h1>
          <p className="mt-4 text-lg text-slate-200">
            Te creamos tu cuenta, pagas por QR y cargamos tu saldo. Además recibes picks gratis en nuestro grupo.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton texto={MSG} className="w-full sm:w-auto">Recarga ahora</WhatsAppButton>
            <a
              href={GRUPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-oro-400 px-6 py-3 font-bold text-oro-300 hover:bg-white/10"
            >
              Unirme al grupo de picks
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span key={c} className="rounded-full border border-oro-500/60 px-4 py-1.5 text-sm font-semibold text-oro-200">{c}</span>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">Solo mayores de 18 años.</p>
        </div>
      </section>

      {m ? (
        <section className="mx-auto max-w-3xl px-5 pt-8">
          <div className="overflow-hidden rounded-3xl border border-oro-300">
            <div className="flex items-center justify-between bg-oro-50 px-5 py-3 text-sm font-semibold text-oro-800">
              <span>Próximo partido</span>
              <span>{fmt(m.fecha)}{m.hora ? `, ${m.hora}` : ""}</span>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-6">
              <div className="flex flex-1 flex-col items-center text-center">
                <Escudo e={m.local} size={64} />
                <p className="mt-2 font-bold">{m.local.nombre}</p>
              </div>
              <p className="text-2xl font-extrabold text-slate-400">vs</p>
              <div className="flex flex-1 flex-col items-center text-center">
                <Escudo e={m.visitante} size={64} />
                <p className="mt-2 font-bold">{m.visitante.nombre}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-oro-200 p-4 sm:flex-row">
              <WhatsAppButton texto={msgPartido} className="flex-1">Recarga y juega este partido</WhatsAppButton>
              {href ? (
                <Link href={href} className="inline-flex flex-1 items-center justify-center rounded-full border border-oro-500 px-6 py-3 font-bold text-oro-700 hover:bg-oro-50">
                  Ver estadísticas gratis
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-3xl px-5 py-8">
        <h2 className="titulo-oro text-2xl font-extrabold">Así empieza tu recarga</h2>
        <div className="mt-5 space-y-2 rounded-3xl bg-[#ECE5DD] p-4">
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#DCF8C6] px-4 py-2 text-sm text-slate-800">{MSG}</div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm text-slate-800">
            Hola, te creamos tu cuenta en Metabet y te enviamos el QR para pagar.
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm text-slate-800">
            Cuando recibimos tu comprobante, cargamos tu saldo y te avisamos.
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">Ejemplo de cómo es el chat: un mensaje y nosotros hacemos el resto.</p>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-4">
        <h2 className="titulo-oro text-2xl font-extrabold">Por qué recargar con nosotros</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
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
        <p className="mt-4 text-sm text-slate-600">¿Ya tienes cuenta en Metabet? Escríbenos tu usuario y el monto, y te cargamos saldo directo.</p>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#1c1500] to-[#0b0b0b] p-6 text-center text-white">
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

      <footer className="mx-auto max-w-3xl px-5 pb-10 pt-4 text-center text-xs text-slate-500">
        <p>Solo +18. Juega con responsabilidad.</p>
        <p className="mt-1">Los pronósticos son opiniones y no garantizan resultados ni ganancias. Apostar implica riesgo de perder dinero.</p>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-oro-200 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
        <WhatsAppButton texto={MSG} className="w-full">Recarga ahora</WhatsAppButton>
      </div>
    </main>
  );
}
