import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GrsaWatermark } from "@/components/brand/GrsaWatermark";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Escolha da Refeição",
  description: "Registro de escolha de refeição especial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GrsaWatermark />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          {children}
          <footer className="py-4 text-center text-[11px] text-neutral-400">
            Desenvolvido por Josilene Garcês
          </footer>
        </div>
      </body>
    </html>
  );
}
