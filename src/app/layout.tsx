import type { Metadata } from "next";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "SpyBee",
  description: "Sistema de gestión de incidencias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
