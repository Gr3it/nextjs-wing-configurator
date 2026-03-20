"use client";
import React, { useState } from "react";
import { Info, List, Ruler } from "lucide-react";
import { useSnapshot } from "valtio";
import { state } from "../../store/wingState";
import MannequinControls from "./MannequinControls";
import ProfileControls from "./ProfileControls";
import ImportExportActions from "./ImportExportActions";
import PoseActions from "./PoseActions";
import Button from "./Button";
import PiecesListModal from "./PiecesListModal";

export default function ConfiguratorPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const snap = useSnapshot(state);

  return (
    <div className="fixed inset-y-0 left-0 w-80 m-4 pointer-events-none flex flex-col gap-4">
      {/* Controls Card */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white pointer-events-auto overflow-y-auto overflow-x-hidden max-h-[calc(100vh-2rem)]">
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

          <hr className="border-slate-100" />

          {/* Measurements Toggle */}
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-2">
              <Ruler
                className={`w-4 h-4 ${snap.showGizmo ? "text-blue-500" : "text-slate-400"}`}
              />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                Measurements (m)
              </span>
            </div>
            <button
              onClick={() => (state.showGizmo = !state.showGizmo)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                snap.showGizmo ? "bg-blue-500" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  snap.showGizmo ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Pieces Summary Action */}
          <div className="space-y-3">
            <Button
              variant="dark"
              icon={List}
              onClick={() => setIsModalOpen(true)}
              className="w-full text-xs"
            >
              Show pieces list
            </Button>
          </div>
        </div>
      </div>

      {/* Pieces List Modal */}
      <PiecesListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rightWingRoot={snap.rightWingRoot}
      />
    </div>
  );
}
