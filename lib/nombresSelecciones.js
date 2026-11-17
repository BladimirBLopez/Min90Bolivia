// Nombres visibles en español. Los IDs y JSON no se modifican.
const NOMBRES = Object.freeze({
  "Albania": "Albania",
  "Andorra": "Andorra",
  "Armenia": "Armenia",
  "Austria": "Austria",
  "Azerbaijan": "Azerbaiyán",
  "Belarus": "Bielorrusia",
  "Belgium": "Bélgica",
  "Bosnia-Herzegovina": "Bosnia y Herzegovina",
  "Bulgaria": "Bulgaria",
  "Croatia": "Croacia",
  "Cyprus": "Chipre",
  "Czech Republic": "República Checa",
  "Denmark": "Dinamarca",
  "England": "Inglaterra",
  "Estonia": "Estonia",
  "Faroe Islands": "Islas Feroe",
  "Finland": "Finlandia",
  "France": "Francia",
  "Georgia": "Georgia",
  "Germany": "Alemania",
  "Gibraltar": "Gibraltar",
  "Greece": "Grecia",
  "Hungary": "Hungría",
  "Iceland": "Islandia",
  "Ireland": "Irlanda",
  "Israel": "Israel",
  "Italy": "Italia",
  "Kazakhstan": "Kazajistán",
  "Kosovo": "Kosovo",
  "Latvia": "Letonia",
  "Liechtenstein": "Liechtenstein",
  "Lithuania": "Lituania",
  "Luxembourg": "Luxemburgo",
  "Malta": "Malta",
  "Moldova": "Moldavia",
  "Montenegro": "Montenegro",
  "N.Ireland": "Irlanda del Norte",
  "Netherlands": "Países Bajos",
  "North Macedonia": "Macedonia del Norte",
  "Norway": "Noruega",
  "Poland": "Polonia",
  "Portugal": "Portugal",
  "Romania": "Rumanía",
  "San Marino": "San Marino",
  "Scotland": "Escocia",
  "Serbia": "Serbia",
  "Slovakia": "Eslovaquia",
  "Slovenia": "Eslovenia",
  "Spain": "España",
  "Sweden": "Suecia",
  "Switzerland": "Suiza",
  "Turkey": "Turquía",
  "Ukraine": "Ucrania",
  "Wales": "Gales"
});

const ORIGINALES = Object.freeze(
  Object.fromEntries(
    Object.entries(NOMBRES).map(([original, espanol]) => [espanol, original])
  )
);

export function nombreSeleccion(nombre) {
  return NOMBRES[nombre] || nombre;
}

export function nombreOriginalSeleccion(nombre) {
  return ORIGINALES[nombre] || nombre;
}

const normalizarClave = (valor) =>
  String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

export function claveSeleccion(nombre) {
  const clave = normalizarClave(
    nombreOriginalSeleccion(nombre)
  );

  if (clave === "northernireland") return "nireland";
  if (clave === "republicofireland") return "ireland";

  return clave;
}
