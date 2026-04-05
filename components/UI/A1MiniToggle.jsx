"use client";

import React from "react";
import { Box } from "lucide-react";
import { useSnapshot } from "valtio";
import { state } from "../../store/wingState";

export default function A1MiniToggle() {
  const snap = useSnapshot(state);

  return (
    <div className="flex items-center justify-between p-1">
      <div className="flex items-center gap-2">
        <Box
          className={`w-3.5 h-3.5 ${snap.a1MiniOnly ? "text-white" : "text-[#888]"}`}
        />
        <span className="text-xs font-mono text-[#ccc] uppercase tracking-widest">
          A1 mini parts only
        </span>
      </div>

      <button
        onClick={() => (state.a1MiniOnly = !state.a1MiniOnly)}
        className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
          snap.a1MiniOnly ? "bg-accent" : "bg-[#333]"
        }`}
      >
        <span
          className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
            snap.a1MiniOnly ? "translate-x-4.5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
