import { useMemo, useLayoutEffect } from "react";
import { config } from "@/config";

/**
 * Returns a stable clone of `scene` with its materials updated to reflect
 * the current hover / active highlight state.
 *
 * The clone is created once per `scene` reference. Original material
 * properties are stored in userData so they can be restored when neither
 * state is active.
 */
export function useHighlightedScene(scene, isActive, isHovered) {
  const clonedScene = useMemo(() => {
    const clone = scene.clone();

    clone.traverse((child) => {
      if (!child.isMesh) return;

      // Each instance needs its own material copy so highlights don't bleed
      // across shared geometry.
      child.material = child.material.clone();

      // Store originals for clean restore later.
      child.userData.originalColor = child.material.color.clone();
      child.userData.originalEmissive = child.material.emissive.clone();
      child.userData.originalEmissiveIntensity =
        child.material.emissiveIntensity;
    });

    return clone;
  }, [scene]);

  useLayoutEffect(() => {
    // Active takes priority over hovered.
    const highlightSettings = isActive
      ? config.wings.active
      : isHovered
        ? config.wings.hover
        : null;

    clonedScene.traverse((child) => {
      if (!child.isMesh) return;

      if (highlightSettings) {
        child.material.color.set(highlightSettings.color);
        child.material.emissive.set(highlightSettings.emissive);
        child.material.emissiveIntensity = highlightSettings.emissiveIntensity;
      } else {
        child.material.color.copy(child.userData.originalColor);
        child.material.emissive.copy(child.userData.originalEmissive);
        child.material.emissiveIntensity =
          child.userData.originalEmissiveIntensity;
      }
    });
  }, [clonedScene, isActive, isHovered]);

  return clonedScene;
}
