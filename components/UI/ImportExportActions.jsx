"use client";
import { useSnapshot } from "valtio";
import { state, setPreset } from "@/store/wingState";
import Button from "./Button";
import { Download, Upload } from "lucide-react";
import { toast } from "react-toastify";

export default function ImportExportActions() {
  const snap = useSnapshot(state);

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

  return (
    <div className="flex gap-2">
      <Button onClick={handleExport} variant="dark" icon={Download}>
        Export
      </Button>
      <Button onClick={handleImport} variant="dark" icon={Upload}>
        Import
      </Button>
    </div>
  );
}
