"use client";
import { PivotControls, useGLTF, useCursor } from "@react-three/drei";
import { useCallback, useState } from "react";
import { useSnapshot } from "valtio";
import piecesData from "@/data/pieces.json";
import { b2t, b2tRot } from "@/lib/coords";
import { clearActive, setActive, state } from "@/store/wingState";
import {
  AddButton as ConnectorButton,
  DeleteButton as PieceDeleteButton,
  HingeWarnings,
} from "../piece";
import { useHighlightedScene } from "@/hooks/useHighlightedScene";
import { useNodeRotation } from "@/hooks/useNodeRotation";
import ExtraPiece from "./ExtraPiece";

/** Piece sources that represent a hinge joint. */
const HINGE_SOURCES = new Set(["HL", "HR"]);

export default function WingNode({
  node,
  path,
  isRight,
  position = [0, 0, 0],
}) {
  const pieceInfo = piecesData.pieces[node.piece];
  if (!pieceInfo) return null;

  return (
    <WingNodeInner
      node={node}
      path={path}
      isRight={isRight}
      position={position}
      pieceInfo={pieceInfo}
    />
  );
}

// Separated so the early-return above doesn't break hook rules.
function WingNodeInner({ node, path, isRight, position, pieceInfo }) {
  const { scene } = useGLTF(`/${piecesData.info.folder}${pieceInfo.file}`);
  const [isHovered, setIsHovered] = useState(false);
  useCursor(isHovered);

  const snap = useSnapshot(state);
  const isActive =
    snap.active.isRight === isRight &&
    snap.active.path?.join(",") === path.join(",");

  const limits = piecesData.connectorRotationLimits?.[pieceInfo.source];
  const rotationAxis = limits?.axis;
  const step = limits?.step ? limits.step * (Math.PI / 180) : undefined;

  const {
    pivotRef,
    targetRef,
    activeAxes,
    handleDrag,
    onDragStart,
    onDragEnd,
  } = useNodeRotation({
    rotationAxis,
    currentAngle: node.rotation.current,
    limits,
    step,
    path,
    isRight,
  });

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      isActive ? clearActive() : setActive(path, isRight);
    },
    [isActive, path, isRight],
  );

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation();
    setIsHovered(true);
  }, []);

  const handlePointerOut = useCallback((e) => {
    e.stopPropagation();
    setIsHovered(false);
  }, []);

  const mainScene = useHighlightedScene(scene, isActive, isHovered);
  const canRotate = isActive && rotationAxis !== undefined;
  const isHinge = HINGE_SOURCES.has(pieceInfo.source);

  return (
    <group position={position}>
      <group
        scale={isRight ? 1 : -1}
        rotation={[
          isRight ? 0 : rotationAxis === "x" ? Math.PI : 0,
          isRight ? 0 : rotationAxis === "y" ? Math.PI : 0,
          isRight ? 0 : rotationAxis === "z" ? Math.PI : 0,
        ]}
      >
        <PivotControls
          ref={pivotRef}
          axisColors={["blue", "blue", "blue"]}
          scale={0.15}
          lineWidth={2}
          disableScaling
          disableSliders
          disableAxes
          activeAxes={activeAxes}
          onDrag={handleDrag}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          depthTest={false}
          visible={canRotate}
          enabled={canRotate}
        />
      </group>

      <group
        ref={targetRef}
        matrixAutoUpdate={false}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={mainScene} />
        {pieceInfo.extra?.map((extraKey) => (
          <ExtraPiece key={extraKey} pieceKey={extraKey} active={isActive} />
        ))}

        {pieceInfo.connectors?.map((conn, idx) => {
          const childNode = node.children?.[idx];
          const connPos = b2t(conn.position);
          const connRot = conn.customRotation
            ? b2tRot(conn.customRotation)
            : undefined;

          return (
            <group
              key={`${childNode?.piece ?? "placeholder"}-${idx}`}
              position={connPos}
              rotation={connRot}
            >
              {childNode ? (
                <WingNode
                  node={childNode}
                  path={[...path, idx]}
                  isRight={isRight}
                />
              ) : (
                <ConnectorButton
                  connectorType={conn.type}
                  parentPath={path}
                  connectorIndex={idx}
                  active={isActive}
                />
              )}
            </group>
          );
        })}
      </group>

      {/* Hinge detachment warning — self-contained, renders 2 units above */}
      {isHinge && (
        <HingeWarnings
          meshRef={targetRef}
          label={pieceInfo.labelnameOverride ?? pieceInfo.label}
        />
      )}

      <PieceDeleteButton path={path} isActive={isActive} />
    </group>
  );
}
