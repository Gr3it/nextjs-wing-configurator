"use client";

import { Ruler } from "lucide-react";
import { useSnapshot } from "valtio";
import { state } from "@/store/wingState";

export default function DisplayOverlays() {
  const snap = useSnapshot(state);
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-mono text-[#ccc] uppercase tracking-widest block mb-2">
          Display Overlays
        </label>

        <div className="flex items-center justify-between p-1">
          <div className="flex items-center gap-2">
            <Ruler
              className={`w-3.5 h-3.5 ${snap.showGizmo ? "text-white" : "text-[#888]"}`}
            />
            <span className="text-xs font-mono text-[#ccc] uppercase tracking-widest">
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
      </div>
    </div>
  );
}
