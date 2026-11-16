import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";

const links = [
  ["Inicio", "/#inicio"],
  ["Equipos", "/equipos"],
  ["Pronósticos", "/#pronosticos"],
  ["Picks gratis", "/pronosticos-hoy"],
  ["Guías", "/guias"],
  ["Resultados", "/#resultados"],
  ["Calculadora", "/#calculadora"],
  ["Recargar", "/recargar"],
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-oro-300 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/#inicio" className="flex items-center gap-2 text-2xl font-black tracking-tight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-min90.png" alt="Min90 Bolivia" width={40} height={40} className="h-10 w-10 rounded-xl" />
          <span>Min<span className="text-oro-600">90</span></span>
        </Link>
        <nav className="hidden gap-5 text-sm text-slate-700 sm:flex">
          {links.map(([t, h]) => (
            <a key={h} href={h} className="hover:text-oro-700">{t}</a>
          ))}
        </nav>
        <WhatsAppButton className="!px-4 !py-2 text-sm">WhatsApp</WhatsAppButton>
      </div>
      <nav className="flex gap-5 overflow-x-auto border-t border-slate-100 px-4 py-2 text-sm text-slate-700 sm:hidden">
        {links.map(([t, h]) => (
          <a key={h} href={h} className="whitespace-nowrap">{t}</a>
        ))}
      </nav>
    </header>
  );
}
