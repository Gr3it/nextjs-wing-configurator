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

// Suppress THREE.Clock warnings during development
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) {
    console.trace("THREE.Clock warning origin 👇");
  }
  originalWarn(...args);
};

export default function Scene() {
  return (
    <div className="w-screen h-screen bg-slate-100">
      <Canvas shadows camera={{ position: [2, 2, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Sky sunPosition={[100, 20, 100]} />

          <Bounds fit observe margin={1.2}>
            <Mannequin />
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
