"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";

const links = [
  ["Inicio", "/#inicio"],
  ["Picks gratis", "/pronosticos-hoy"],
  ["Guías", "/guias"],
  ["Calculadora", "/#calculadora"],
  ["Recarga ahora", "/recarga-ahora"],
];

// Selector de ligas. Bolivia va con sus páginas /equipo y /partido; las demás viven en /liga/[slug].
const ligas = [
  ["Bolivia", "/equipos", (p) => p === "/" || p.startsWith("/equipo") || p.startsWith("/partido") || p === "/pronosticos-hoy"],
  ["Brasileirão", "/liga/brasil-2026", (p) => p.startsWith("/liga/brasil-2026")],
  ["Nations League", "/liga/nations-league-2026", (p) => p.startsWith("/liga/nations-league-2026")],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const close = () => setOpen(false);
  return (
    <header className="sticky top-0 z-40 border-b-2 border-oro-500 bg-white/95 text-slate-900 shadow-sm backdrop-blur">
      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 sm:flex sm:justify-between">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="menu-movil"
          className="flex h-10 w-10 items-center justify-center justify-self-start rounded-xl border border-oro-500/60 text-oro-700 active:bg-oro-50 sm:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        <Link href="/#inicio" onClick={close} className="flex items-center justify-center gap-2 text-xl font-black tracking-tight sm:justify-start sm:text-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-min90.png" alt="Min90 Bolivia" width={40} height={40} className="h-10 w-10 rounded-xl" />
          <span>Min<span className="text-oro-600">90</span></span>
        </Link>
        <nav className="hidden gap-5 text-sm font-medium text-slate-700 sm:flex">
          {links.map(([t, h]) => (
            <Link key={h} href={h} className={"hover:text-oro-600 " + (h === "/recarga-ahora" ? "font-bold text-oro-700" : "")}>{t}</Link>
          ))}
        </nav>
        <div className="flex justify-end">
          <WhatsAppButton className="!px-3 !py-2 text-sm sm:!px-4 [&>svg]:hidden sm:[&>svg]:block">WhatsApp</WhatsAppButton>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white/95">
        <nav aria-label="Ligas" className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 py-2 text-sm">
          {ligas.map(([t, h, ok]) => {
            const on = ok(pathname);
            return (
              <Link
                key={h}
                href={h}
                aria-current={on ? "page" : undefined}
                className={"whitespace-nowrap rounded-full border px-4 py-1.5 font-semibold transition " + (on ? "border-oro-500 bg-oro-500 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-oro-500")}
              >
                {t}
              </Link>
            );
          })}
        </nav>
      </div>
      {open && (
        <nav id="menu-movil" className="border-t border-oro-500/30 bg-white px-4 pb-3 pt-1 sm:hidden">
          {links.map(([t, h]) => (
            <Link
              key={h}
              href={h}
              onClick={close}
              className={"block border-b border-slate-200 py-3 text-base last:border-b-0 " + (h === "/recarga-ahora" ? "font-bold text-oro-700" : "text-slate-800")}
            >
              {t}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
