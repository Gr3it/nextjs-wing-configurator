import * as THREE from "three";

export function snapToStep(value, step) {
  if (!step) return value;
  return Math.round(value / step) * step;
}

export function buildRotationMatrix(axis, angle) {
  const euler = new THREE.Euler(
    axis === "x" ? angle : 0,
    axis === "y" ? angle : 0,
    axis === "z" ? angle : 0,
    "XYZ"
  );
  return new THREE.Matrix4().makeRotationFromEuler(euler);
}
