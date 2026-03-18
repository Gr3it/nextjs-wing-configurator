import { useMemo } from "react";
import * as THREE from "three";
import { config } from "@/config";

export function useHighlightedScene(scene, isActive, isHovered) {
  return useMemo(() => {
    const s = scene.clone();
    const shouldHighlight = isActive || isHovered;

    if (shouldHighlight) {
      const settings = isActive ? config.wings.active : config.wings.hover;

      s.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          child.material.color.set(settings.color);
          child.material.emissive = new THREE.Color(settings.emissive);
          child.material.emissiveIntensity = settings.emissiveIntensity;
        }
      });
    }
    return s;
  }, [scene, isActive, isHovered]);
}
