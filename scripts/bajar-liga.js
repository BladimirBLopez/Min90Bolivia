const fs = require("fs");
const path = require("path");

const KEY = fs.readFileSync(process.env.HOME + "/.min90.env", "utf8").match(/APIFOOTBALL_KEY=(.+)/)[1].trim();
const BASE = "https://v3.football.api-sports.io";
const LIGA = 344; // Primera División de Bolivia
const T = Number(process.argv[2] || 2024);
const OUT = path.join(__dirname, "..", "data", "liga");
fs.mkdirSync(OUT, { recursive: true });

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
let llamadas = 0;

async function api(ruta) {
  if (llamadas > 0) await dormir(7000);
  llamadas++;
  const r = await fetch(BASE + ruta, { headers: { "x-apisports-key": KEY } });
  const j = await r.json();
  const hay = Array.isArray(j.errors) ? j.errors.length : Object.keys(j.errors || {}).length;
  if (hay) throw new Error(ruta + " -> " + JSON.stringify(j.errors));
  console.log("OK", ruta, "| items:", Array.isArray(j.response) ? j.response.length : 1, "| restantes:", r.headers.get("x-ratelimit-requests-remaining"));
  return j.response;
}

const leer = (n) => {
  const p = path.join(OUT, n);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null;
};
const guardar = (n, d) => fs.writeFileSync(path.join(OUT, n), JSON.stringify(d));

const eq = (t) => ({ id: t.id, nombre: t.name, logo: t.logo });
const mapPartido = (x) => ({
  id: x.fixture.id,
  fecha: x.fixture.date,
  estado: x.fixture.status.short,
  estadio: x.fixture.venue && x.fixture.venue.name,
  ronda: x.league.round,
  local: eq(x.teams.home),
  visitante: eq(x.teams.away),
  goles: { local: x.goals.home, visitante: x.goals.away },
});

(async () => {
  let equipos = leer(`equipos-${T}.json`);
  if (!equipos) {
    const r = await api(`/teams?league=${LIGA}&season=${T}`);
    equipos = r.map((x) => ({
      id: x.team.id, nombre: x.team.name, logo: x.team.logo, fundado: x.team.founded,
      estadio: x.venue && x.venue.name, ciudad: x.venue && x.venue.city, capacidad: x.venue && x.venue.capacity,
    }));
    guardar(`equipos-${T}.json`, equipos);
  }

  if (!leer(`tabla-${T}.json`)) guardar(`tabla-${T}.json`, await api(`/standings?league=${LIGA}&season=${T}`));

  for (const s of [T, T - 1, T - 2]) {
    if (s < 2022) continue;
    const n = `partidos-${s}.json`;
    if (!leer(n)) guardar(n, (await api(`/fixtures?league=${LIGA}&season=${s}`)).map(mapPartido));
  }

  for (const e of equipos) {
    const n = `stats-${T}-${e.id}.json`;
    if (!leer(n)) guardar(n, await api(`/teams/statistics?league=${LIGA}&season=${T}&team=${e.id}`));
  }
  console.log("LISTO. Llamadas hechas:", llamadas);
})().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });
