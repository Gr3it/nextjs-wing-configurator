import { useMemo, useLayoutEffect } from "react";
import * as THREE from "three";
import { config } from "@/config";

export function useHighlightedScene(scene, isActive, isHovered) {
  // Ritorna sempre la stessa istanza della scena clonata finché il modello originale non cambia.
  // Questo previene cicli di unmount/remount della <primitive /> e il conseguente flashing.
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useLayoutEffect(() => {
    const shouldHighlight = isActive || isHovered;

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        // Al primo passaggio, cloniamo il materiale così è unico per questa istanza
        // e salviamo le proprietà originali per il ripristino.
        if (!child.userData.isCustomized) {
          child.material = child.material.clone();
          child.userData.originalColor = child.material.color.clone();
          child.userData.originalEmissive = child.material.emissive.clone();
          child.userData.originalEmissiveIntensity =
            child.material.emissiveIntensity;
          child.userData.isCustomized = true;
        }

        if (shouldHighlight) {
          const settings = isActive ? config.wings.active : config.wings.hover;
          child.material.color.set(settings.color);
          child.material.emissive.set(settings.emissive);
          child.material.emissiveIntensity = settings.emissiveIntensity;
        } else {
          // Ripristina materiali originali
          child.material.color.copy(child.userData.originalColor);
          child.material.emissive.copy(child.userData.originalEmissive);
          child.material.emissiveIntensity =
            child.userData.originalEmissiveIntensity;
        }
      }
    });
  }, [clonedScene, isActive, isHovered]);

  return clonedScene;
}
