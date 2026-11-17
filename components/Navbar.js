"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GRUPOS_LIGAS } from "@/lib/navegacionLigas";

const links = [
  ["Inicio", "/#inicio"],
  ["Picks gratis", "/pronosticos-hoy"],
  ["Guías", "/guias"],
  ["Calculadora", "/#calculadora"],
  ["Recarga ahora", "/recarga-ahora"],
];

function ligaActiva(pathname, href) {
  if (href === "/equipos") {
    return pathname === "/equipos" ||
      pathname.startsWith("/equipo/") ||
      pathname.startsWith("/partido/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function enSeccionLigas(pathname) {
  return pathname === "/ligas" ||
    pathname === "/mas-ligas" ||
    GRUPOS_LIGAS.some((grupo) =>
      grupo.ligas.some((liga) => ligaActiva(pathname, liga.href))
    );
}

function EnlacesLigas({ pathname, onSelect }) {
  return (
    <div className="space-y-3">
      {GRUPOS_LIGAS.map((grupo) => (
        <div key={grupo.nombre}>
          <p className="px-2 py-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
            {grupo.nombre}
          </p>
          {grupo.ligas.map((liga) => {
            const activa = ligaActiva(pathname, liga.href);
            return (
              <Link
                key={liga.href}
                href={liga.href}
                onClick={onSelect}
                aria-current={activa ? "page" : undefined}
                className={
                  "flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition " +
                  (activa
                    ? "bg-oro-50 font-bold text-oro-700"
                    : "text-slate-800 hover:bg-slate-100")
                }
              >
                <span aria-hidden="true">{liga.icono}</span>
                <span>{liga.breve}</span>
              </Link>
            );
          })}
        </div>
      ))}

      <Link
        href="/ligas"
        onClick={onSelect}
        className="flex items-center justify-between rounded-lg border border-oro-500/40 px-3 py-3 text-sm font-bold text-oro-700 hover:bg-oro-50"
      >
        Ver todas las ligas
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [ligasAbiertas, setLigasAbiertas] = useState(false);

  const close = () => {
    setOpen(false);
    setLigasAbiertas(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-oro-500 bg-white/95 text-slate-900 shadow-sm backdrop-blur">
      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 lg:flex lg:justify-between">
        <button
          type="button"
          onClick={() => {
            if (!open) setLigasAbiertas(enSeccionLigas(pathname));
            setOpen(!open);
          }}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="menu-movil"
          className="flex h-10 w-10 items-center justify-center justify-self-start rounded-xl border border-oro-500/60 text-oro-700 active:bg-oro-50 lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open
              ? <path d="M6 6l12 12M18 6L6 18" />
              : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <Link
          href="/#inicio"
          onClick={close}
          className="flex items-center justify-center gap-2 text-xl font-black tracking-tight lg:justify-start lg:text-2xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-min90.png" alt="Min90 Bolivia" width={40} height={40} className="h-10 w-10 object-contain" />
          <span>Min<span className="text-oro-600">90</span></span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-4 text-sm font-medium text-slate-700 lg:flex">
          <Link href={links[0][1]} className="hover:text-oro-600">
            Inicio
          </Link>

          <details className="group relative">
            <summary className={
              "flex cursor-pointer list-none items-center gap-1 hover:text-oro-600 [&::-webkit-details-marker]:hidden " +
              (enSeccionLigas(pathname) ? "font-bold text-oro-700" : "")
            }>
              Ligas
              <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="absolute left-0 top-full z-50 mt-3 max-h-[75vh] w-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
              <EnlacesLigas
                pathname={pathname}
                onSelect={(event) => {
                  const menu = event.currentTarget.closest("details");
                  if (menu) menu.open = false;
                }}
              />
            </div>
          </details>

          {links.slice(1).map(([titulo, href]) => (
            <Link
              key={href}
              href={href}
              className={
                "hover:text-oro-600 " +
                (href === "/recarga-ahora" ? "font-bold text-oro-700" : "")
              }
            >
              {titulo}
            </Link>
          ))}
        </nav>
      </div>

      {open && (
        <nav
          id="menu-movil"
          aria-label="Menú principal"
          className="max-h-[calc(100dvh-85px)] overflow-y-auto border-t border-oro-500/30 bg-white px-4 pb-4 pt-2 lg:hidden"
        >
          <Link
            href="/#inicio"
            onClick={close}
            className="block border-b border-slate-200 py-3 text-base text-slate-800"
          >
            Inicio
          </Link>

          <button
            type="button"
            aria-expanded={ligasAbiertas}
            aria-controls="ligas-menu-movil"
            onClick={() => setLigasAbiertas(!ligasAbiertas)}
            className={
              "flex w-full items-center justify-between border-b border-slate-200 py-3 text-left text-base font-bold " +
              (enSeccionLigas(pathname) ? "text-oro-700" : "text-slate-800")
            }
          >
            <span>🏆 Ligas</span>
            <span aria-hidden="true">{ligasAbiertas ? "⌃" : "⌄"}</span>
          </button>

          <div
            id="ligas-menu-movil"
            hidden={!ligasAbiertas}
            className="border-b border-slate-200 bg-slate-50 px-3 py-3"
          >
            <EnlacesLigas pathname={pathname} onSelect={close} />
          </div>

          {links.slice(1).map(([titulo, href]) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={
                "block border-b border-slate-200 py-3 text-base last:border-b-0 " +
                (href === "/recarga-ahora"
                  ? "font-bold text-oro-700"
                  : "text-slate-800")
              }
            >
              {titulo}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
