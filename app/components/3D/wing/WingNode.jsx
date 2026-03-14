"use client";
import { PivotControls, useGLTF } from "@react-three/drei";
import { useRef, useCallback, useEffect, useMemo } from "react";
import * as THREE from "three";
import piecesData from "../../../data/pieces.json";
import { b2t, b2tRot } from "../../../lib/coords";
import {
  updateCurrentRotation,
  getNodeByPath,
  setActive,
  state,
} from "../../../store/wingState";
import { useSnapshot } from "valtio";
import ConnectorButton from "./ConnectorButton";
import PieceDeleteButton from "../../UI/PieceDeleteButton";

function snapToStep(value, step) {
  if (!step) return value;
  return Math.round(value / step) * step;
}

function buildRotationMatrix(axis, angle) {
  const euler = new THREE.Euler(
    axis === "x" ? angle : 0,
    axis === "y" ? angle : 0,
    axis === "z" ? angle : 0,
    "XYZ",
  );
  return new THREE.Matrix4().makeRotationFromEuler(euler);
}

function ExtraPiece({ pieceKey, active }) {
  const pieceInfo = piecesData.pieces[pieceKey];
  if (!pieceInfo) return null;

  const { scene } = useGLTF(`/${piecesData.info.folder}${pieceInfo.file}`);
  const clonedScene = useMemo(() => {
    const s = scene.clone();
    if (active) {
      s.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          child.material.color.set("#a3e635"); // Vibrant lime green
          child.material.emissive = new THREE.Color("#4ade80");
          child.material.emissiveIntensity = 0.2;
        }
      });
    }
    return s;
  }, [scene, active]);

  return <primitive object={clonedScene} castShadow receiveShadow />;
}

export default function WingNode({
  node,
  path,
  isRight,
  position = [0, 0, 0],
}) {
  const pieceInfo = piecesData.pieces[node.piece];
  if (!pieceInfo) return null;

  const { scene } = useGLTF(`/${piecesData.info.folder}${pieceInfo.file}`);
  const pivotRef = useRef();

  const snap = useSnapshot(state);
  const isActive =
    snap.active.isRight === isRight &&
    snap.active.path !== null &&
    snap.active.path.join(",") === path.join(",");

  const limits = piecesData.connectorRotationLimits?.[pieceInfo.source];
  const rotationAxis = limits?.axis;

  const activeAxes = [
    rotationAxis !== "x",
    rotationAxis !== "y",
    rotationAxis !== "z",
  ];

  const rotationLimits = [
    rotationAxis === "x" && limits
      ? [limits.min * (Math.PI / 180), limits.max * (Math.PI / 180)]
      : undefined,
    rotationAxis === "y" && limits
      ? [limits.min * (Math.PI / 180), limits.max * (Math.PI / 180)]
      : undefined,
    rotationAxis === "z" && limits
      ? [limits.min * (Math.PI / 180), limits.max * (Math.PI / 180)]
      : undefined,
  ];

  const step = limits?.step ? limits.step * (Math.PI / 180) : undefined;
  const currentAngle = node.rotation.current;

  useEffect(() => {
    if (!pivotRef.current) return;
    const matrix = isRight
      ? buildRotationMatrix(rotationAxis, currentAngle)
      : new THREE.Matrix4()
          .makeScale(-1, 1, 1)
          .multiply(buildRotationMatrix(rotationAxis, currentAngle));
    pivotRef.current.matrix.copy(matrix);
    pivotRef.current.matrixWorldNeedsUpdate = true;
  }, [currentAngle, rotationAxis, isRight]);

  const handleDrag = useCallback(
    (matrix) => {
      const m = isRight
        ? matrix
        : new THREE.Matrix4().makeScale(-1, 1, 1).multiply(matrix);

      const euler = new THREE.Euler().setFromRotationMatrix(m, "XYZ");
      let angle = euler[rotationAxis];

      // Negate angle for left side to fix inverted rotation direction
      if (!isRight) angle = -angle;

      if (step) angle = snapToStep(angle, step);

      if (limits) {
        const min = limits.min * (Math.PI / 180);
        const max = limits.max * (Math.PI / 180);
        angle = Math.max(min, Math.min(max, angle));
      }

      if (pivotRef.current) {
        const snappedMatrix = isRight
          ? buildRotationMatrix(rotationAxis, angle)
          : new THREE.Matrix4()
              .makeScale(-1, 1, 1)
              .multiply(buildRotationMatrix(rotationAxis, angle));
        pivotRef.current.matrix.copy(snappedMatrix);
        pivotRef.current.matrixWorldNeedsUpdate = true;
      }

      const storeNode = getNodeByPath(path);
      if (storeNode) updateCurrentRotation(storeNode, angle);
    },
    [path, rotationAxis, step, limits, isRight],
  );

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      setActive(path, isRight);
    },
    [path, isRight],
  );

  const extraPieces = pieceInfo.extra?.map((extraKey) => (
    <ExtraPiece key={extraKey} pieceKey={extraKey} active={isActive} />
  ));

  const mainScene = useMemo(() => {
    const s = scene.clone();
    if (isActive) {
      s.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          child.material.color.set("#a3e635"); // Vibrant lime green
          child.material.emissive = new THREE.Color("#4ade80");
          child.material.emissiveIntensity = 0.2;
        }
      });
    }
    return s;
  }, [scene, isActive]);

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
      <group key={idx} position={connPos} rotation={connRot}>
        <WingNode node={childNode} path={[...path, idx]} isRight={isRight} />
      </group>
    );
  });

  return (
    <group position={position} onClick={handleClick}>
      <group scale={isRight ? [1, 1, 1] : [-1, 1, 1]}>
        <PivotControls
          axisColors={["red", "red", "red"]}
          ref={pivotRef}
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
          matrix={
            isRight
              ? buildRotationMatrix(rotationAxis, currentAngle)
              : new THREE.Matrix4()
                  .makeScale(-1, 1, 1)
                  .multiply(buildRotationMatrix(rotationAxis, currentAngle))
          }
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
