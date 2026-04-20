"use client";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * PieceCenterContainer calculates the geometric center of a piece's bounding box
 * and renders a <group> at that local position. This allows child elements (like warnings)
 * to be rendered naturally at [0, 0, 0].
 * 
 * @param {Object} props - Component props
 * @param {React.MutableRefObject} props.meshRef - A reference to the parent target/mesh group
 * @param {THREE.Object3D} props.object - The main scene/object to get the bounding box from
 * @param {React.ReactNode} props.children - Child components to render at the center
 */
export default function PieceCenterContainer({ meshRef, object, children }) {
  const [localCenter, setLocalCenter] = useState([0, 0, 0]);
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

  return (
    <group position={localCenter}>
      {children}
    </group>
  );
}
