import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IT Security Procurement Tracker",
  description: "Realtime Multi-user Document Lifecycle Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
