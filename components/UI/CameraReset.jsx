"use client";
import { Focus } from "lucide-react";
import Button from "./Button";
import { triggerCameraReset } from "@/store/wingState";

export default function CameraReset() {
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="primary"
        icon={Focus}
        onClick={triggerCameraReset}
        fullWidth={false}
      >
        Reset Camera
      </Button>
    </div>
  );
}
