// In app/layout.tsx
import HeaderWrapper from "@/components/layout/HeaderWrapper";  // ← Invece di Header

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <HeaderWrapper />  {/* ← Invece di <Header /> */}
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
