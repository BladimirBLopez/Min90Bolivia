import WhatsAppButton from "@/components/WhatsAppButton";

const links = [
  ["Inicio", "/#inicio"],
  ["Equipos", "/equipos"],
  ["Pronósticos", "/#pronosticos"],
  ["Resultados", "/#resultados"],
  ["Calculadora", "/#calculadora"],
  ["Cómo cargar", "/#cargar"],
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <a href="/#inicio" className="text-xl font-extrabold">
          Min<span className="text-green-500">90</span>
        </a>
        <nav className="hidden gap-5 text-sm text-neutral-300 sm:flex">
          {links.map(([t, h]) => (
            <a key={h} href={h} className="hover:text-green-400">{t}</a>
          ))}
        </nav>
        <WhatsAppButton className="!px-4 !py-2 text-sm">WhatsApp</WhatsAppButton>
      </div>
      <nav className="flex gap-5 overflow-x-auto border-t border-neutral-900 px-4 py-2 text-sm text-neutral-300 sm:hidden">
        {links.map(([t, h]) => (
          <a key={h} href={h} className="whitespace-nowrap">{t}</a>
        ))}
      </nav>
    </header>
  );
}
