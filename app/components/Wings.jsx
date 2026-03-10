"use client";
import React from "react";
import { useGLTF } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { state } from "../store/wingState";
import pieces from "../data/pieces.json";

import WingNode from "./WingNode";
import ConnectorAdd from "./ConnectorAdd";
import { b2t } from "../lib/coords";

export default function Wings() {
  const snap = useSnapshot(state);
  const path = `/${pieces.info.folder}${pieces.pieces.backplate.file}`;
  const { scene } = useGLTF(path);

  const blenderRightPos = pieces.pieces.backplate.connectors[0].position;
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

      {/* Right Wing — editable, con PivotControls */}
      {snap.rightWingRoot ? (
        <WingNode
          node={snap.rightWingRoot}
          path={[]}
          isRight={true}
          position={rightPos}
        />
      ) : (
        <ConnectorAdd
          position={rightPos}
          size={0.05}
          connectorType={pieces.pieces.backplate.connectors[0].type}
          parentPath={[]}
          connectorIndex={-1}
          active={true}
        />
      )}

      {/* Left Wing — mirror, senza PivotControls */}
      {snap.rightWingRoot ? (
        <group position={leftPos} scale={[-1, 1, 1]}>
          <WingNode node={snap.rightWingRoot} path={[]} isRight={false} />
        </group>
      ) : (
        <ConnectorAdd
          position={leftPos}
          size={0.05}
          connectorType={pieces.pieces.backplate.connectors[0].type}
          parentPath={[]}
          connectorIndex={-1}
          active={true}
        />
      )}
    </group>
  );
}

useGLTF.preload(`/${pieces.info.folder}${pieces.pieces.backplate.file}`);
