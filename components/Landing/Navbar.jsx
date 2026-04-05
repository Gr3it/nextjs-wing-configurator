import React from "react";
import Link from "next/link";
import LogoFull from "@/components/Logo/LogoFull";
import { Button } from "@/components/Landing/Button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-300">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <LogoFull className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-10">
          <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#how-to-use" className="hover:text-slate-900 transition-colors">
              Guide
            </a>
            <a href="#presets" className="hover:text-slate-900 transition-colors">
              Presets
            </a>
            <a href="#creators" className="hover:text-slate-900 transition-colors">
              Credits
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Button href="/preview" variant="secondary">
              Catalog
            </Button>
            <Button href="/app">Open Configurator</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
