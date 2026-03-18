"use client";
import { useSnapshot } from "valtio";
import { state } from "@/store/wingState";

export default function MannequinControls() {
  const snap = useSnapshot(state);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase">
          Mannequin Height ({snap.mannequin.height.toFixed(2)}m)
        </label>
        <input
          type="range"
          min="1.5"
          max="2"
          step="0.01"
          value={snap.mannequin.height}
          onChange={(e) =>
            (state.mannequin.height = parseFloat(e.target.value))
          }
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase">
          Mannequin Width ({snap.mannequin.widthMultiplier.toFixed(2)}x)
        </label>
        <input
          type="range"
          min="0.75"
          max="1.5"
          step="0.01"
          value={snap.mannequin.widthMultiplier}
          onChange={(e) =>
            (state.mannequin.widthMultiplier = parseFloat(e.target.value))
          }
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase">
          Backplate Height ({snap.backplateHeightRatio.toFixed(2)})
        </label>
        <input
          type="range"
          min="0.70"
          max="0.80"
          step="0.01"
          value={snap.backplateHeightRatio}
          onChange={(e) =>
            (state.backplateHeightRatio = parseFloat(e.target.value))
          }
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    </div>
  );
}
