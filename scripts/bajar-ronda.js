const fs = require("fs");
const path = require("path");
const [ID, SEASON, DIR, ROUNDS] = process.argv.slice(2);
if (!ID || !SEASON || !DIR || !ROUNDS) {
  console.error("uso: node scripts/bajar-ronda.js ID TEMPORADA CARPETA RONDAS");
  process.exit(1);
}
const OUT = path.join(__dirname, "..", "data", DIR);
fs.mkdirSync(OUT, { recursive: true });
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function ronda(r) {
  const u = `https://www.thesportsdb.com/api/v1/json/123/eventsround.php?id=${ID}&r=${r}&s=${SEASON}`;
  for (let i = 0; i < 4; i++) {
    const res = await fetch(u);
    if (res.status === 429) {
      console.log("429, espero 65s");
      await dormir(65000);
      continue;
    }
    if (!res.ok) throw new Error("HTTP " + res.status);
    return (await res.json()).events || [];
  }
  throw new Error("429 repetido en ronda " + r);
}

(async () => {
  for (let r = 1; r <= Number(ROUNDS); r++) {
    const f = path.join(OUT, `ronda-${r}.json`);
    if (fs.existsSync(f)) { console.log("ya existe", r); continue; }
    const ev = await ronda(r);
    if (ev.length) fs.writeFileSync(f, JSON.stringify({ events: ev }));
    console.log(DIR, "ronda", r, ev.length, "partidos");
    await dormir(5000);
  }
  console.log("LISTO", DIR);
})().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });
