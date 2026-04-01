import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "TruequeMX | Intercambio Circular en Veracruz",
  description: "Plataforma de economía circular para Veracruz y Poza Rica. Intercambia objetos y habilidades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-[#0a0a0a] text-white min-h-screen selection:bg-emerald-500/30 selection:text-emerald-300`}>
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98115,transparent_50%)] pointer-events-none" />
        {children}
      </body>
    </html>
  );
}
