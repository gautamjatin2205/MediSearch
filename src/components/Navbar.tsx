import React from "react";
import Link from "next/link";
import { Pill } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
            <Pill className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Medi<span className="text-blue-600">Search</span>
          </span>
        </Link>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          FDA Drug Information
        </span>
      </div>
    </header>
  );
};
