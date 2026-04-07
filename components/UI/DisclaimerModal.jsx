"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  AlertTriangle,
  FlaskConical,
  Layers,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";
import Button from "./Button";
import { state } from "@/store/wingState";

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem("hasSeenDisclaimer");
    if (!hasSeenDisclaimer) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("hasSeenDisclaimer", "true");
    }
    setIsOpen(false);

    // Start tutorial when closed
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!hasSeenTutorial) {
      state.showTutorial = true;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pointer-events-auto">
      <div
        className="rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-full"
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-[#333] bg-[#1a1a1a] flex-none">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <div>
              <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-white leading-tight">
                Important Notice
              </h3>
              <p className="text-xs font-mono text-[#888] uppercase tracking-wider mt-1">
                Please read before proceeding
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[#888] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto scrollbar-hide flex-1 min-h-0">
          <div className="space-y-8">
            {/* Intro */}
            <section className="space-y-4">
              <p className="text-sm text-[#ccc] leading-relaxed font-sans border-l-2 border-amber-500/30 pl-4 py-1 italic">
                The structural integrity of your build depends on your material
                choice, print settings, and the final weight of the cladding
                (feathers, electronics, etc.).
              </p>
            </section>

            {/* Material Recommendation */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <FlaskConical className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#888]">
                  Material Selection
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#222] border border-[#333] hover:border-blue-500/30 transition-colors group">
                  <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-2 font-bold">
                    Standard Builds
                  </p>
                  <p className="text-xs text-[#aaa] leading-relaxed">
                    <b className="text-[#ccc]">PLA+ / Tough PLA:</b> Excellent
                    for medium wings. Offers better impact resistance than base
                    PLA.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#222]/50 border border-blue-900/30 hover:border-blue-500/30 transition-colors group ring-1 ring-blue-500/5">
                  <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-2 font-bold">
                    X-Large Wings (1m+)
                  </p>
                  <p className="text-xs text-[#aaa] leading-relaxed">
                    <b className="text-[#ccc]">PETG / ASA / PA-CF:</b> Highly
                    recommended. Higher durability and thermal resistance for
                    large spans.
                  </p>
                </div>
              </div>
            </section>

            {/* Reinforcement */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#888]">
                  Structural Reinforcement
                </h4>
              </div>

              <div className="p-5 rounded-xl bg-[#222] border border-[#333] space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <div className="space-y-1">
                    <p className="text-xs text-white font-bold tracking-tight">
                      Reinforced Core Settings
                    </p>
                    <p className="text-xs text-[#888] leading-relaxed">
                      For pieces near the mannequin (base nodes), use at least{" "}
                      <b>4-6 wall loops</b> and <b>25% Gyroid infill</b>.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pt-4 border-t border-[#333]">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <div className="space-y-1">
                    <p className="text-xs text-white font-bold tracking-tight">
                      Hinge Integrity
                    </p>
                    <p className="text-xs text-[#888] leading-relaxed">
                      Small connectors need 100% infill to prevent snapping
                      under the weight of the outer wing tiers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pt-4 border-t border-[#333]">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <div className="space-y-1">
                    <p className="text-xs text-white font-bold tracking-tight">
                      Load Management
                    </p>
                    <p className="text-xs text-[#888] leading-relaxed">
                      The cladding weight (feathers, electronics) significantly
                      impacts the base nodes. Reinforced settings are mandatory
                      for heavy builds.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Important Alert */}
            <section className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 flex gap-4 items-center">
              <ShieldCheck className="w-8 h-8 text-orange-500/50 shrink-0" />
              <p className="text-[11px] text-[#aaa] leading-relaxed uppercase tracking-wide">
                Always perform a physical test of a single joint before printing
                the full wing to verify tolerances.
              </p>
            </section>
          </div>

          {/* Action Area (Now part of scroll) */}
          <div className="-mx-4 md:-mx-6 px-4 md:px-6 pt-6 border-t border-[#333] flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                />
                <div
                  className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                    dontShowAgain
                      ? "bg-[#666] border-[#777]"
                      : "bg-transparent border-[#444] group-hover:border-[#666]"
                  }`}
                >
                  {dontShowAgain && (
                    <Check className="w-3.5 h-3.5 text-white stroke-3" />
                  )}
                </div>
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#888] group-hover:text-[#ccc] transition-colors">
                Don't show this message again
              </span>
            </label>

            <Button
              variant="primary"
              onClick={handleClose}
              className="w-full py-3! text-sm! tracking-[0.2em]"
            >
              I Understand
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
