import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const base = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(base),
  title: "Min90 Bolivia",
  description: "Pronósticos del fútbol boliviano todos los días. Carga por WhatsApp.",
  openGraph: {
    title: "Min90 Bolivia",
    description: "Pronósticos del fútbol boliviano todos los días. Carga por WhatsApp.",
    siteName: "Min90 Bolivia",
    locale: "es_BO",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
