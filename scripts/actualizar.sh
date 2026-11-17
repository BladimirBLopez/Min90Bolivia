#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

cd ~/proyectos/Min90Bolivia || exit 1

echo "=== VERIFICANDO ESTADO ==="

if [[ "$(git branch --show-current)" != "main" ]]; then
  echo "ERROR: no estás en main."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: existen cambios pendientes."
  echo "Revisa git status antes de actualizar."
  exit 1
fi

echo "=== CONSULTANDO RESULTADOS ==="

node scripts/refrescar.js "$@"

echo "=== CAMBIOS EN LOS DATOS ==="

git diff --check
git diff --stat -- data
git status --short

echo ""
echo "Actualización terminada."
echo "No se realizó commit, push ni despliegue."
echo "Revisa los resultados antes de publicar."
