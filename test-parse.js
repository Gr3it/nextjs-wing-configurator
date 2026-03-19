const fs = require("fs");
const path = require("path");

const CONFIG_PATH = "c:\\Users\\emanu\\wing-configurator\\config.js";
const configSource = fs.readFileSync(CONFIG_PATH, "utf-8");

const previewBlockMatch = configSource.match(/preview\s*:\s*\{([\s\S]+?)\n\s{2}\},/);

if (previewBlockMatch) {
  const block = previewBlockMatch[1];
  console.log("Block found length:", block.length);

  const parseField = (name, isNum) => {
    const m = block.match(new RegExp(`["']?${name}["']?\\s*:\\s*([^,\\n]+)`));
    if (!m) return undefined;
    const raw = m[1].trim().replace(/['"]/g, "").trim();
    return isNum ? Number(raw) : raw;
  };

  let previewConfig = {
    cameraOrbit: { theta: 0, phi: 90, radius: 100 },
  };

  const cameraOrbitMatch = block.match(/cameraOrbit\s*:\s*\{([^}]+)\}/s);
  if (cameraOrbitMatch) {
    const coBlock = cameraOrbitMatch[1];
    const parseSubField = (name) => {
      const m = coBlock.match(new RegExp(`${name}\\s*:\\s*([^,\\n]+)`));
      return m ? Number(m[1].trim()) : undefined;
    };
    previewConfig.cameraOrbit = {
      theta: parseSubField("theta") ?? previewConfig.cameraOrbit.theta,
      phi: parseSubField("phi") ?? previewConfig.cameraOrbit.phi,
      radius: parseSubField("radius") ?? previewConfig.cameraOrbit.radius,
    };
  }

  previewConfig = {
    ...previewConfig,
    width: parseField("width", true),
    height: parseField("height", true),
    exposure: parseField("exposure", true),
    lightRotation: parseField("lightRotation", true),
    fieldOfView: parseField("fieldOfView", true),
  };
  
  console.log("Parsed Config:", JSON.stringify(previewConfig, null, 2));
} else {
  console.log("No preview block found!");
}
