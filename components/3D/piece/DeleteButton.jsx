"use client";
import { useState, useCallback } from "react";
import { Html } from "@react-three/drei";
import { removePiece } from "@/store/wingState";
import ConnectorVisual from "./ConnectorVisual";
import Button from "@/components/UI/Button";

export default function DeleteButton({ path, isActive, position = [0, 0, 0] }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = useCallback(() => {
    setShowConfirm(false);
    removePiece(path);
  }, [path]);

  if (!isActive) return null;

  return (
    <group position={position}>
      <ConnectorVisual
        type="delete"
        active={isActive}
        onClick={(e) => {
          e.stopPropagation();
          setShowConfirm(true);
        }}
      />

      {showConfirm && (
        <Html
          center
          zIndexRange={[500, 500]}
          style={{ pointerEvents: "none" }}
          position={[0, 0.05, 0]}
        >
          <style>{`
            @keyframes prFadeIn {
              from { opacity: 0; transform: translateY(4px); }
              to   { opacity: 1; transform: translateY(0);   }
            }
          `}</style>

          <div
            className="flex items-center gap-1.5 px-2 py-2 rounded-xl border border-[#333] bg-[#1a1a1a] shadow-[0_8px_32px_rgba(0,0,0,0.6)] whitespace-nowrap select-none"
            style={{
              pointerEvents: "all",
              backdropFilter: "blur(10px)",
              animation: "prFadeIn 0.15s ease",
            }}
          >
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#888] px-2 mr-0.5">
              Sure?
            </span>

            <Button variant="danger" fullWidth={false} onClick={handleConfirm}>
              Yes
            </Button>

            <Button fullWidth={false} onClick={() => setShowConfirm(false)}>
              No
            </Button>
          </div>
        </Html>
      )}
    </group>
  );
}
