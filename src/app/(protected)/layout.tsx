import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpyBee — Protected",
  description: "Protected pages",
};

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="protected-layout">
      {children}
    </div>
  );
}
