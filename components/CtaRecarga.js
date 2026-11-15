import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";

const GRUPO = "https://chat.whatsapp.com/CB3GeNfmOqe31XQGjjDVwN?s=cl&p=a&iam=2";

export default function CtaRecarga() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-6">
      <div className="rounded-3xl border border-green-500/40 bg-gradient-to-br from-green-950/60 to-slate-900 p-6 text-center">
        <h2 className="text-xl font-extrabold">¿Quieres jugar?</h2>
        <p className="mt-2 text-sm text-slate-300">
          Recarga tu saldo en Metabet pagando por QR y recibe los pronósticos gratis en nuestro grupo de WhatsApp.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <WhatsAppButton texto="Hola, quiero recargar mi saldo en Metabet. Mi usuario es: ">Recargar por WhatsApp</WhatsAppButton>
          <a
            href={GRUPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-green-500 px-6 py-3 font-bold text-green-400 hover:bg-green-500/10"
          >
            Picks gratis en el grupo
          </a>
        </div>
        <Link href="/recargar" className="mt-4 inline-block text-sm text-slate-400 underline">
          Ver cómo recargar paso a paso
        </Link>
      </div>
    </section>
  );
}
