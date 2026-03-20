"use client";
import React, { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { state } from "@/store/wingState";

export default function WingGizmo({ groupRef }) {
  const snap = useSnapshot(state);
  const [dimensions, setDimensions] = useState({
    span: 0,
    height: 0,
    width: 0,
    center: [0, 0, 0],
    min: [0, 0, 0],
    max: [0, 0, 0],
  });
  const box = useMemo(() => new THREE.Box3(), []);

  const lastRef = useRef({ span: 0, height: 0 });

  useFrame(() => {
    if (!groupRef.current || !snap.showGizmo) return;

    // Force update matrix to get accurate bounding box
    groupRef.current.updateWorldMatrix(true, true);

    // Calculate the bounding box of the whole assembly
    box.setFromObject(groupRef.current);

    const size = new THREE.Vector3();
    box.getSize(size);

    const center = new THREE.Vector3();
    box.getCenter(center);

    // Only update if there's a significant change to avoid re-renders
    if (
      size.x > 0 &&
      (Math.abs(lastRef.current.span - size.x) > 0.001 ||
        Math.abs(lastRef.current.height - size.y) > 0.001)
    ) {
      lastRef.current = { span: size.x, height: size.y };
      setDimensions({
        span: size.x,
        height: size.y,
        width: size.z,
        center: [center.x, center.y, center.z],
        min: [box.min.x, box.min.y, box.min.z],
        max: [box.max.x, box.max.y, box.max.z],
      });
    }
  });

  if (!snap.showGizmo || dimensions.span === 0) return null;

  const { span, height, min, max, center } = dimensions;

  // Depth position: slightly in front of the model
  // We use the min[2] which is the most negative (forward) Z in Three.js
  const zPos = min[2];

  // Measurement UI
  return (
    <group renderOrder={100}>
      {/* Horizontal Line for Span */}
      <group position={[0, max[1] + 0.3, zPos]}>
        <Line
          points={[
            [min[0], 0, 0],
            [max[0], 0, 0],
          ]}
          color="#3b82f6"
          lineWidth={4}
          depthTest={false}
        />
        <Html position={[0, 0.25, 0]} center zIndexRange={[100, 200]}>
          <div className="bg-blue-600 text-white px-4 py-1.5 rounded-xl shadow-2xl text-[16px] font-black whitespace-nowrap border-2 border-white pointer-events-none uppercase tracking-wider">
            Span {span.toFixed(2)}m
          </div>
        </Html>
        {/* Tick marks */}
        <Line
          points={[
            [min[0], -0.15, 0],
            [min[0], 0.15, 0],
          ]}
          color="#3b82f6"
          lineWidth={4}
          depthTest={false}
        />
        <Line
          points={[
            [max[0], -0.15, 0],
            [max[0], 0.15, 0],
          ]}
          color="#3b82f6"
          lineWidth={4}
          depthTest={false}
        />
      </group>

      {/* Vertical Line for Height */}
      <group position={[max[0] + 0.4, 0, zPos]}>
        <Line
          points={[
            [0, min[1], 0],
            [0, max[1], 0],
          ]}
          color="#ef4444"
          lineWidth={4}
          depthTest={false}
        />
        <Html
          position={[0.3, (min[1] + max[1]) / 2, 0]}
          center
          zIndexRange={[100, 200]}
        >
          <div className="bg-red-600 text-white px-4 py-1.5 rounded-xl shadow-2xl text-[16px] font-black whitespace-nowrap border-2 border-white -rotate-90 pointer-events-none uppercase tracking-wider">
            Height {height.toFixed(2)}m
          </div>
        </Html>
        {/* Tick marks */}
        <Line
          points={[
            [-0.15, min[1], 0],
            [0.15, min[1], 0],
          ]}
          color="#ef4444"
          lineWidth={4}
          depthTest={false}
        />
        <Line
          points={[
            [-0.15, max[1], 0],
            [0.15, max[1], 0],
          ]}
          color="#ef4444"
          lineWidth={4}
          depthTest={false}
        />
      </group>
    </group>
  );
}
