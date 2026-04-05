"use client";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { config } from "@/config";

// ---------------------------------------------------------------------------
// Module-level constants — allocated once, reused every frame across all
// HingeWarnings instances (useFrame callbacks run synchronously).
// ---------------------------------------------------------------------------
const _UP = new THREE.Vector3(0, 1, 0); // world UP in Three.js (Y-up)
const _quat = new THREE.Quaternion();
const _slotDir = new THREE.Vector3(); // hinge dovetail slot direction
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Self-contained hinge warning component.
 *
 * Every frame it queries the world orientation of `meshRef` via
 * `getWorldQuaternion`, rotates the local Z axis (0,0,1) into world space,
 * and measures its angle against world UP (0,1,0).
 *
 * If the angle exceeds `config.hingeWarningAngleDeg` (default 50°) it renders
 * a drei Html warning label 2 units above the piece.
 *
 * @param {{ meshRef: React.RefObject, label: string }} props
 */
export default function HingeWarnings({ meshRef, object, label }) {
  const [warningAngle, setWarningAngle] = useState(null);
  const [localCenter, setLocalCenter] = useState([0, 0, 0]);
  const lastRef = useRef(null);

  useEffect(() => {
    if (meshRef?.current && object) {
      meshRef.current.updateMatrixWorld();
      const box = new THREE.Box3().setFromObject(object);
      const centerV = new THREE.Vector3();
      box.getCenter(centerV);
      meshRef.current.worldToLocal(centerV);
      setLocalCenter([centerV.x, centerV.y, centerV.z]);
    }
  }, [meshRef, object]);

  useFrame(() => {
    if (!meshRef?.current) return;

    // Get the world-space quaternion of the hinge group directly from
    // the Three.js scene graph — no manual matrix math needed.
    meshRef.current.getWorldQuaternion(_quat);

    // The hinge dovetail slot runs along the LOCAL Y axis of the piece
    // (Blender Z = Three.js Y). Since the hinge itself rotates around Y,
    // its own rotation NEVER changes the Y component — so this measurement
    // captures only the tilt introduced by the upstream arm structure.
    // (Local Z would always produce 90° because any Y-rotation leaves Z
    // perpendicular to UP — that was the previous bug.)
    _slotDir.set(0, 1, 0).applyQuaternion(_quat);

    // Angle between the dovetail slot direction and world UP.
    const angleDeg = _slotDir.angleTo(_UP) * RAD_TO_DEG;

    const next =
      angleDeg > config.hingeWarningAngleDeg ? angleDeg.toFixed(1) : null;

    // Only trigger a React re-render when the violation status changes.
    if (next !== lastRef.current) {
      lastRef.current = next;
      setWarningAngle(next);
    }
  });

  if (!warningAngle) return null;

  return (
    <Html
      center
      position={localCenter}
      zIndexRange={[50, 100]}
      style={{ pointerEvents: "none" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(234, 88, 12, 0.35)",
          color: "#fff",
          padding: "6px 14px",
          borderRadius: "10px",
          fontSize: "12px",
          fontWeight: 700,
          fontFamily: "Inter, system-ui, sans-serif",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          whiteSpace: "nowrap",
          lineHeight: 1.4,
        }}
      >
        <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
        <span>
          <strong>Detachment risk</strong>
          <br />
          <span style={{ fontWeight: 400, opacity: 0.92 }}>
            Angle too steep
          </span>
        </span>
      </div>
    </Html>
  );
}
