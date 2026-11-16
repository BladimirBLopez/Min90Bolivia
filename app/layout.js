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
  title: "Min90 Bolivia · Estadísticas y tendencias de fútbol",
  description: "Estadísticas y tendencias de la liga boliviana, la de Brasil y la Nations League. Recarga Metabet por WhatsApp, pago por QR.",
  openGraph: {
    title: "Min90 Bolivia · Estadísticas y tendencias de fútbol",
    description: "Estadísticas y tendencias de la liga boliviana, la de Brasil y la Nations League. Recarga Metabet por WhatsApp, pago por QR.",
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
