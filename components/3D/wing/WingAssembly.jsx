import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { state } from "@/store/wingState";
import pieces from "@/data/pieces.json";

import WingBranch from "./WingBranch";
import WingGizmo from "./WingGizmo";
import { b2t } from "@/lib/coords";

export default function WingAssembly() {
  const groupRef = useRef();
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
    <>
      <group
        ref={groupRef}
        position={[0, snap.backplateHeightRatio * snap.mannequin.height, 0]}
      >
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

      {/* Measurement Gizmo (Renders in World Space) */}
      <WingGizmo groupRef={groupRef} />
    </>
  );
}

// Preload all GLBs at startup to avoid white flash when new pieces are added
Object.values(pieces.pieces).forEach((piece) => {
  if (piece.file) {
    useGLTF.preload(`/${pieces.info.folder}${piece.file}`);
  }
});
