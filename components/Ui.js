const tonos = {
  gris: "bg-white/10 text-neutral-200",
  verde: "bg-green-500/15 text-green-400 ring-1 ring-green-500/30",
  amarillo: "bg-yellow-500/15 text-yellow-300 ring-1 ring-yellow-500/30",
  rojo: "bg-red-500/15 text-red-400 ring-1 ring-red-500/30",
};

export function Chip({ tono = "gris", children }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${tonos[tono] || tonos.gris}`}>{children}</span>;
}

export function Tarjeta({ className = "", children }) {
  return <div className={`rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 ${className}`}>{children}</div>;
}

export function Tabs({ items }) {
  return (
    <nav className="sticky top-[93px] z-30 border-b border-white/10 bg-neutral-950/90 backdrop-blur sm:top-[57px]">
      <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 py-2">
        {items.map(([t, h]) => (
          <a key={h} href={h} className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold text-neutral-300 hover:bg-white/10 hover:text-white">{t}</a>
        ))}
      </div>
    </nav>
  );
}
