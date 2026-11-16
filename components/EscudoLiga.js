export default function EscudoLiga({ e, size = 40 }) {
  if (!e || !e.logo) {
    return (
      <span style={{ width: size, height: size }} className="flex shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
        {e && e.nombre ? e.nombre[0] : "?"}
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={e.logo} alt={e.nombre} width={size} height={size} loading="lazy" className="shrink-0 object-contain" style={{ width: size, height: size }} />;
}
