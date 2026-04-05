"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  AlertTriangle,
  Save,
  Coffee,
  Heart,
  ExternalLink,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#aaa] flex items-center gap-2">
                <div className="w-1 h-1 bg-amber-500 rounded-full" />
                Build & Material Strength
              </h4>
              <p className="text-xs text-[#ccc] leading-relaxed font-sans">
                You have to check yourself the duality of the build material and
                strength wise, because that is also based on the weight you add
                to the skeleton and different materials for prints have
                different strength.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#aaa] flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full" />
                Local Save Recommended
              </h4>
              <div className="flex gap-3 items-start p-4 rounded-xl bg-[#222] border border-[#333]">
                <Save className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-[#ccc] leading-relaxed">
                  After finishing a build, it is{" "}
                  <strong>highly recommended</strong> to export it to have a
                  local save of your configuration.
                </p>
              </div>
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
