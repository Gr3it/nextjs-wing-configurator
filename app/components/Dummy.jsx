"use client";
import { useSnapshot } from "valtio";
import { state } from "../store/wingState";
import { Body } from "../models/Body";

export default function Dummy() {
  const snap = useSnapshot(state);

  return (
    <group>
      <group
        scale={[
          snap.mannequin.widthMultiplier * snap.mannequin.height,
          snap.mannequin.height,
          snap.mannequin.widthMultiplier * snap.mannequin.height,
        ]}
      >
        <group
          rotation={[0, Math.PI, 0]}
          position={[0, 0, -0.06]}
          scale={[1 / 1.675, 1 / 1.675, 1 / 1.675]}
        >
          <Body />
        </group>
      </group>
    </group>
  );
}
