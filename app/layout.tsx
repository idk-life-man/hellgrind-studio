import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hell Grind Prompt Studio",
  description: "Generate Cannes-grade AI video prompts from 41,000 reverse-engineered Hell Grind shots",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
