"use client";
import { useState } from "react";
import * as THREE from "three";
import { useCursor } from "@react-three/drei";
import AddMenu from "./AddMenu";

// Raycast che ignora il depth buffer: colpisce sempre se il raggio interseca la geometria
function depthIgnoredRaycast(raycaster, intersects) {
  // Usa il raycast standard di Mesh ma poi azzera la distanza per non essere scavalcato
  THREE.Mesh.prototype.raycast.call(this, raycaster, intersects);

  // Per ogni intersezione trovata, forza una distanza bassa così vince su tutto
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object === this) {
      intersects[i].distance = 0.0001;
    }
  }
}

export default function ConnectorAdd({
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
      {/* Cerchio pieno — hit area principale con raycast prioritario */}
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

      {/* Barra orizzontale */}
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

      {/* Barra verticale */}
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

      {/* Menu overlay */}
      {open && (
        <AddMenu
          connectorType={connectorType}
          parentPath={parentPath}
          connectorIndex={connectorIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </group>
  );
}
