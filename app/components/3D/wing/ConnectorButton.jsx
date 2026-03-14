"use client";
import { useState } from "react";
import * as THREE from "three";
import { useCursor } from "@react-three/drei";
import PieceAddMenu from "../../UI/PieceAddMenu";

// Raycast that ignores the depth buffer: always hits if the ray intersects the geometry
function depthIgnoredRaycast(raycaster, intersects) {
  THREE.Mesh.prototype.raycast.call(this, raycaster, intersects);

  // Force a very low distance so this always wins over other meshes
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object === this) {
      intersects[i].distance = 0.0001;
    }
  }
}

export default function ConnectorButton({
  position = [0, 0, 0],
  size = 0.02,
  connectorType,
  parentPath,
  connectorIndex,
  active = false,
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  useCursor(hovered, "pointer", "auto");

  const barThickness = size * 0.2;
  const barLength = size * 0.7;

  const showPlus = active || hovered;

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  return (
    <group position={position} renderOrder={999}>
      {/* Hit area circle with priority raycast */}
      <mesh
        raycast={depthIgnoredRaycast}
        renderOrder={999}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <circleGeometry args={[size, 64]} />
        <meshBasicMaterial
          transparent
          opacity={showPlus ? 0.2 : 0}
          color={hovered ? "#555555" : "#333333"}
          side={THREE.DoubleSide}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>

      {/* Horizontal bar */}
      {showPlus && (
        <mesh position={[0, 0, 0.0001]} raycast={() => null} renderOrder={999}>
          <planeGeometry args={[barLength, barThickness]} />
          <meshBasicMaterial
            color={hovered ? "#ffffff" : "#dddddd"}
            side={THREE.DoubleSide}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Vertical bar */}
      {showPlus && (
        <mesh position={[0, 0, 0.0001]} raycast={() => null} renderOrder={999}>
          <planeGeometry args={[barThickness, barLength]} />
          <meshBasicMaterial
            color={hovered ? "#ffffff" : "#dddddd"}
            side={THREE.DoubleSide}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Piece picker overlay */}
      {open && (
        <PieceAddMenu
          connectorType={connectorType}
          parentPath={parentPath}
          connectorIndex={connectorIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </group>
  );
}
