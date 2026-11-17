import {
  normalizarPartido,
  partidosESPN,
} from "@/lib/ligasESPN";

const BASE =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/";

async function consultar(liga, ruta) {
  const respuesta = await fetch(
    `${BASE}${liga.codigo}/${ruta}`,
    {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(12000),
    }
  );

  if (!respuesta.ok) {
    throw new Error("ESPN HTTP " + respuesta.status);
  }

  return respuesta.json();
}

function normalizarEquipo(t) {
  const logos = Array.isArray(t?.logos) ? t.logos : [];
  const logo = t?.logo ||
    logos.find((x) =>
      x?.rel?.includes("default") &&
      /^https:\/\//.test(x.href || "")
    )?.href ||
    logos.find((x) =>
      /^https:\/\//.test(x?.href || "")
    )?.href ||
    null;

  return {
    id: String(t?.id || ""),
    nombre: t?.displayName || t?.name || "Equipo",
    logo: /^https:\/\//.test(logo || "") ? logo : null,
  };
}

export async function equiposESPN(liga) {
  const datos = await consultar(liga, "teams");
  const lista = datos.sports?.[0]?.leagues?.[0]?.teams;

  if (!Array.isArray(lista)) {
    throw new Error("Lista de equipos no disponible");
  }

  const vistos = new Set();

  return lista
    .map((x) => normalizarEquipo(x.team || x))
    .filter((t) => {
      if (!t.id || vistos.has(t.id)) return false;
      vistos.add(t.id);
      return true;
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export async function fichaEquipoESPN(liga, id) {
  const temporada = new Date(
    Date.now() - 4 * 3600000
  ).getUTCFullYear();

  const respuestas = await Promise.allSettled([
    consultar(liga, `teams/${id}`),
    consultar(liga, `teams/${id}/schedule?season=${temporada}`),
    partidosESPN(liga),
  ]);

  const ficha = respuestas[0].status === "fulfilled"
    ? respuestas[0].value : null;

  const calendario = respuestas[1].status === "fulfilled"
    ? respuestas[1].value : null;

  const resultadoMarcadores =
    respuestas[2].status === "fulfilled"
      ? respuestas[2].value : null;

  const marcadores = resultadoMarcadores?.partidos || [];

  const equipo = normalizarEquipo(
    ficha?.team || calendario?.team
  );

  if (!equipo.id || equipo.id !== String(id)) {
    return null;
  }

  const mapa = new Map();

  for (const evento of calendario?.events || []) {
    const partido = normalizarPartido(evento);

    if (partido) {
      mapa.set(partido.id, partido);
    }
  }

  // Los marcadores mensuales tienen estados confirmados
  // y prevalecen sobre el calendario si coinciden por ID.
  for (const partido of marcadores) {
    if (
      partido.local.id === equipo.id ||
      partido.visitante.id === equipo.id
    ) {
      mapa.set(partido.id, partido);
    }
  }

  const partidos = [...mapa.values()]
    .filter((p) =>
      p.local.id === equipo.id ||
      p.visitante.id === equipo.id
    )
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  const finalizados = partidos.filter(
    (p) =>
      p.fase === "post" &&
      Number.isFinite(p.local.goles) &&
      Number.isFinite(p.visitante.goles)
  );

  const estadisticas = {
    pj: finalizados.length,
    g: 0,
    e: 0,
    p: 0,
    gf: 0,
    gc: 0,
  };

  for (const partido of finalizados) {
    const local = partido.local.id === equipo.id;
    const favor = local
      ? partido.local.goles : partido.visitante.goles;
    const contra = local
      ? partido.visitante.goles : partido.local.goles;

    estadisticas.gf += favor;
    estadisticas.gc += contra;

    if (favor > contra) estadisticas.g++;
    else if (favor === contra) estadisticas.e++;
    else estadisticas.p++;
  }

  return {
    equipo,
    partidos,
    estadisticas,
    calendarioDisponible: respuestas[1].status === "fulfilled",
    datosParciales:
      respuestas.some((r) => r.status === "rejected") ||
      Boolean(resultadoMarcadores?.error) ||
      Boolean(resultadoMarcadores?.mesesNoDisponibles?.length),
  };
}
