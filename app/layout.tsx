import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "@/components/layout/HeaderWrapper";
import Footer from "@/components/layout/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Portale Immobili & Handmade",
  description: "Il tuo marketplace italiano per immobili e artigianato",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <HeaderWrapper />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
