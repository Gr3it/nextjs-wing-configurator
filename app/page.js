"use client";

import Scene from "@/components/3D/scene/Scene";
import ConfiguratorPanel from "@/components/UI/ConfiguratorPanel";
import CameraReset from "@/components/UI/CameraReset";
import LogoFull from "@/components/Logo/LogoFull";
import Logo from "@/components/Logo/Logo";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0">
        <Scene />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <ConfiguratorPanel />
        <CameraReset />
      </div>

      {/* Title / Info Overlay */}
      <div className="absolute top-4 right-6 text-right pointer-events-none">
        <LogoFull className="hidden md:block h-12 w-auto text-slate-200" />
        <Logo className="block md:hidden h-12 w-auto text-slate-200" />
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
          href="https://makerworld.com/it/@bzioo"
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
