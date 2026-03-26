"use client";
import React, { useState, useEffect } from "react";
import { Info, List, Ruler } from "lucide-react";
import { useSnapshot } from "valtio";
import { state, loadCustomPresets } from "../../store/wingState";
import MannequinControls from "./MannequinControls";
import CameraReset from "./CameraReset";
import ProfileControls from "./ProfileControls";
import ImportExportActions from "./ImportExportActions";
import PoseActions from "./PoseActions";
import Button from "./Button";
import PiecesListModal from "./PiecesListModal";
import DisplayOverlays from "./displayOverlays";

export default function ConfiguratorPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const snap = useSnapshot(state);

  useEffect(() => {
    loadCustomPresets();
  }, []);

  return (
    <div className="fixed inset-y-0 left-0 w-80 m-4 pointer-events-none flex flex-col gap-4 z-50">
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

        <h2 className="text-xs font-mono uppercase tracking-widest text-white mb-6 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#aaa]" />
          Wing Configurator
        </h2>

        <div className="space-y-6">
          {/* Mannequin Controls */}
          <MannequinControls />
          <CameraReset />

          <hr className="border-[#333]" />

          {/* Profile Selection & Management */}
          <div className="space-y-2">
            <ProfileControls />
            <ImportExportActions />
          </div>

          <hr className="border-[#333]" />

          {/* Pose Controls */}
          <PoseActions />

          {/* Measurements Toggle */}
          <hr className="border-[#333]" />
          <DisplayOverlays />

          <hr className="border-[#333]" />

          {/* Pieces Summary Action */}
          <Button
            variant="primary"
            icon={List}
            onClick={() => setIsModalOpen(true)}
            className="w-full"
          >
            Pieces List
          </Button>
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
