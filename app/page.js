"use client";
import ConfiguratorScene from "./components/ConfiguratorScene";
import ConfiguratorUI from "./components/ConfiguratorUI";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <ConfiguratorScene />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <ConfiguratorUI />
      </div>

      <div id="modal-root" />

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
