import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpyBee — Gestión de Incidentes en Construcción",
  description:
    "SpyBee es un sistema moderno de gestión de incidentes para proyectos de construcción. Mapas interactivos, dashboards analíticos, autenticación segura y más.",
  openGraph: {
    title: "SpyBee — Gestión de Incidentes en Construcción",
    description:
      "SpyBee es un sistema moderno de gestión de incidentes para proyectos de construcción. Mapas interactivos, dashboards analíticos, autenticación segura y más.",
    type: "website",
    locale: "es_MX",
    siteName: "SpyBee",
  },
  robots: "index, follow",
  // metadataBase will be set from env in production
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="public-layout">
      {children}
    </div>
  );
}
