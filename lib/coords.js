/**
 * Converts Blender coordinates (Z-Up, Y-Forward) to Three.js coordinates (Y-Up, -Z Forward).
 *
 * Blender: [X, Y, Z]
 * Three.js: [X, Z, -Y]
 *
 * @param {Array<number>} blenderPos - [x, y, z] from Blender
 * @returns {Array<number>} [x, y, z] for Three.js
 */
export const b2t = (blenderPos) => {
  if (!blenderPos || !Array.isArray(blenderPos)) return [0, 0, 0];
  const [x, y, z] = blenderPos;
  return [x, z, -y];
};

/**
 * Converts Blender Euler rotation (Z-Up, Y-Forward) to Three.js Euler rotation (Y-Up, -Z Forward).
 * Same axis remapping as b2t: Blender [rx, ry, rz] → Three.js [rx, rz, -ry]
 *
 * @param {Array<number>} blenderRot - [rx, ry, rz] in degrees from Blender
 * @returns {Array<number>} [rx, ry, rz] in radians for Three.js
 */
export const b2tRot = (blenderRot) => {
  if (!blenderRot || !Array.isArray(blenderRot)) return [0, 0, 0];
  const DEG2RAD = Math.PI / 180;
  const [rx, ry, rz] = blenderRot;
  return [rx * DEG2RAD, rz * DEG2RAD, -ry * DEG2RAD];
};
