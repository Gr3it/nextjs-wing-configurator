import { useRef, useCallback, useEffect, useMemo } from "react";
import * as THREE from "three";
import { snapToStep, buildRotationMatrix } from "@/lib/rotation";
import { getNodeByPath, updateCurrentRotation } from "@/store/wingState";

export function useNodeRotation({
  isRight,
  rotationAxis,
  currentAngle,
  limits,
  step,
  path,
}) {
  const pivotRef = useRef();

  // Define active axes based on rotation axis
  const activeAxes = useMemo(
    () => [
      rotationAxis !== "x",
      rotationAxis !== "y",
      rotationAxis !== "z",
    ],
    [rotationAxis]
  );

  // Convert limits to radians when defined
  const rotationLimits = useMemo(() => {
    if (!limits) return [undefined, undefined, undefined];
    const radiansMin = limits.min * (Math.PI / 180);
    const radiansMax = limits.max * (Math.PI / 180);
    return [
      rotationAxis === "x" ? [radiansMin, radiansMax] : undefined,
      rotationAxis === "y" ? [radiansMin, radiansMax] : undefined,
      rotationAxis === "z" ? [radiansMin, radiansMax] : undefined,
    ];
  }, [rotationAxis, limits]);

  // Helper to construct the local matrix reflecting L/R sides properly
  const getMatrix = useCallback(
    (angle) => {
      const rotMatrix = buildRotationMatrix(rotationAxis, angle);
      if (isRight) return rotMatrix;
      return new THREE.Matrix4().makeScale(-1, 1, 1).multiply(rotMatrix);
    },
    [isRight, rotationAxis]
  );

  // Matrix representing the current state from store
  const matrix = useMemo(
    () => getMatrix(currentAngle),
    [getMatrix, currentAngle]
  );

  // Sync pivot matrix if state changes externally
  useEffect(() => {
    if (!pivotRef.current) return;
    pivotRef.current.matrix.copy(matrix);
    pivotRef.current.matrixWorldNeedsUpdate = true;
  }, [matrix]);

  // Handle interaction with pivot controls
  const handleDrag = useCallback(
    (draggedMatrix) => {
      // Invert matrix for the left wing so we get a uniform Euler angle extraction
      const m = isRight
        ? draggedMatrix
        : new THREE.Matrix4().makeScale(-1, 1, 1).multiply(draggedMatrix);

      const euler = new THREE.Euler().setFromRotationMatrix(m, "XYZ");
      let angle = euler[rotationAxis];

      // Fix inverted rotation direction for left wing
      if (!isRight) angle = -angle;

      // Snapping
      if (step) angle = snapToStep(angle, step);

      // Rotation bounds
      if (limits) {
        const radiansMin = limits.min * (Math.PI / 180);
        const radiansMax = limits.max * (Math.PI / 180);
        angle = Math.max(radiansMin, Math.min(radiansMax, angle));
      }

      // Live update pivot handle matrix visually
      if (pivotRef.current) {
        const snappedMatrix = getMatrix(angle);
        pivotRef.current.matrix.copy(snappedMatrix);
        pivotRef.current.matrixWorldNeedsUpdate = true;
      }

      // Propagate state to store
      const storeNode = getNodeByPath(path);
      if (storeNode) updateCurrentRotation(storeNode, angle);
    },
    [isRight, rotationAxis, step, limits, getMatrix, path]
  );

  return {
    pivotRef,
    activeAxes,
    rotationLimits,
    handleDrag,
    matrix,
  };
}
