const col = { G: "bg-green-500 text-black", E: "bg-yellow-500 text-black", P: "bg-red-500 text-white" };
export default function FormaLiga({ lista = [] }) {
  return (
    <span className="inline-flex gap-1">
      {lista.map((r, i) => (
        <span key={i} className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${col[r]}`}>{r}</span>
      ))}
    </span>
  );
}
