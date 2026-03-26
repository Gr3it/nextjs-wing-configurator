"use client";

import Scene from "@/components/3D/scene/Scene";
import ConfiguratorPanel from "@/components/UI/ConfiguratorPanel";
import LogoFull from "@/components/Logo/LogoFull";
import Logo from "@/components/Logo/Logo";
import BugReport from "@/components/UI/BugReport";
import Button from "@/components/UI/Button";
import { Coffee, Heart } from "lucide-react";
import DisclaimerModal from "@/components/UI/DisclaimerModal";

export default function Home() {
  return (
    <main className="relative w-full h-dvh overflow-hidden">
      {/* 3D Scene Layer */}
      <Scene />

      {/* UI Overlay Layer */}
      <ConfiguratorPanel />

      {/* Disclaimer Modal */}
      <DisclaimerModal />

      {/* Title / Info Overlay */}
      <div className="absolute top-4 right-6 text-right pointer-events-none">
        <LogoFull className="hidden md:block h-12 w-auto text-slate-200" />
        <Logo className="block md:hidden h-12 w-auto text-slate-200" />
      </div>

      {/* Bottom Right Actions */}
      <div className="absolute bottom-4 right-4 text-right pointer-events-auto flex flex-col items-end gap-2">
        <BugReport />
        <a
          href="https://patreon.com/cw/bzioo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" icon={Heart} fullWidth={false}>
            Bzioo's Patreon
          </Button>
        </a>
        <a
          href="https://ko-fi.com/R6R23OSRW"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" icon={Coffee} fullWidth={false}>
            Buy the dev a coffee
          </Button>
        </a>
      </div>

      {/* Footer / Credits Overlay */}
      <div className="absolute bottom-3 left-0 w-full text-center text-[10px] sm:text-xs text-black pointer-events-auto">
        Website by{" "}
        <a
          href="https://emanuelezini.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Gr3it
        </a>{" "}
        • 3D Models by{" "}
        <a
          href="https://patreon.com/cw/bzioo"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          bzioo
        </a>
      </div>
    </main>
  );
}
