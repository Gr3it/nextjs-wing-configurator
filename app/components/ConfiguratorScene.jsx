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
import Dummy from "./Dummy";
import Wings from "./Wings";
import DeselectOnEsc from "./DeselectOnEsc";

export default function ConfiguratorScene() {
  return (
    <div className="w-screen h-screen bg-slate-100">
      <Canvas shadows camera={{ position: [2, 2, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Sky sunPosition={[100, 20, 100]} />

          <Bounds fit observe margin={1.2}>
            <Dummy />
            <Wings />
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
      <DeselectOnEsc />
    </div>
  );
}
