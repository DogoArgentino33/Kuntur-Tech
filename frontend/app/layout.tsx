import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Kuntur-Tech | Scouting Deportivo Inteligente",
  description: "La plataforma de scouting deportivo que democratiza oportunidades. Conectamos atletas, scouts y clubes mediante IA.",
  keywords: ["scouting", "deportes", "fútbol", "IA", "talento deportivo", "latinoamérica"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
