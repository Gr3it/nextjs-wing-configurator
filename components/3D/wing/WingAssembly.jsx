"use client";
import React from "react";
import { useGLTF } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { state } from "@/store/wingState";
import pieces from "@/data/pieces.json";

import WingBranch from "./WingBranch";
import { b2t } from "@/lib/coords";

export default function WingAssembly() {
  const snap = useSnapshot(state);
  const path = `/${pieces.info.folder}${pieces.pieces.backplate.file}`;
  const { scene } = useGLTF(path);

  const connector = pieces.pieces.backplate.connectors[0];
  const blenderRightPos = connector.position;
  const rightPos = b2t(blenderRightPos);

  const blenderLeftPos = [
    -blenderRightPos[0],
    blenderRightPos[1],
    blenderRightPos[2],
  ];
  const leftPos = b2t(blenderLeftPos);

  return (
    <group position={[0, snap.backplateHeightRatio * snap.mannequin.height, 0]}>
      <primitive object={scene} castShadow receiveShadow />

      {/* Right Wing */}
      <WingBranch
        isRight={true}
        position={rightPos}
        rootNode={snap.rightWingRoot}
        connectorType={connector.type}
      />

      {/* Left Wing */}
      <WingBranch
        isRight={false}
        position={leftPos}
        rootNode={snap.rightWingRoot}
        connectorType={connector.type}
      />
    </group>
  );
}

// Preload all GLBs at startup to avoid white flash when new pieces are added
Object.values(pieces.pieces).forEach((piece) => {
  useGLTF.preload(`/${pieces.info.folder}${piece.file}`);
});
