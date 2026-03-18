"use client";
import { useEffect } from "react";
import { useBounds } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { state } from "@/store/wingState";
import { config } from "@/config";
import * as THREE from "three";

export default function CameraResetController() {
  const bounds = useBounds();
  const snap = useSnapshot(state);

  useEffect(() => {
    // Only fit if cameraResetKey is greater than 0
    if (snap.cameraResetKey > 0) {
      bounds.refresh();
      const { center, distance } = bounds.getSize();
      
      const initialPos = new THREE.Vector3(...config.camera.position);
      const direction = initialPos.clone().sub(center).normalize();
      const targetPos = center.clone().add(direction.multiplyScalar(distance));
      
      bounds.moveTo(targetPos).lookAt({ target: center });
    }
  }, [snap.cameraResetKey, bounds]);

  return null;
}
