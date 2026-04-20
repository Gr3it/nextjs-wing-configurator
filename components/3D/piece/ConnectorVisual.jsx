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
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Lucide icons are natively 24x24. Scale up by 5 to fit 120x120.
    ctx.scale(5, 5);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const drawPath = (d) => {
      ctx.beginPath();
      ctx.stroke(new Path2D(d));
    };

    if (type === "add") {
      // Plus icon
      drawPath("M5 12h14");
      drawPath("M12 5v14");
    } else if (type === "delete") {
      // Minus icon
      drawPath("M5 12h14");
    } else if (type === "swap") {
      // RefreshCcw icon (Counterclockwise)
      drawPath("M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8");
      drawPath("M3 3v5h5");
      drawPath("M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16");
      drawPath("M16 16h5v5");
    }

    // For debugging: ctx.strokeRect(0, 0, 24, 24);

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
