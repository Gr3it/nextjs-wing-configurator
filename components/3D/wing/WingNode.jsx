"use client";
import { PivotControls, useGLTF, useCursor } from "@react-three/drei";
import { useCallback, useState } from "react";
import piecesData from "@/data/pieces.json";
import { b2t, b2tRot } from "@/lib/coords";
import { clearActive, setActive, state } from "@/store/wingState";
import { useSnapshot } from "valtio";
import {
  AddButton as ConnectorButton,
  DeleteButton as PieceDeleteButton,
} from "../piece";
import { useHighlightedScene } from "@/hooks/useHighlightedScene";
import { useNodeRotation } from "@/hooks/useNodeRotation";
import ExtraPiece from "./ExtraPiece";

export default function WingNode({
  node,
  path,
  isRight,
  position = [0, 0, 0],
}) {
  const pieceInfo = piecesData.pieces[node.piece];
  if (!pieceInfo) return null;

  const { scene } = useGLTF(`/${piecesData.info.folder}${pieceInfo.file}`);
  const [isHovered, setIsHovered] = useState(false);
  useCursor(isHovered);

  const snap = useSnapshot(state);
  const isActive =
    snap.active.isRight === isRight &&
    snap.active.path !== null &&
    snap.active.path.join(",") === path.join(",");

  const limits = piecesData.connectorRotationLimits?.[pieceInfo.source];
  const rotationAxis = limits?.axis;
  const step = limits?.step ? limits.step * (Math.PI / 180) : undefined;
  const currentAngle = node.rotation.current;

  const {
    pivotRef: rotationRef,
    activeAxes,
    rotationLimits,
    matrix,
    handleDrag,
  } = useNodeRotation({
    isRight,
    rotationAxis,
    currentAngle,
    limits,
    step,
    path,
  });

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (isActive) {
        clearActive();
      } else {
        setActive(path, isRight);
      }
    },
    [path, isRight, isActive],
  );

  const extraPieces = pieceInfo.extra?.map((extraKey) => (
    <ExtraPiece key={extraKey} pieceKey={extraKey} active={isActive} />
  ));

  const mainScene = useHighlightedScene(scene, isActive, isHovered);

  const children = pieceInfo.connectors?.map((conn, idx) => {
    const childNode = node.children?.[idx];
    const connPos = b2t(conn.position);
    const connRot = conn.customRotation
      ? b2tRot(conn.customRotation)
      : undefined;

    if (!childNode) {
      return (
        <group key={`placeholder-${idx}`} position={connPos} rotation={connRot}>
          <ConnectorButton
            connectorType={conn.type}
            parentPath={path}
            connectorIndex={idx}
            active={isActive}
          />
        </group>
      );
    }

    return (
      <group
        key={`${childNode.piece}-${idx}`}
        position={connPos}
        rotation={connRot}
      >
        <WingNode node={childNode} path={[...path, idx]} isRight={isRight} />
      </group>
    );
  });

  return (
    <group
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
    >
      <group scale={isRight ? [1, 1, 1] : [-1, 1, 1]}>
        <PivotControls
          axisColors={["red", "red", "red"]}
          ref={rotationRef}
          scale={0.15}
          lineWidth={2}
          disableScaling
          disableSliders
          disableAxes
          activeAxes={activeAxes}
          rotationLimits={rotationLimits}
          onDrag={handleDrag}
          depthTest={false}
          visible={isActive && rotationAxis != undefined}
          matrix={matrix}
        >
          <primitive object={mainScene} castShadow receiveShadow />
          {extraPieces}
          {children}
        </PivotControls>
      </group>
      <PieceDeleteButton path={path} isActive={isActive} />
    </group>
  );
}
