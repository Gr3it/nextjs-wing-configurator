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
