const fs = require("fs");
const path = require("path");

const LIGAS = { bolivia: "liga2026", brasil: "ligas/brasil-2026", nations: "ligas/nations-league-2026" };
const FIN = new Set(["FT", "AET", "PEN", "AOT", "CANC", "Match Finished", "Cancelled"]);

const args = process.argv.slice(2);
const solover = args.includes("--solover");
let rondaForzada = null;
const claves = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--ronda") { rondaForzada = Number(args[++i]); continue; }
  if (args[i].startsWith("--")) continue;
  claves.push(args[i]);
}
const lista = claves.length ? claves : Object.keys(LIGAS);
for (const c of lista) {
  if (!LIGAS[c]) { console.error("liga desconocida:", c, "| opciones:", Object.keys(LIGAS).join(", ")); process.exit(1); }
}

const iso = (d) => d.toISOString().slice(0, 10);
const manana = iso(new Date(Date.now() + 86400000));
const hace14 = iso(new Date(Date.now() - 14 * 86400000));
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const leer = (f) => {
  if (!fs.existsSync(f)) return [];
  const datos = JSON.parse(fs.readFileSync(f, "utf8"));
  if (!Array.isArray(datos.events)) {
    throw new Error("Archivo JSON invalido: " + f);
  }
  return datos.events;
};
const clave = (e) => `${e.strStatus}|${e.intHomeScore}|${e.intAwayScore}|${e.strTimestamp}`;
const pendiente = (ev) => ev.some((e) => e.dateEvent && e.dateEvent <= manana && e.dateEvent >= hace14 && !FIN.has(e.strStatus));

const FIN_CON_GOLES = new Set(["FT", "AET", "PEN", "AOT", "Match Finished"]);

function validarEventos(nuevos, anteriores, idLiga, temporada, ronda) {
  if (!Array.isArray(nuevos) || !nuevos.length) {
    throw new Error("Ronda " + ronda + ": respuesta invalida");
  }

  const ids = new Set();
  const marcadorValido = (v) =>
    v !== null && v !== undefined && v !== "" &&
    Number.isFinite(Number(v));

  for (const e of nuevos) {
    const id = String(e?.idEvent || "");

    if (!id || ids.has(id)) {
      throw new Error("Ronda " + ronda + ": ID ausente o duplicado");
    }

    ids.add(id);

    const campos = [
      "idLeague",
      "strSeason",
      "strStatus",
      "dateEvent",
      "strTimestamp",
      "idHomeTeam",
      "idAwayTeam",
      "strHomeTeam",
      "strAwayTeam",
    ];

    for (const campo of campos) {
      if (String(e[campo] ?? "").trim() === "") {
        throw new Error(
          "Ronda " + ronda + ": falta campo " + campo +
          ", ID " + id
        );
      }
    }

    if (String(e.idLeague) !== String(idLiga)) {
      throw new Error("Ronda " + ronda + ": liga incorrecta");
    }

    if (String(e.strSeason) !== String(temporada)) {
      throw new Error("Ronda " + ronda + ": temporada incorrecta");
    }

    if (String(e.idHomeTeam) === String(e.idAwayTeam)) {
      throw new Error(
        "Ronda " + ronda + ": equipos duplicados, ID " + id
      );
    }

    if (FIN_CON_GOLES.has(e.strStatus) &&
        (!marcadorValido(e.intHomeScore) ||
         !marcadorValido(e.intAwayScore))) {
      throw new Error("Ronda " + ronda + ": resultado final incompleto");
    }
  }

  const anterioresPorId = new Map(
    anteriores.map((e) => [String(e.idEvent), e])
  );

  for (const [id, previo] of anterioresPorId) {
    if (!ids.has(id)) {
      throw new Error(
        "Ronda " + ronda + ": falta partido existente " + id
      );
    }

    const nuevo = nuevos.find((e) => String(e.idEvent) === id);

    if (
      String(previo.idHomeTeam) !== String(nuevo.idHomeTeam) ||
      String(previo.idAwayTeam) !== String(nuevo.idAwayTeam)
    ) {
      throw new Error(
        "Ronda " + ronda +
        ": cambiaron los equipos del partido " + id
      );
    }

    if (FIN.has(previo.strStatus) && !FIN.has(nuevo.strStatus)) {
      throw new Error(
        "Ronda " + ronda + ": estado final retrocede, ID " + id
      );
    }
  }
}

