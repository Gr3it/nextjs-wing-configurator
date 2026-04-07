"use client";
import React, { useState, useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import { state } from "@/store/wingState";

/**
 * A1MiniWarning — 3D warning label if a piece requires a large bed
 * but the A1 mini filter is enabled.
 */
export default function A1MiniWarning({ meshRef, object, requiresLargeBed }) {
  const snap = useSnapshot(state);
  const [localCenter, setLocalCenter] = useState([0, 0, 0]);
  // Flag to run the center calculation only once per mount, after the first
  // R3F frame — at that point world matrices are guaranteed to be propagated.
  const computed = useRef(false);
  const frames = useRef(0);

  useFrame(() => {
    if (computed.current || !meshRef?.current || !object) return;
    
    if (frames.current < 2) {
      frames.current++;
      return;
    }
    
    computed.current = true;
    const box = new THREE.Box3().setFromObject(object);
    const centerV = new THREE.Vector3();
    box.getCenter(centerV);
    meshRef.current.worldToLocal(centerV);
    setLocalCenter([centerV.x, centerV.y, centerV.z]);
  });

  if (!snap.a1MiniOnly || !requiresLargeBed) return null;

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
          background: "rgba(220, 38, 38, 0.35)", // Red background for incompatibility
          color: "#fff",
          padding: "6px 14px",
          borderRadius: "10px",
          fontSize: "12px",
          fontWeight: 700,
          fontFamily: "Inter, system-ui, sans-serif",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          whiteSpace: "nowrap",
          lineHeight: 1.4,
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <span style={{ fontSize: "16px", flexShrink: 0 }}>⛔</span>
        <span>
          <strong>Incompatible piece</strong>
          <br />
          <span style={{ fontWeight: 400, opacity: 0.92 }}>
            Requires large bed
          </span>
        </span>
      </div>
    </Html>
  );
}
