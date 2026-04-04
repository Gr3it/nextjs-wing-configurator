"use client";
import { useState } from "react";
import { useSnapshot } from "valtio";
import { state, presets, setPreset } from "@/store/wingState";
import Button from "./Button";
import ProfileModal from "./ProfileModal";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function ProfileControls() {
  const snap = useSnapshot(state);
  const [modalState, setModalState] = useState({ isOpen: false, type: null });

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
    <div id="profile-controls" className="space-y-4">
      <div>
        <label className="text-xs font-mono text-[#ccc] uppercase tracking-widest block mb-2">
          Preset Profile
        </label>
        <div className="relative">
          <select
            value={snap.preset}
            onChange={(e) => setPreset(e.target.value, presets[e.target.value])}
            className="w-full appearance-none bg-[#2a2a2a] border border-[#444] text-white py-2 px-3 pr-8 rounded-lg outline-none focus:border-[#666] font-mono text-xs uppercase tracking-wide cursor-pointer"
          >
            <optgroup
              label="Base Profiles"
              style={{ background: "#222", color: "#888" }}
            >
              {Object.keys(snap.presets)
                .filter((p) => snap.basePresets.includes(p))
                .map((p) => (
                  <option
                    key={p}
                    value={p}
                    style={{ background: "#222", color: "#fff" }}
                  >
                    {p.toUpperCase()}
                  </option>
                ))}
            </optgroup>

            {Object.keys(snap.presets).some(
              (p) => !snap.basePresets.includes(p),
            ) && (
              <optgroup
                label="Custom Profiles"
                style={{ background: "#1a1a1a", color: "#888" }}
              >
                {Object.keys(snap.presets)
                  .filter((p) => !snap.basePresets.includes(p))
                  .map((p) => (
                    <option
                      key={p}
                      value={p}
                      style={{ background: "#1a1a1a", color: "#ddd" }}
                    >
                      {p.toUpperCase()}
                    </option>
                  ))}
              </optgroup>
            )}

            {snap.preset === "custom" && (
              <option
                value="custom"
                style={{ background: "#1a1a1a", color: "#ddd" }}
              >
                CUSTOM (Modified)
              </option>
            )}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-[#555]">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
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
    </div>
  );
}
