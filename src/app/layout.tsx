import type { Metadata } from "next";
import { QueryProvider } from "@/providers/QueryProvider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediSearch — FDA Medicine Label Search",
  description:
    "Fast, clean, and accessible FDA Drug Label search application built with Next.js, TanStack Query, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-1">
              <p>
                Powered by official{" "}
                <a
                  href="https://open.fda.gov/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary-600 hover:underline"
                >
                  openFDA Drug Label API
                </a>
                .
              </p>
              <p className="text-[11px] text-slate-400 max-w-2xl mx-auto">
                Disclaimer: Do not rely on openFDA to make clinical decisions
                regarding medical care. Always consult a qualified healthcare
                professional.
              </p>
            </div>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
