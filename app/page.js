"use client";

import Scene from "@/components/3D/scene/Scene";
import ConfiguratorPanel from "@/components/UI/ConfiguratorPanel";
import CameraReset from "@/components/UI/CameraReset";
import LogoFull from "@/components/Logo/LogoFull";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <CameraReset />
        <ConfiguratorPanel />
      </div>

      {/* Title / Info Overlay */}
      <div className="absolute top-4 right-6 text-right pointer-events-none">
        <LogoFull className="h-16 w-auto text-slate-200" />
      </div>
    </main>
  );
}
