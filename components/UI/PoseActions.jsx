"use client";
import Button from "./Button";
import { RotateCcw, Save } from "lucide-react";
import { resetAllToBase, saveAllCurrentAsBase } from "@/store/wingState";
import { toast } from "react-toastify";

export default function PoseActions() {
  return (
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
  );
}
