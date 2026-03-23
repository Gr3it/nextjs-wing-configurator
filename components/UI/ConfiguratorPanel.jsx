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
      <div
        className="p-5 rounded-xl pointer-events-auto overflow-y-auto overflow-x-hidden max-h-[calc(100vh-2rem)] scrollbar-hide"
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        <h2 className="text-[11px] font-mono uppercase tracking-widest text-white mb-6 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#aaa]" />
          Wing Configurator
        </h2>

        <div className="space-y-6">
          {/* Mannequin Controls */}
          <MannequinControls />

          <hr className="border-[#333]" />

          {/* Profile Selection & Management */}
          <div className="space-y-2">
            <ProfileControls />
            <ImportExportActions />
          </div>

          <hr className="border-[#333]" />

          {/* Pose Controls */}
          <PoseActions />

          <hr className="border-[#333]" />

          {/* Measurements Toggle */}
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-2">
              <Ruler
                className={`w-3.5 h-3.5 ${snap.showGizmo ? "text-white" : "text-[#888]"}`}
              />
              <span className="text-[10px] font-mono text-[#ccc] uppercase tracking-widest">
                Measurements (m)
              </span>
            </div>

            <button
              onClick={() => (state.showGizmo = !state.showGizmo)}
              className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                snap.showGizmo ? "bg-accent" : "bg-[#333]"
              }`}
            >
              <span
                className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                  snap.showGizmo ? "translate-x-4.5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Pieces Summary Action */}
          <div className="pt-2">
            <Button
              variant="primary"
              icon={List}
              onClick={() => setIsModalOpen(true)}
              className="w-full"
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
