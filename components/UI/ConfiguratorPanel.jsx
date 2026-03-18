"use client";
import { Info } from "lucide-react";
import MannequinControls from "./MannequinControls";
import ProfileControls from "./ProfileControls";
import ImportExportActions from "./ImportExportActions";
import PoseActions from "./PoseActions";

export default function ConfiguratorPanel() {
  return (
    <div className="fixed inset-y-0 left-0 w-80 m-4 pointer-events-none flex flex-col gap-4">
      {/* Controls Card */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white pointer-events-auto">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          Configurator
        </h2>

        <div className="space-y-4">
          {/* Mannequin Controls */}
          <MannequinControls />

          <hr className="border-slate-100" />

          {/* Profile Selection & Management */}
          <div className="space-y-2">
            <ProfileControls />
            <ImportExportActions />
          </div>

          <hr className="border-slate-100" />

          {/* Pose Controls */}
          <PoseActions />
        </div>
      </div>
    </div>
  );
}
