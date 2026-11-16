export default function TabsAncla({ items }) {
  return (
    <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map(([t, h]) => (
        <a key={h} href={h} className="whitespace-nowrap rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-oro-500 hover:text-oro-700">{t}</a>
      ))}
    </nav>
  );
}
