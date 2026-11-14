import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GapFinder AI — Find What The Student Doesn't Know",
  description:
    "An AI diagnostic study engine that maps syllabi, tests with citation-grounded RAG questions, identifies blind spots, and generates an adaptive revision plan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
