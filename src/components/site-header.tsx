"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "Campus", href: "/campus" },
  { label: "Notices", href: "/notices" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
            SPS
          </div>

          <div>
            <div className="text-lg font-bold tracking-tight">
              SPS Qaziabad
            </div>

            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
              Excellence • Character • Future
            </div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-950"
            >
              {item.label}

              <span className="absolute bottom-2 left-0 h-[2px] w-0 rounded-full bg-slate-950 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/login"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-950"
          >
            Admin Login
          </Link>

          <Link
            href="/admissions"
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
          >
            Admissions
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-900 transition-all duration-200 hover:bg-slate-50 sm:hidden"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      <div
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 sm:hidden ${
          open
            ? "max-h-[600px] opacity-100"
            : "max-h-0 border-t-0 opacity-0"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-5 py-4">
          <div className="flex flex-col">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-slate-100 py-4 text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="py-4 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
            >
              Admin Login
            </Link>

            <Link
              href="/admissions"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800"
            >
              Admissions
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}