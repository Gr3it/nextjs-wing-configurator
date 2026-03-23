"use client";
import { useEffect } from "react";
import { useBounds } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { state } from "@/store/wingState";
import { config } from "@/config";
import * as THREE from "three";

import { useThree } from "@react-three/fiber";

export default function CameraResetController() {
  const { camera, controls } = useThree();
  const bounds = useBounds();
  const snap = useSnapshot(state);

  useEffect(() => {
    if (snap.cameraResetKey > 0) {
      // 1. Forza il vettore UP della camera per raddrizzare l'orizzonte
      camera.up.set(0, 1, 0);
      
      // 2. Ottieni il centro attuale dei limiti degli oggetti
      bounds.refresh();
      const { center } = bounds.getSize();
      
      // 3. Torna alla posizione di reset iniziale definita in config
      const resetPos = new THREE.Vector3(...config.camera.position);
      
      // 4. Anima il movimento verso la posizione di reset guardando il centro
      bounds.moveTo(resetPos).lookAt({ 
        target: center,
        up: new THREE.Vector3(0, 1, 0)
      });

      // 5. Imposta il target di OrbitControls al centro attuale per rotazioni corrette
      if (controls) {
        controls.target.copy(center);
        controls.update();
      }
    }
  }, [snap.cameraResetKey, bounds, camera, controls]);

  return null;
}
