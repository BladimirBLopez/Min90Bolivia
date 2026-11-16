// Modelo de Poisson con fuerza de ataque y defensa, local y visita.
// Es una estimación estadística, no una certeza.
const K = 4;
const MAXG = 8;
const RHO = -0.05;

const pois = (l, k) => {
  let p = Math.exp(-l);
  for (let i = 1; i <= k; i++) p *= l / i;
  return p;
};

export const aPartidos = (lista) =>
  lista
    .filter((m) => m.estado === "FT" && m.goles && Number.isFinite(m.goles.local) && Number.isFinite(m.goles.visitante))
    .map((m) => ({ h: m.local.id, a: m.visitante.id, gh: m.goles.local, ga: m.goles.visitante }));

export function ajustar(partidos) {
  const n = partidos.length;
  const ligaH = partidos.reduce((s, m) => s + m.gh, 0) / (n || 1);
  const ligaA = partidos.reduce((s, m) => s + m.ga, 0) / (n || 1);
  const eq = {};
  const get = (id) => eq[id] || (eq[id] = { jh: 0, fh: 0, ch: 0, ja: 0, fa: 0, ca: 0 });
  partidos.forEach((m) => {
    const H = get(m.h);
    const A = get(m.a);
    H.jh++; H.fh += m.gh; H.ch += m.ga;
    A.ja++; A.fa += m.ga; A.ca += m.gh;
  });
  const fuerza = (tot, j, prom) => (prom > 0 ? (tot + K * prom) / (j + K) / prom : 1);
  const t = {};
  Object.entries(eq).forEach(([id, e]) => {
    t[id] = {
      atqCasa: fuerza(e.fh, e.jh, ligaH),
      defCasa: fuerza(e.ch, e.jh, ligaA),
      atqFuera: fuerza(e.fa, e.ja, ligaA),
      defFuera: fuerza(e.ca, e.ja, ligaH),
    };
  });
  return { ligaH, ligaA, t, n };
}

export function predecir(modelo, idLocal, idVisita) {
  const H = modelo.t[idLocal];
  const A = modelo.t[idVisita];
  if (!H || !A || !modelo.n) return null;
  const lh = modelo.ligaH * H.atqCasa * A.defFuera;
  const la = modelo.ligaA * A.atqFuera * H.defCasa;
  const tau = (x, y) => {
    if (x === 0 && y === 0) return 1 - lh * la * RHO;
    if (x === 0 && y === 1) return 1 + lh * RHO;
    if (x === 1 && y === 0) return 1 + la * RHO;
    if (x === 1 && y === 1) return 1 - RHO;
    return 1;
  };
  let tot = 0;
  const cel = [];
  for (let x = 0; x <= MAXG; x++) {
    for (let y = 0; y <= MAXG; y++) {
      const p = pois(lh, x) * pois(la, y) * tau(x, y);
      cel.push([x, y, p]);
      tot += p;
    }
  }
  let p1 = 0, px = 0, p2 = 0, o25 = 0, bt = 0;
  cel.forEach(([x, y, q]) => {
    const p = q / tot;
    if (x > y) p1 += p; else if (x === y) px += p; else p2 += p;
    if (x + y > 2) o25 += p;
    if (x > 0 && y > 0) bt += p;
  });
  const top = cel.map(([x, y, q]) => ({ x, y, p: q / tot })).sort((u, v) => v.p - u.p).slice(0, 3);
  return { lh, la, p1, px, p2, o25, u25: 1 - o25, btts: bt, nbtts: 1 - bt, x1: p1 + px, x2: px + p2, n12: p1 + p2, top };
}
