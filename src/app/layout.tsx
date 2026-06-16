import type { Metadata } from "next";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "SpyBee",
  description: "Incident management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
