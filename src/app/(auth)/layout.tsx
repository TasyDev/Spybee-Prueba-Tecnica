import type { Metadata } from "next";
import { TopNav } from "@/components/organisms/navigation/TopNav";
import "./auth-layout.scss";

export const metadata: Metadata = {
  title: "SpyBee — Autenticación",
  description: "Páginas de autenticación",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="auth-layout">
      <TopNav backHref="/" />
      <main className="auth-layout__main">
        {children}
      </main>
    </div>
  );
}
