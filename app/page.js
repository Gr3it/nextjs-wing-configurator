"use client";

import Scene from "@/components/3D/scene/Scene";
import ConfiguratorPanel from "@/components/UI/ConfiguratorPanel";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <ConfiguratorPanel />
      </div>

      {/* Title / Info Overlay */}
      <div className="absolute top-4 right-4 text-right pointer-events-none">
        <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">
          Wing Configurator
        </h1>
        <p className="text-slate-500 text-xs font-medium">
          Build your own custom wing set
        </p>
      </div>
    </main>
  );
}
