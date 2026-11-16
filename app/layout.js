import { Barlow_Condensed, Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public",
  subsets: ["latin"],
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  weight: ["600", "700", "800", "900"],
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
    <html lang="es" className={`scroll-smooth ${publicSans.variable} ${barlow.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
