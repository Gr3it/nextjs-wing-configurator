"use client";
import React from "react";
import WingNode from "./WingNode";
import { AddButton as ConnectorButton } from "../piece";

export default function WingBranch({
  isRight,
  position,
  rootNode,
  connectorType,
}) {
  if (!rootNode) {
    return (
      <ConnectorButton
        position={position}
        size={0.05}
        connectorType={connectorType}
        parentPath={[]}
        connectorIndex={-1}
        active={true}
      />
    );
  }

  return isRight ? (
    <WingNode node={rootNode} path={[]} isRight={true} position={position} />
  ) : (
    <group position={position} scale={[-1, 1, 1]}>
      <WingNode node={rootNode} path={[]} isRight={false} />
    </group>
  );
}
