"use client";
import Button from "./Button";
import { RotateCcw, Save } from "lucide-react";
import { resetAllToBase, saveAllCurrentAsBase } from "@/store/wingState";
import { toast } from "react-toastify";

export default function PoseActions() {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-mono text-[#ccc] uppercase tracking-widest block">
        Pose Actions
      </label>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            resetAllToBase();
            toast.info("Pose reset to base values");
          }}
          variant="primary"
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
          variant="primary"
          icon={Save}
          title="Save current pose as the new base"
        >
          Set Base
        </Button>
      </div>
    </div>

  );
}
