"use client";
import { Focus } from "lucide-react";
import Button from "./Button";
import { triggerCameraReset } from "@/store/wingState";

export default function HUDButtons() {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 pointer-events-auto">
      <Button
        variant="dark"
        icon={Focus}
        onClick={triggerCameraReset}
        fullWidth={false}
        className="shadow-md rounded-full px-6"
      >
        Reset Camera
      </Button>
    </div>
  );
}
