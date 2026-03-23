"use client";
import { useSnapshot } from "valtio";
import { state } from "@/store/wingState";

export default function MannequinControls() {
  const snap = useSnapshot(state);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between items-center px-0.5">
          <label className="text-[10px] font-mono text-[#ccc] uppercase tracking-widest">
            Mannequin Height
          </label>
          <span className="text-[11px] font-mono text-white font-bold">
            {snap.mannequin.height.toFixed(2)}m
          </span>
        </div>
        <input
          type="range"
          min="1.5"
          max="2"
          step="0.01"
          value={snap.mannequin.height}
          onChange={(e) =>
            (state.mannequin.height = parseFloat(e.target.value))
          }
          className="w-full h-1.5 bg-[#333] rounded-full appearance-none cursor-pointer accent-white"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center px-0.5">
          <label className="text-[10px] font-mono text-[#ccc] uppercase tracking-widest">
            Mannequin Width
          </label>
          <span className="text-[11px] font-mono text-white font-bold">
            {snap.mannequin.widthMultiplier.toFixed(2)}x
          </span>
        </div>
        <input
          type="range"
          min="0.75"
          max="1.5"
          step="0.01"
          value={snap.mannequin.widthMultiplier}
          onChange={(e) =>
            (state.mannequin.widthMultiplier = parseFloat(e.target.value))
          }
          className="w-full h-1.5 bg-[#333] rounded-full appearance-none cursor-pointer accent-white"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center px-0.5">
          <label className="text-[10px] font-mono text-[#ccc] uppercase tracking-widest">
            Backplate Height
          </label>
          <span className="text-[11px] font-mono text-white font-bold">
            {snap.backplateHeightRatio.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min="0.70"
          max="0.80"
          step="0.01"
          value={snap.backplateHeightRatio}
          onChange={(e) =>
            (state.backplateHeightRatio = parseFloat(e.target.value))
          }
          className="w-full h-1.5 bg-[#333] rounded-full appearance-none cursor-pointer accent-white"
        />
      </div>
    </div>
  );
}
