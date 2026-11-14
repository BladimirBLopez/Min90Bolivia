import { WHATSAPP, MENSAJE } from "@/app/data/pronosticos";

export const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MENSAJE)}`;

export default function WhatsAppButton({ className = "", children = "Escríbeme por WhatsApp" }) {
  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-3 font-bold text-black transition hover:bg-green-400 ${className}`}
    >
      {children}
    </a>
  );
}
