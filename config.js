export const config = {
  connectors: {
    add: {
      color: "#27272a",
      hoverColor: "#3f3f46",
    },
    delete: {
      color: "#dc2626",
      hoverColor: "#ef4444",
    },
    size: 0.0125,
  },
  wings: {
    active: {
      color: "#a3e635",
      emissive: "#4ade80",
      emissiveIntensity: 0.2,
    },
    hover: {
      color: "#bef264",
      emissive: "#86efac",
      emissiveIntensity: 0.15,
    },
  },
  camera: {
    position: [0, 2, 5],
    fov: 45,
  },
  preview: {
    /** Output image dimensions */
    width: 512,
    height: 384,
    /** model-viewer tone-mapped exposure — keep low to avoid blown whites */
    exposure: 0.4,
    /** model-viewer version loaded from Google CDN */
    modelViewerVersion: "3.4.0",
    /** Extra delay (ms) after model loads before screenshot, to let auto-frame settle */
    settleDelay: 10,
    /** Output folder relative to /public */
    outputFolder: "images/parts",
    /** Initial camera orbit: theta (deg), phi (deg), radius (%) */
    cameraOrbit: {
      theta: 0,
      phi: 105,
      radius: 75,
    },
    /** Initial field of view (deg) */
    fieldOfView: 10,
  },
};
