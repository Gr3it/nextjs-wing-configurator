"use client";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Bounds,
  Sky,
  Environment,
  Shadow,
  Stats,
} from "@react-three/drei";
import { Suspense } from "react";

import WingAssembly from "../wing/WingAssembly";
import EscDeselect from "../../UI/EscDeselect";
import Mannequin from "../mannequin/Mannequin";
import CameraResetController from "./CameraResetController";
import { config } from "@/config";

export default function Scene() {
  return (
    <div id="three-canvas-container" className="w-screen h-screen bg-slate-100">
      <Canvas shadows camera={config.camera}>
        {config.showStats && <Stats />}
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Sky sunPosition={[100, 20, 100]} />

          <Mannequin />
          <Bounds fit>
            <CameraResetController />
            <WingAssembly />
          </Bounds>

          {/* 
            Static radial shadow to avoid "ContactShadows" bugs with PivotControls.
            This creates a clean, blurred circular shadow at the center.
          */}
          <Shadow
            color="#000000"
            opacity={0.15}
            scale={[3, 3, 1]}
            position={[0, 0, -0.12]}
            rotation-x={-Math.PI / 2}
          />
        </Suspense>

        <OrbitControls makeDefault zoomSpeed={2} />
      </Canvas>
      <EscDeselect />
    </div>
  );
}
