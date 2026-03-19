"use client";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Bounds,
  Sky,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { Suspense } from "react";

import WingAssembly from "../wing/WingAssembly";
import EscDeselect from "../../UI/EscDeselect";
import Mannequin from "../mannequin/Mannequin";
import CameraResetController from "./CameraResetController";
import { config } from "@/config";

export default function Scene() {
  return (
    <div className="w-screen h-screen bg-slate-100">
      <Canvas shadows camera={config.camera}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Sky sunPosition={[100, 20, 100]} />

          <Mannequin />
          <Bounds fit>
            <CameraResetController />
            <WingAssembly />
          </Bounds>

          <ContactShadows
            opacity={0.4}
            scale={10}
            blur={2.4}
            far={10}
            resolution={256}
            color="#000000"
          />
        </Suspense>

        <OrbitControls makeDefault />
      </Canvas>
      <EscDeselect />
    </div>
  );
}
