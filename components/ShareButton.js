"use client";

export default function ShareButton({ texto }) {
  function compartir() {
    const url = window.location.origin;
    const msg = `${texto}\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }
  return (
    <button
      onClick={compartir}
      className="mt-3 rounded-full border border-oro-500/60 px-4 py-1.5 text-xs font-semibold text-oro-700 hover:bg-oro-500/10"
    >
      Compartir por WhatsApp
    </button>
  );
}
