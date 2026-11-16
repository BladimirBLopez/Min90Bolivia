export const LIGAS_ESPN = [
  { slug: "libertadores", nombre: "Copa Libertadores", codigo: "conmebol.libertadores", zona: "Sudamérica" },
  { slug: "sudamericana", nombre: "Copa Sudamericana", codigo: "conmebol.sudamericana", zona: "Sudamérica" },
  { slug: "champions", nombre: "UEFA Champions League", codigo: "uefa.champions", zona: "Europa" },
];

export const ligaESPN = (slug) => LIGAS_ESPN.find((l) => l.slug === slug) || null;

const BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/";

const numero = (v) => {
  const n = typeof v === "object" && v !== null ? (v.value ?? v.displayValue) : v;
  if (n === null || n === undefined || n === "") return null;
  const x = Number(n);
  return Number.isFinite(x) ? x : null;
};

const equipo = (c) => ({
  id: String(c?.team?.id || ""),
  nombre: c?.team?.displayName || c?.team?.name || "Equipo por confirmar",
  logo: /^https:\/\//.test(c?.team?.logo || "") ? c.team.logo : null,
  goles: numero(c?.score),
});

export function normalizarPartido(e) {
  const c = e?.competitions?.[0];
  const competidores = c?.competitors || [];
  const local = competidores.find((x) => x.homeAway === "home");
  const visita = competidores.find((x) => x.homeAway === "away");

  if (!e?.id || !local || !visita) return null;

  const fase = e.status?.type?.state || c.status?.type?.state || "pre";

  return {
    id: String(e.id),
    fecha: e.date || c.date || "",
    fase,
    minuto: e.status?.displayClock || c.status?.displayClock || "",
    estado: e.status?.type?.shortDetail || c.status?.type?.shortDetail || "",
    estadio: c.venue?.fullName || "",
    local: equipo(local),
    visitante: equipo(visita),
  };
}

async function pedir(codigo, ruta, segundos) {
  const r = await fetch(`${BASE}${codigo}/${ruta}`, {
    next: { revalidate: segundos },
    signal: AbortSignal.timeout(12000),
  });

  if (!r.ok) throw new Error(`ESPN HTTP ${r.status}`);

  return r.json();
}

export async function partidosESPN(liga) {
  const mes = (dias) => new Date(Date.now() + dias * 86400000)
    .toISOString().slice(0, 7).replace("-", "");

  const meses = [...new Set([-10, 0, 35].map(mes))];

  const respuestas = await Promise.all(meses.map(async (m) => {
    try {
      const d = await pedir(liga.codigo, `scoreboard?dates=${m}&limit=200`, 90);
      return { ok: true, eventos: Array.isArray(d.events) ? d.events : [] };
    } catch {
      return { ok: false, eventos: [] };
    }
  }));

  let respondio = respuestas.some((r) => r.ok);
  let eventos = respuestas.flatMap((r) => r.eventos);

  if (!eventos.length) {
    try {
      const d = await pedir(liga.codigo, "scoreboard?limit=100", 90);
      respondio = true;
      eventos = Array.isArray(d.events) ? d.events : [];
    } catch {
      // Conservar las respuestas mensuales disponibles.
    }
  }

  const vistos = new Set();
  const partidos = eventos
    .filter((e) => {
      if (!e?.id || vistos.has(String(e.id))) return false;
      vistos.add(String(e.id));
      return true;
    })
    .map(normalizarPartido)
    .filter(Boolean)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  return { partidos, error: !respondio };
}

export async function detalleESPN(liga, id) {
  if (!/^\d{6,12}$/.test(String(id))) return null;

  const d = await pedir(liga.codigo, `summary?event=${id}`, 60);
  const competencia = d.header?.competitions?.[0];

  if (!competencia) return null;

  const partido = normalizarPartido({
    id,
    date: competencia.date || d.header?.date,
    status: competencia.status || d.header?.status,
    competitions: [competencia],
  });

  if (!partido) return null;

  const equipos = d.boxscore?.teams || [];

  const buscar = (idEquipo) => equipos.find(
    (x) => String(x.team?.id) === idEquipo
  );

  const a = buscar(partido.local.id);
  const b = buscar(partido.visitante.id);

  const dato = (t, clave) => {
    const v = (t?.statistics || []).find(
      (s) => String(s.label || s.name || "").toLowerCase() === clave.toLowerCase()
    );
    return v?.displayValue ?? v?.value ?? null;
  };

  const claves = [
    ["Possession", "Posesión"],
    ["SHOTS", "Tiros"],
    ["ON GOAL", "Tiros al arco"],
    ["Corner Kicks", "Córners"],
    ["Fouls", "Faltas"],
    ["Yellow Cards", "Tarjetas amarillas"],
    ["Red Cards", "Tarjetas rojas"],
    ["Offsides", "Fueras de juego"],
    ["Saves", "Atajadas"],
    ["Passes", "Pases"],
  ];

  const estadisticas = partido.fase === "pre" ? [] : claves.map(
    ([clave, titulo]) => ({
      titulo,
      local: dato(a, clave),
      visitante: dato(b, clave),
    })
  ).filter((x) => x.local !== null || x.visitante !== null);

  const eventos = (d.keyEvents || []).slice(0, 60).map((e) => ({
    id: String(e.id || ""),
    minuto: e.clock?.displayValue || "",
    tipo: e.type?.text || "Incidencia",
    equipo: e.team?.displayName || "",
    descripcion: String(e.text || "").slice(0, 180),
  }));

  const alineaciones = (d.rosters || []).map((r) => ({
    equipo: r.team?.displayName || "Equipo",
    formacion: r.formation || "",
    titulares: (r.roster || [])
      .filter((p) => p.starter === true)
      .slice(0, 11)
      .map((p) => ({
        nombre: p.athlete?.displayName || "",
        dorsal: p.jersey || "",
      })),
  })).filter((r) => r.titulares.length);

  return { partido, estadisticas, eventos, alineaciones };
}

export function horaBolivia(valor) {
  const d = new Date(valor);

  if (!Number.isFinite(d.getTime())) return "Horario por confirmar";

  return new Intl.DateTimeFormat("es-BO", {
    timeZone: "America/La_Paz",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d) + " (Bolivia)";
}
