import Link from "next/link";
import {
  ligaESPN,
  partidosESPN,
  horaBolivia,
} from "@/lib/ligasESPN";
import { fechaActualBolivia } from "@/lib/fechaPartidos";

const SLUG = "amistosos-internacionales";

const SUDAMERICA = new Set([
  "Argentina",
  "Bolivia",
  "Brazil",
  "Brasil",
  "Chile",
  "Colombia",
  "Ecuador",
  "Paraguay",
  "Peru",
  "Perú",
  "Uruguay",
  "Venezuela",
  "Guyana",
  "Suriname",
]);

function diaBolivia(fecha) {
  const tiempo = Date.parse(fecha);

  if (!Number.isFinite(tiempo)) return "";

  return new Date(tiempo - 4 * 3600000)
    .toISOString()
    .slice(0, 10);
}

function esSudamericano(partido) {
  return (
    SUDAMERICA.has(partido.local.nombre) ||
    SUDAMERICA.has(partido.visitante.nombre)
  );
}

function estadoPartido(partido, ahora) {
  const inicio = Date.parse(partido.fecha);

  if (partido.fase === "in") {
    return {
      texto: "🔴 EN VIVO",
      estilo: "bg-red-600 text-white",
    };
  }

  if (partido.fase === "post" && inicio <= ahora) {
    return {
      texto: "FINAL",
      estilo: "bg-slate-100 text-slate-700",
    };
  }

  if (inicio > ahora && partido.fase === "pre") {
    return {
      texto: "PRÓXIMO",
      estilo: "bg-amber-100 text-amber-900",
    };
  }

  return {
    texto: "POR CONFIRMAR",
    estilo: "bg-slate-100 text-slate-600",
  };
}

function Escudo({ equipo }) {
  if (!equipo.logo) {
    return (
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-bold">
        {equipo.nombre.slice(0, 1)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={equipo.logo}
      alt=""
      width={48}
      height={48}
      loading="lazy"
      className="h-12 w-12 object-contain"
    />
  );
}

function Tarjeta({ partido, ahora }) {
  const estado = estadoPartido(partido, ahora);

  const mostrarMarcador =
    (partido.fase === "in" ||
      (partido.fase === "post" &&
        Date.parse(partido.fecha) <= ahora)) &&
    Number.isFinite(partido.local.goles) &&
    Number.isFinite(partido.visitante.goles);

  const marcador = mostrarMarcador
    ? `${partido.local.goles} - ${partido.visitante.goles}`
    : "VS";

  return (
    <Link
      href={`/mas-ligas/${SLUG}/partido/${partido.id}`}
      className="block rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white p-4 shadow-sm transition hover:border-oro-500 hover:shadow-md"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-600">
          {horaBolivia(partido.fecha)}
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${estado.estilo}`}
        >
          {estado.texto}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
        <div className="flex min-w-0 flex-col items-center gap-2">
          <Escudo equipo={partido.local} />
          <span className="text-sm font-bold leading-tight">
            {partido.local.nombre}
          </span>
        </div>

        <strong className="whitespace-nowrap text-lg font-black text-oro-700">
          {marcador}
        </strong>

        <div className="flex min-w-0 flex-col items-center gap-2">
          <Escudo equipo={partido.visitante} />
          <span className="text-sm font-bold leading-tight">
            {partido.visitante.nombre}
          </span>
        </div>
      </div>

      <p className="mt-4 text-center text-xs font-semibold text-oro-700">
        Ver detalles y estadísticas ›
      </p>
    </Link>
  );
}

export default async function AmistososInicio() {
  const liga = ligaESPN(SLUG);

  if (!liga) return null;

  let partidos = [];
  let datosParciales = false;

  try {
    const resultado = await partidosESPN(liga);
    partidos = resultado.partidos;
    datosParciales =
      resultado.error ||
      resultado.mesesNoDisponibles.length > 0;
  } catch (error) {
    console.error(
      "[amistosos inicio]",
      error?.message || String(error)
    );
    datosParciales = true;
  }

  const ahora = Date.now();
  const hoy = fechaActualBolivia(ahora);

  const prioridad = (partido) => {
    if (partido.fase === "in") return 0;

    if (diaBolivia(partido.fecha) === hoy) {
      return esSudamericano(partido) ? 1 : 2;
    }

    return esSudamericano(partido) ? 3 : 4;
  };

  const visibles = partidos
    .filter((partido) => {
      const inicio = Date.parse(partido.fecha);

      if (!Number.isFinite(inicio)) return false;

      const enVivoReciente =
        partido.fase === "in" &&
        Math.abs(ahora - inicio) < 48 * 3600000;

      const esHoy = diaBolivia(partido.fecha) === hoy;

      const futuro =
        partido.fase === "pre" &&
        inicio > ahora;

      return enVivoReciente || esHoy || futuro;
    })
    .sort(
      (a, b) =>
        prioridad(a) - prioridad(b) ||
        Date.parse(a.fecha) - Date.parse(b.fecha)
    )
    .slice(0, 12);

  return (
    <section
      id="amistosos"
      className="mx-auto max-w-5xl px-5 pb-10 pt-3"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold titulo-oro">
            🌎 Amistosos Internacionales
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Selecciones sudamericanas y del mundo.
            Partidos de hoy, en vivo y próximos.
          </p>
        </div>

        <Link
          href={`/mas-ligas/${SLUG}`}
          className="rounded-full border border-oro-500 bg-white px-4 py-2 text-sm font-bold text-oro-700"
        >
          Ver todos los amistosos ›
        </Link>
      </div>

      {datosParciales && (
        <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
          Algunos datos de ESPN no están disponibles temporalmente.
        </p>
      )}

      {visibles.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((partido) => (
            <Tarjeta
              key={partido.id}
              partido={partido}
              ahora={ahora}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          No hay amistosos de hoy ni próximos encuentros
          disponibles en los datos consultados.
          Puedes revisar el calendario completo.
        </div>
      )}
    </section>
  );
}
