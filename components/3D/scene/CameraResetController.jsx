"use client";
import { useEffect } from "react";
import { useBounds } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import { state } from "@/store/wingState";
import { config } from "@/config";
import * as THREE from "three";

export default function CameraResetController() {
  const bounds = useBounds();
  const snap = useSnapshot(state);
  const { camera, controls } = useThree();

  useEffect(() => {
    if (snap.cameraResetKey > 0) {
      bounds.refresh();
      const { center, distance } = bounds.getSize();

      const initialPos = new THREE.Vector3(...config.camera.position);
      const direction = initialPos.clone().sub(center).normalize();
      const targetPos = center.clone().add(direction.multiplyScalar(distance));

      // Skip bounds tween entirely — directly set camera + controls state atomically.
      // Using bounds.moveTo().lookAt() is unreliable because the internal tween
      // completes AFTER our up/target corrections, overwriting them.
      camera.position.copy(targetPos);
      camera.up.set(0, 1, 0); // always enforce world Y as up
      camera.lookAt(center);   // recompute camera matrix from scratch

      if (controls) {
        controls.target.copy(center); // reset orbit pivot to scene center
        controls.update();            // recompute OrbitControls spherical from clean state
      }
    }
  }, [snap.cameraResetKey, bounds, camera, controls]);

  return null;
}
