import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canary Islands Family Trip Packages",
  description: "Compare Tenerife and Fuerteventura family trip package ideas with ISK and EUR estimates.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
