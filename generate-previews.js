const fs = require("fs");
const path = require("path");
const http = require("http");
const puppeteer = require("puppeteer");

// ---------------------------------------------------------------------------
// Load preview config from config.js (ESM) by evaluating only its content
// ---------------------------------------------------------------------------
function loadConfig() {
  const configPath = path.join(__dirname, "config.js");
  const source = fs.readFileSync(configPath, "utf-8");

  // Strip ESM export so we can eval the object in a CJS context
  const stripped = source
    .replace(/export\s+const\s+\w+\s*=\s*/, "const _cfg = ")
    .replace(/export\s+default\s+/, "const _cfg = ");

  const fn = new Function(`${stripped}; return _cfg;`);
  const cfg = fn();
  return cfg.preview;
}

const DATA_JSON = path.join(__dirname, "data", "pieces.json");
const PUBLIC_DIR = path.join(__dirname, "public");

// Minimal static file server to expose GLB files to Puppeteer
const server = http.createServer((req, res) => {
  const filePath = path.join(PUBLIC_DIR, decodeURIComponent(req.url));
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    const mime =
      ext === ".glb" ? "model/gltf-binary" : "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": mime,
      "Access-Control-Allow-Origin": "*",
    });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end();
  }
});

async function main() {
  const preview = loadConfig();
  console.log("Preview config:", preview);

  const IMAGES_DIR = path.join(PUBLIC_DIR, preview.outputFolder);
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  server.listen(0, async () => {
    const port = server.address().port;
    const piecesData = JSON.parse(fs.readFileSync(DATA_JSON, "utf-8"));
    const folder = piecesData.info?.folder || "models/parts/";

    const {
      width,
      height,
      exposure,
      modelViewerVersion,
      settleDelay,
      cameraOrbit,
      fieldOfView,
    } = preview;

    console.log("Starting headless browser...");
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width, height },
      args: ["--window-position=-32000,-32000", "--no-sandbox"],
    });
    const page = await browser.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") console.log("PAGE ERROR:", msg.text());
    });
    await page.setViewport({ width, height });

    let updated = false;
    const entries = Object.entries(piecesData.pieces);

    for (const [key, piece] of entries) {
      if (!piece.file) continue;

      const glbUrl = `http://localhost:${port}/${folder}${piece.file}`;
      console.log(`Processing: ${key}`);

      const html = `<!DOCTYPE html>
<html>
  <head>
    <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/${modelViewerVersion}/model-viewer.min.js"></script>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { width: ${width}px; height: ${height}px; overflow: hidden; background: transparent; }
      model-viewer {
        width: ${width}px;
        height: ${height}px;
        --poster-color: transparent;
      }
    </style>
  </head>
  <body>
    <model-viewer
      id="mv"
      src="${glbUrl}"
      exposure="${exposure}"
      camera-orbit="${cameraOrbit.theta}deg ${cameraOrbit.phi}deg ${cameraOrbit.radius}%"
      field-of-view="${fieldOfView}deg"
    ></model-viewer>
    <script>
      const mv = document.getElementById('mv');
      mv.addEventListener('load', () => {
        mv.jumpCameraToGoal();
        window.modelLoaded = true;
      });
      mv.addEventListener('error', () => { window.modelError = true; });
    </script>
  </body>
</html>`;

      await page.setContent(html);

      try {
        await page.waitForFunction("window.modelLoaded || window.modelError", {
          timeout: 30000,
        });

        if (await page.evaluate(() => window.modelError)) {
          console.error(`  ✗ Failed to load model for ${key}`);
          continue;
        }

        await new Promise((r) => setTimeout(r, settleDelay));

        const imgFilename = `${key}.png`;
        const imgPath = path.join(IMAGES_DIR, imgFilename);
        await page.screenshot({ path: imgPath, omitBackground: true });

        const relPath = `/${preview.outputFolder}/${imgFilename}`;
        if (piece.previewImg !== relPath) {
          piece.previewImg = relPath;
          updated = true;
        }
        console.log(`  ✓ ${relPath}`);
      } catch (err) {
        console.error(`  ✗ Error processing ${key}:`, err.message);
      }
    }

    await browser.close();
    server.close();

    if (updated) {
      fs.writeFileSync(DATA_JSON, JSON.stringify(piecesData, null, 2), "utf-8");
      console.log("\npieces.json updated successfully!");
    } else {
      console.log("\nNo updates needed for pieces.json");
    }
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
