#!/data/data/com.termux/files/usr/bin/bash
cd ~/proyectos/Min90Bolivia || exit 1
node scripts/refrescar.js "$@" || { echo "Fallo el refresco, no subo nada."; exit 1; }
git add data
if git diff --cached --quiet; then echo "Sin cambios en los datos, no hay nada que subir."; exit 0; fi
git diff --cached --stat | tail -8
git commit -m "Resultados actualizados $(date +%d/%m\ %H:%M)" && git push origin HEAD:main && timeout 600 vercel --prod --yes 2>&1 | tail -4
