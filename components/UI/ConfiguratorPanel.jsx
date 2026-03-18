"use client";
import { useState } from "react";
import { useSnapshot } from "valtio";
import ProfileModal from "./ProfileModal";
import Button from "./Button";
import {
  state,
  presets,
  basePresets,
  setPreset,
  resetAllToBase,
  saveAllCurrentAsBase,
} from "@/store/wingState";
import {
  ChevronDown,
  Download,
  Upload,
  Info,
  RotateCcw,
  Save,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ConfiguratorPanel() {
  const snap = useSnapshot(state);
  const [modalState, setModalState] = useState({ isOpen: false, type: null });

  const handleExport = () => {
    // Wrap current preset with its name in the JSON
    const exportObject = {
      name: snap.preset,
      config: state.rightWingRoot,
    };
    const data = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${snap.preset}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Profile "${snap.preset}" exported`);
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
          const { name, config } = json;

          if (!name || !config) {
            toast.error("Invalid profile format");
            return;
          }

          // Case sensitive check of existing presets
          if (state.presets[name] !== undefined) {
            toast.warning(`Preset "${name}" overwritten`);
          }

          state.presets[name] = config;
          if (!state.basePresets.includes(name)) {
            state.basePresets.push(name);
          }
          setPreset(name, config);
          toast.success(`Profile "${name}" imported to Bases`);
        } catch (err) {
          console.error(err);
          toast.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const isSelectedCustom =
    snap.preset !== "custom" && !snap.basePresets.includes(snap.preset);

  const handleRenameClick = () => {
    if (!isSelectedCustom) return;
    setModalState({ isOpen: true, type: "rename" });
  };

  const handleDeleteClick = () => {
    if (!isSelectedCustom) return;
    setModalState({ isOpen: true, type: "delete" });
  };

  const executeModalAction = (value) => {
    if (modalState.type === "rename") {
      const newName = value;
      if (!newName || newName === snap.preset) return;
      if (presets[newName] !== undefined) {
        toast.error("A profile with this name already exists");
        return;
      }

      presets[newName] = presets[snap.preset];
      delete presets[snap.preset];
      state.preset = newName;
      toast.success("Profile renamed");
    } else if (modalState.type === "delete") {
      delete presets[snap.preset];
      state.preset = "empty";
      state.rightWingRoot = JSON.parse(JSON.stringify(presets["empty"]));
      toast.success("Profile deleted");
    }
  };

  return (
    <>
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
                    <optgroup label="Base Profiles">
                      {Object.keys(snap.presets)
                        .filter((p) => snap.basePresets.includes(p))
                        .map((p) => (
                          <option key={p} value={p}>
                            {p.toUpperCase()}
                          </option>
                        ))}
                    </optgroup>

                    {Object.keys(snap.presets).some(
                      (p) => !snap.basePresets.includes(p),
                    ) && (
                      <optgroup label="Custom Profiles">
                        {Object.keys(snap.presets)
                          .filter((p) => !snap.basePresets.includes(p))
                          .map((p) => (
                            <option key={p} value={p}>
                              {p.toUpperCase()}
                            </option>
                          ))}
                      </optgroup>
                    )}

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
                <Button
                  onClick={handleRenameClick}
                  disabled={!isSelectedCustom}
                  variant="primary"
                  icon={Pencil}
                  title={
                    !isSelectedCustom
                      ? "Can only rename custom profiles"
                      : "Rename profile"
                  }
                >
                  Rename
                </Button>
                <Button
                  onClick={handleDeleteClick}
                  disabled={!isSelectedCustom}
                  variant="danger"
                  icon={Trash2}
                  title={
                    !isSelectedCustom
                      ? "Can only delete custom profiles"
                      : "Delete profile"
                  }
                >
                  Delete
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleExport}
                  variant="dark"
                  icon={Download}
                >
                  Export
                </Button>
                <Button
                  onClick={handleImport}
                  variant="dark"
                  icon={Upload}
                >
                  Import
                </Button>
              </div>
            </div>

            {/* Pose Controls */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase block">
                Pose Actions
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    resetAllToBase();
                    toast.info("Pose reset to base values");
                  }}
                  variant="dark"
                  icon={RotateCcw}
                  title="Reset current pose to base values"
                >
                  Reset Pose
                </Button>
                <Button
                  onClick={() => {
                    saveAllCurrentAsBase();
                    toast.success("Current pose set as new base");
                  }}
                  variant="dark"
                  icon={Save}
                  title="Save current pose as the new base"
                >
                  Set as Base
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null })}
        type={modalState.type}
        title={
          modalState.type === "rename" ? "Rename Profile" : "Delete Profile"
        }
        description={
          modalState.type === "rename"
            ? `Choose a new name for "${snap.preset}".`
            : `Are you sure you want to delete "${snap.preset}"? This action cannot be undone.`
        }
        initialValue={snap.preset}
        actionLabel={modalState.type === "rename" ? "Rename" : "Delete"}
        onSubmit={executeModalAction}
      />
    </>
  );
}
