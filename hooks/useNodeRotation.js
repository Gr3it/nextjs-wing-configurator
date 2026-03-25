import { useRef, useCallback, useEffect, useMemo } from "react";
import * as THREE from "three";
import { snapToStep, buildRotationMatrix } from "@/lib/rotation";
import { getNodeByPath, updateCurrentRotation } from "@/store/wingState";

const DEG_TO_RAD = Math.PI / 180;

function toRadians(degrees) {
  return degrees * DEG_TO_RAD;
}

function toDegrees(radians) {
  return radians / DEG_TO_RAD;
}

/**
 * Manages the PivotControls rotation state for a single wing node.
 *
 * Responsibilities:
 * - Computes which axes are active and their angular limits (from degrees → radians)
 * - Keeps the pivot matrix in sync when the store changes externally
 * - Handles drag events: extracts the angle, applies snap/clamp, then writes back
 *   to the store only — both wings update in sync via their own useEffect
 */
export function useNodeRotation({
  isRight,
  rotationAxis,
  currentAngle,
  limits,
  step,
  path,
}) {
  const pivotRef = useRef();
  const targetRef = useRef();
  const isDragging = useRef(false);

  // Reused across drag events to avoid per-frame allocation
  const eulerRef = useRef(new THREE.Euler());

  const activeAxes = useMemo(
    () => [rotationAxis !== "x", rotationAxis !== "y", rotationAxis !== "z"],
    [rotationAxis],
  );

  const rotationLimits = useMemo(() => {
    if (!limits) return [undefined, undefined, undefined];
    const min = toRadians(limits.min);
    const max = toRadians(limits.max);
    return [
      rotationAxis === "x" ? [min, max] : undefined,
      rotationAxis === "y" ? [min, max] : undefined,
      rotationAxis === "z" ? [min, max] : undefined,
    ];
  }, [rotationAxis, limits]);

  const buildMatrix = useCallback(
    (angle) => buildRotationMatrix(rotationAxis, angle),
    [rotationAxis],
  );

  const applyAngle = useCallback(
    (angle) => {
      const rotMatrix = buildMatrix(angle);
      if (pivotRef.current) {
        pivotRef.current.matrix.copy(rotMatrix);
        pivotRef.current.matrixWorldNeedsUpdate = true;
      }
      if (targetRef.current) {
        targetRef.current.matrix.copy(rotMatrix);
        targetRef.current.matrixWorldNeedsUpdate = true;
      }
    },
    [buildMatrix],
  );

  const currentMatrix = useMemo(
    () => buildMatrix(currentAngle),
    [buildMatrix, currentAngle],
  );

  useEffect(() => {
    if (isDragging.current) {
      // Il pivotRef è già gestito direttamente in handleDrag
      if (targetRef.current) {
        targetRef.current.matrix.copy(currentMatrix);
        targetRef.current.matrixWorldNeedsUpdate = true;
      }
      return;
    }
    applyAngle(currentAngle);
  }, [currentMatrix, currentAngle, applyAngle]);

  const onDragStart = useCallback(() => {
    isDragging.current = true;
  }, []);

  const onDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleDrag = useCallback(
    (draggedMatrix) => {
      eulerRef.current.setFromRotationMatrix(draggedMatrix, "XYZ");
      let angle = eulerRef.current[rotationAxis];

      if (step) angle = snapToStep(angle, step);
      if (limits) {
        angle = Math.max(
          toRadians(limits.min),
          Math.min(toRadians(limits.max), angle),
        );
      }

      // Feedback visivo immediato dello snap sul pivot
      if (pivotRef.current) {
        const rotMatrix = buildMatrix(angle);
        pivotRef.current.matrix.copy(rotMatrix);
        pivotRef.current.matrixWorldNeedsUpdate = true;
      }

      const node = getNodeByPath(path);
      if (node) updateCurrentRotation(node, angle);
    },
    [rotationAxis, step, limits, buildMatrix, path],
  );

  return {
    pivotRef,
    targetRef,
    activeAxes,
    rotationLimits,
    handleDrag,
    onDragStart,
    onDragEnd,
  };
}
