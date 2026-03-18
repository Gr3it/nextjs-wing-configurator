"use client";
import { useState, useMemo } from "react";
import * as THREE from "three";
import { useCursor } from "@react-three/drei";

import { config } from "@/config";

// Raycast that ignores the depth buffer: always hits if the ray intersects the geometry
export function depthIgnoredRaycast(raycaster, intersects) {
  THREE.Mesh.prototype.raycast.call(this, raycaster, intersects);

  // Force a very low distance so this always wins over other meshes
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object === this) {
      intersects[i].distance = 0.0001;
    }
  }
}

export default function ConnectorVisual({
  type = "add", // "add" or "delete"
  size = config.connectors.size,
  active = false,
  onClick,
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "pointer", "auto");

  const colors = config.connectors[type];
  const color = colors.color;
  const hoverColor = colors.hoverColor;

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.beginPath();

    if (type === "add") {
      ctx.moveTo(20, 64);
      ctx.lineTo(108, 64);
      ctx.moveTo(64, 20);
      ctx.lineTo(64, 108);
    } else if (type === "delete") {
      ctx.moveTo(20, 64);
      ctx.lineTo(108, 64);
    }

    ctx.stroke();
    return new THREE.CanvasTexture(canvas);
  }, [type]);

  const showIcon = active || hovered;
  const renderOrder = type === "add" ? 10 : 5;

  return (
    <group>
      {/* Invisible hit area - always present for interaction */}
      <mesh
        raycast={depthIgnoredRaycast}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        renderOrder={renderOrder + 10} // Hit area always on top for raycasting
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>

      {/* Visible visuals - shown only on active or hover */}
      {showIcon && (
        <group renderOrder={renderOrder}>
          <mesh renderOrder={renderOrder}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshBasicMaterial
              opacity={1}
              color={hovered ? hoverColor : color}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          {texture && (
            <sprite
              scale={[size * 1.2, size * 1.2, 1]}
              renderOrder={renderOrder + 1} // Plus icon on top of sphere
            >
              <spriteMaterial
                map={texture}
                transparent
                depthTest={false}
                depthWrite={false}
                color={"#ffffff"}
              />
            </sprite>
          )}
        </group>
      )}
    </group>
  );
}