function guardarSeguro(archivo, eventos) {
  const temporal = archivo + ".tmp-" + process.pid;

  try {
    fs.writeFileSync(
      temporal,
      JSON.stringify({ events: eventos }),
      { flag: "wx" }
    );

    fs.renameSync(temporal, archivo);
  } finally {
    if (fs.existsSync(temporal)) {
      fs.unlinkSync(temporal);
    }
  }
}

async function pedir(ID, SEASON, r) {
  const u = `https://www.thesportsdb.com/api/v1/json/123/eventsround.php?id=${ID}&r=${r}&s=${SEASON}`;
  for (let i = 0; i < 4; i++) {
    const res = await fetch(u);
    if (res.status === 429) { console.log("429, espero 65s"); await dormir(65000); continue; }
    if (!res.ok) throw new Error("HTTP " + res.status);
    return (await res.json()).events || [];
  }
  throw new Error("429 repetido en ronda " + r);
}

(async () => {
  let cambiosTotal = 0;
  const escrituras = [];
  for (const c of lista) {
    const dir = path.join(__dirname, "..", "data", LIGAS[c]);
    if (!fs.existsSync(dir)) { console.log("==", c, ": no existe", dir); continue; }
    const nums = fs.readdirSync(dir).map((f) => (f.match(/^ronda-(\d+)\.json$/) || [])[1]).filter(Boolean).map(Number).sort((a, b) => a - b);
    if (!nums.length) { console.log("==", c, ": sin rondas guardadas"); continue; }
    const meta = leer(path.join(dir, `ronda-${nums[0]}.json`))[0];
    if (!meta || !meta.idLeague || !meta.strSeason) { console.log("==", c, ": no pude leer idLeague/strSeason"); continue; }
    const ID = meta.idLeague, SEASON = meta.strSeason;
    const file = (r) => path.join(dir, `ronda-${r}.json`);
    const aRef = rondaForzada ? [rondaForzada] : nums.filter((r) => pendiente(leer(file(r))));
    console.log(`== ${c} (liga ${ID}, temporada ${SEASON}): ${nums.length} rondas guardadas, ultima ${nums[nums.length - 1]}`);
    console.log("rondas a refrescar:", aRef.join(", ") || "ninguna");
    if (solover) continue;

    for (const r of aRef) {
      const anteriores = leer(file(r));
      const viejos = {};
      anteriores.forEach((e) => { viejos[e.idEvent] = clave(e); });

      const ev = await pedir(ID, SEASON, r);

      if (Array.isArray(ev) && !ev.length) {
        console.log("ronda", r, "vino vacia, no toco el archivo");
        await dormir(5000);
        continue;
      }

      validarEventos(ev, anteriores, ID, SEASON, r);

      const cambios = ev.filter(
        (e) => viejos[e.idEvent] !== clave(e)
      ).length;

      if (JSON.stringify(ev) !== JSON.stringify(anteriores)) {
        escrituras.push({ archivo: file(r), eventos: ev });
      }

      cambiosTotal += cambios;
      console.log("ronda", r, ":", ev.length, "partidos,", cambios, "cambiaron");
      await dormir(5000);
    }
    let r = nums[nums.length - 1] + 1, vacias = 0;
    while (vacias < 2 && r <= nums[nums.length - 1] + 6) {
      const ev = await pedir(ID, SEASON, r);
      if (Array.isArray(ev) && ev.length === 0) {
        vacias++;
      } else {
        validarEventos(ev, [], ID, SEASON, r);
        escrituras.push({ archivo: file(r), eventos: ev });
        cambiosTotal += ev.length;
        console.log("ronda NUEVA", r, ":", ev.length, "partidos");
        vacias = 0;
      }
      r++;
      await dormir(5000);
    }
  }
  if (!solover) {
    console.log("=== GUARDANDO RONDAS VALIDADAS ===");
    for (const pendiente of escrituras) {
      guardarSeguro(pendiente.archivo, pendiente.eventos);
    }
    console.log("Archivos escritos:", escrituras.length);
  }

  console.log(solover ? "SOLO VER, no se pidio nada." : `LISTO. Partidos que cambiaron o son nuevos: ${cambiosTotal}`);
})().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });
