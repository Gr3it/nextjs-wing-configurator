"use client";
import { useSnapshot } from "valtio";
import { state } from "@/store/wingState";
import { Body } from "../../../models/Body";

export default function Mannequin() {
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
        <group rotation={[0, Math.PI, 0]}>
          <Body />
        </group>
      </group>
    </group>
  );
}
