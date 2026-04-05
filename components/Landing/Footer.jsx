import React from "react";
import LogoFull from "@/components/Logo/LogoFull";

export default function Footer() {
  return (
    <footer className="py-12 bg-white border-t border-slate-100">
      <div className="max-w-screen-2xl mx-auto px-6 flex flex-col md:flex-row items-start justify-between gap-10 md:gap-8">
        {/* Left Side */}
        <div className="flex flex-col items-start gap-2 w-full md:w-1/3">
          <LogoFull className="h-6 w-auto text-slate-900" />
          <p className="text-sm text-slate-500">
            © 2026 ICARUS | Cosplay Wing Configurator
          </p>
        </div>

        {/* Center Links */}
        <div className="flex flex-wrap justify-start md:justify-center items-start gap-8 text-sm font-medium text-slate-500 w-full md:w-1/3 pt-1">
          <a
            href="#how-to-use"
            className="hover:text-slate-900 transition-colors"
          >
            Guide
          </a>
          <a href="#presets" className="hover:text-slate-900 transition-colors">
            Presets
          </a>

          <a
            href="#creators"
            className="hover:text-slate-900 transition-colors"
          >
            Credits
          </a>
          <a href="/preview" className="hover:text-slate-900 transition-colors">
            Catalog
          </a>
          <a
            href="/app"
            className="text-(--color-accent) hover:text-slate-900 transition-colors"
          >
            App
          </a>
        </div>

        {/* Right Side */}
        <div className="flex justify-start md:justify-end items-start text-sm text-slate-500 w-full md:w-1/3 pt-1">
          <p>
            Made for the community by{" "}
            <a
              href="https://emanuelezini.com/"
              className="text-slate-900 hover:text-(--color-accent) font-medium transition-colors ml-1"
            >
              Gr3it
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
