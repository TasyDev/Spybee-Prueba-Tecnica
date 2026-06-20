import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpyBee — Público",
  description: "Páginas públicas",
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
