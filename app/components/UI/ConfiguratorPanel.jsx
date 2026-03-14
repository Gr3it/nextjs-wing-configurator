"use client";
import { useSnapshot } from "valtio";
import {
  state,
  presets,
  setPreset,
  resetAllToBase,
  saveAllCurrentAsBase,
} from "../../store/wingState";
import {
  ChevronDown,
  Download,
  Upload,
  Info,
  RotateCcw,
  Save,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ConfiguratorPanel() {
  const snap = useSnapshot(state);

  const handleExport = () => {
    // Use state (valtio raw) instead of snap (Proxy) to get a plain serializable object
    const data = JSON.stringify(state.rightWingRoot, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wing_config_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Wing configuration exported");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (re) => {
        try {
          const json = JSON.parse(re.target.result);
          state.rightWingRoot = json;
          state.preset = "custom";
          toast.success("Wing configuration imported");
        } catch {
          toast.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="fixed inset-y-0 left-0 w-80 m-4 pointer-events-none flex flex-col gap-4">
      {/* Controls Card */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white pointer-events-auto">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          Configurator
        </h2>

        <div className="space-y-4">
          {/* Mannequin Controls */}
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

          <hr className="border-slate-100" />

          {/* Presets */}
          <div className="space-y-2">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                Preset Profile
              </label>
              <div className="relative">
                <select
                  value={snap.preset}
                  onChange={(e) =>
                    setPreset(e.target.value, presets[e.target.value])
                  }
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 pr-8 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {Object.keys(presets).map((p) => (
                    <option key={p} value={p}>
                      {p.toUpperCase()}
                    </option>
                  ))}
                  {snap.preset === "custom" && (
                    <option value="custom">CUSTOM (Modified)</option>
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition-colors text-sm font-medium cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button
                onClick={handleImport}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition-colors text-sm font-medium cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Import
              </button>
            </div>
          </div>

          {/* Pose Controls */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase block">
              Pose Actions
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resetAllToBase();
                  toast.info("Pose reset to base values");
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition-colors text-sm font-medium cursor-pointer shadow-sm"
                title="Reset current pose to base values"
              >
                <RotateCcw className="w-4 h-4" /> Reset Pose
              </button>
              <button
                onClick={() => {
                  saveAllCurrentAsBase();
                  toast.success("Current pose set as new base");
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition-colors text-sm font-medium cursor-pointer shadow-sm"
                title="Save current pose as the new base"
              >
                <Save className="w-4 h-4" /> Set as Base
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
