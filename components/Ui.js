const tonos = {
  gris: "bg-slate-100 text-slate-700",
  verde: "bg-oro-400/20 text-oro-800 ring-1 ring-oro-500/40",
  amarillo: "bg-yellow-500/15 text-yellow-700 ring-1 ring-yellow-500/30",
  rojo: "bg-red-500/15 text-red-600 ring-1 ring-red-500/30",
};

export function Chip({ tono = "gris", children }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${tonos[tono] || tonos.gris}`}>{children}</span>;
}

export function Tarjeta({ className = "", children }) {
  return <div className={`rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 ${className}`}>{children}</div>;
}

export function Tabs({ items }) {
  return (
    <nav className="sticky top-[93px] z-30 border-b border-slate-200 bg-white/90 backdrop-blur sm:top-[57px]">
      <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 py-2">
        {items.map(([t, h]) => (
          <a key={h} href={h} className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900">{t}</a>
        ))}
      </div>
    </nav>
  );
}
