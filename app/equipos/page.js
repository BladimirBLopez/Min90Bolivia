import Link from "next/link";
import Navbar from "@/components/Navbar";
import LigaTabs from "@/components/LigaTabs";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Escudo } from "@/components/LigaUI";
import { tabla2026, partidos2026, equipos2026, proximosTodos2026 } from "@/lib/liga2026";
import { info2024 } from "@/lib/stats2024";

export const metadata = {
  title: "Equipos de la Primera División de Bolivia 2026 | Min90 Bolivia",
  description: "Los 16 equipos de la Primera División de Bolivia 2026: posición, puntos y estadísticas de cada uno.",
};

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => {
  const [y, mo, d] = String(f).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} ${MESES[mo - 1]}`;
};
const jugado = (m) => m.estado === "FT" && m.goles && m.goles.local !== null && m.goles.visitante !== null;
const slugDe = (id) => equipos2026.find((x) => x.id === id)?.slug;

function Fila({ m, hecho }) {
  const sl = slugDe(m.local.id);
  const sv = slugDe(m.visitante.id);
  const href = sl && sv ? `/partido/${sl}-vs-${sv}` : null;
  const cuerpo = (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-16 shrink-0 text-xs text-slate-500">
        <p className="font-semibold">{fmt(m.fecha)}</p>
        <p>{!hecho && m.hora ? m.hora : `R${m.ronda}`}</p>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="flex items-center gap-2 truncate text-sm font-semibold"><Escudo e={m.local} size={20} />{m.local.nombre}</p>
        <p className="flex items-center gap-2 truncate text-sm font-semibold"><Escudo e={m.visitante} size={20} />{m.visitante.nombre}</p>
      </div>
      {hecho ? (
        <div className="text-right text-lg font-extrabold leading-tight text-oro-700">
          <p>{m.goles.local}</p>
          <p>{m.goles.visitante}</p>
        </div>
      ) : (
        <span className="text-xs font-semibold text-oro-700">Ver ›</span>
      )}
    </div>
  );
  return href ? (
    <Link href={href} className="block border-t border-slate-100 first:border-t-0 hover:bg-oro-50">{cuerpo}</Link>
  ) : (
    <div className="border-t border-slate-100 first:border-t-0">{cuerpo}</div>
  );
}

const caja = "overflow-hidden rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white shadow-md shadow-slate-200/70";

export default function Equipos() {
  const tabla = tabla2026();
  const hechos = partidos2026.filter(jugado);
  const ultRonda = Math.max(0, ...hechos.map((m) => m.ronda));
  const proximos = proximosTodos2026(10);
  const ultimos = hechos.slice(-10).reverse();
  const pendientes = partidos2026.filter((m) => !jugado(m)).length;

  const tabs = [
    {
      id: "partidos",
      titulo: "Partidos",
      contenido: (
        <div className="space-y-8">
          <div>
            <h2 className="mb-3 text-xl font-extrabold">Próximos partidos</h2>
            {proximos.length > 0 ? (
              <div className={caja}>{proximos.map((m) => <Fila key={m.id} m={m} hecho={false} />)}</div>
            ) : (
              <p className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500">Pronto publicaremos los próximos partidos.</p>
            )}
          </div>
          {ultimos.length > 0 ? (
            <div>
              <h2 className="mb-3 text-xl font-extrabold">Últimos resultados</h2>
              <div className={caja}>{ultimos.map((m) => <Fila key={m.id} m={m} hecho />)}</div>
            </div>
          ) : null}
        </div>
      ),
    },
    {
      id: "tabla",
      titulo: "Tabla",
      contenido: (
        <div className={caja + " overflow-x-auto"}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3">#</th>
                <th className="px-2 py-3">Equipo</th>
                <th className="px-2 py-3 text-center">PJ</th>
                <th className="px-2 py-3 text-center">DG</th>
                <th className="px-3 py-3 text-center">PTS</th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((t) => (
                <tr key={t.id} className={"border-t border-slate-100 " + (t.pos === 1 ? "bg-oro-50" : "")}>
                  <td className="px-3 py-2.5 text-slate-500">{t.pos}</td>
                  <td className="px-2 py-2.5">
                    <Link href={`/equipo/${t.slug}`} className="flex items-center gap-2 font-semibold text-slate-900 hover:text-oro-700">
                      <Escudo e={t} size={24} />
                      <span className="truncate">{t.nombre}</span>
                    </Link>
                  </td>
                  <td className="px-2 py-2.5 text-center">{t.pj}</td>
                  <td className="px-2 py-2.5 text-center">{t.dif > 0 ? "+" : ""}{t.dif}</td>
                  <td className="px-3 py-2.5 text-center font-bold text-oro-700">{t.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "equipos",
      titulo: "Equipos",
      cuenta: tabla.length,
      contenido: (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {tabla.map((t) => {
            const i = info2024(t.nombre);
            const ciudad = i && i.equipo ? i.equipo.ciudad : null;
            return (
              <Link key={t.id} href={`/equipo/${t.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-oro-500 hover:shadow-md">
                <div className="flex justify-center"><Escudo e={t} size={56} /></div>
                <p className="mt-2 font-semibold">{t.nombre}</p>
                {ciudad ? <p className="text-xs text-slate-500">{ciudad}</p> : null}
                <p className="mt-1 text-xs text-oro-700">#{t.pos} · {t.pts} pts</p>
              </Link>
            );
          })}
        </div>
      ),
    },
  ];

  const datos = [
    ["Equipos", tabla.length],
    ["Por jugar", pendientes],
    ["Jugados", hechos.length],
  ].filter(([, n]) => n > 0);

  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />
      <div className="bg-slate-100 p-2 text-center text-xs text-slate-700">
        Temporada 2026 · datos hasta la ronda {ultRonda}
      </div>
      <section className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="text-3xl font-extrabold titulo-oro">Primera División de Bolivia 2026</h1>
        <p className="mt-2 text-sm text-slate-600">Partidos, tabla y equipos · hora de Bolivia.</p>

        {datos.length > 0 ? (
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {datos.map(([t, n]) => (
              <div key={t} className="rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white p-3 shadow-sm">
                <p className="text-2xl font-extrabold text-oro-700">{n}</p>
                <p className="text-xs text-slate-600">{t}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          <LigaTabs tabs={tabs} />
        </div>

        <div className="mt-10 flex justify-center">
          <WhatsAppButton texto="Hola, quiero recargar para jugar la Primera División de Bolivia. Soy mayor de 18 años.">Recarga ahora</WhatsAppButton>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">Solo +18. Juega con responsabilidad.</p>
      </section>
    </main>
  );
}
