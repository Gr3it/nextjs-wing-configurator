"use client";

import { useState, useEffect, useRef } from "react";
import { config } from "@/config";
import piecesData from "@/data/pieces.json";

const { shadowIntensity, exposure, modelViewerVersion, width, height, environmentImage } = config.preview;
const MODEL_VIEWER_SRC = `https://ajax.googleapis.com/ajax/libs/model-viewer/${modelViewerVersion}/model-viewer.min.js`;
const MODEL_BASE = piecesData.info?.folder ?? "models/parts/";

// Filter only pieces that have a 3D model file
const PIECES = Object.entries(piecesData.pieces)
  .filter(([, p]) => !!p.file)
  .map(([key, p]) => ({ key, ...p }));

export default function PreviewPage() {
  const [selected, setSelected] = useState(PIECES[0]?.key ?? null);
  const [query, setQuery] = useState("");
  const [mvLoaded, setMvLoaded] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [bgColor, setBgColor] = useState("#18181b");
  const mvRef = useRef(null);

  // Lazy-load model-viewer script once
  useEffect(() => {
    if (document.querySelector(`script[src="${MODEL_VIEWER_SRC}"]`)) {
      setMvLoaded(true);
      return;
    }
    const s = document.createElement("script");
    s.type = "module";
    s.src = MODEL_VIEWER_SRC;
    s.onload = () => setMvLoaded(true);
    document.head.appendChild(s);
  }, []);

  // Reset model ready state when selection changes
  useEffect(() => setModelReady(false), [selected]);

  const filtered = PIECES.filter(
    (p) =>
      p.key.toLowerCase().includes(query.toLowerCase()) ||
      (p.label ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const currentPiece = PIECES.find((p) => p.key === selected);
  const modelSrc = currentPiece ? `/${MODEL_BASE}${currentPiece.file}` : null;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#09090b", color: "#fafafa", fontFamily: "var(--font-geist-sans, sans-serif)" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 280,
        display: "flex",
        flexDirection: "column",
        background: "#18181b",
        borderRight: "1px solid #27272a",
        flexShrink: 0,
      }}>
        {/* Header */}
        <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid #27272a" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#71717a", textTransform: "uppercase", marginBottom: 8 }}>
            Parts Preview
          </div>
          <input
            id="preview-search"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
            style={{
              width: "100%",
              background: "#27272a",
              border: "1px solid #3f3f46",
              borderRadius: 8,
              color: "#fafafa",
              fontSize: 13,
              padding: "6px 10px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* List */}
        <ul style={{ flex: 1, overflowY: "auto", margin: 0, padding: "8px 0", listStyle: "none" }}>
          {filtered.map((p) => (
            <li
              key={p.key}
              id={`part-${p.key}`}
              onClick={() => setSelected(p.key)}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                borderRadius: 6,
                margin: "1px 8px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: p.key === selected ? "#3f3f46" : "transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (p.key !== selected) e.currentTarget.style.background = "#27272a"; }}
              onMouseLeave={e => { if (p.key !== selected) e.currentTarget.style.background = "transparent"; }}
            >
              {/* Thumbnail from previewImg if present */}
              {p.previewImg ? (
                <img
                  src={p.previewImg}
                  alt={p.label}
                  style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 4, background: "#27272a", flexShrink: 0 }}
                />
              ) : (
                <div style={{ width: 36, height: 36, borderRadius: 4, background: "#27272a", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#52525b" }}>
                  3D
                </div>
              )}
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: p.key === selected ? "#fafafa" : "#d4d4d8" }}>{p.label}</div>
                <div style={{ fontSize: 10, color: "#71717a", marginTop: 1 }}>{p.key}</div>
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li style={{ padding: "20px 16px", color: "#52525b", fontSize: 13, textAlign: "center" }}>No results</li>
          )}
        </ul>
      </aside>

      {/* ── Main viewport ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 52,
          borderBottom: "1px solid #27272a",
          background: "#18181b",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#fafafa" }}>
              {currentPiece?.label ?? "–"}
            </span>
            <span style={{ fontSize: 11, color: "#52525b", fontFamily: "var(--font-geist-mono, monospace)" }}>
              {currentPiece?.key}
            </span>
            {currentPiece?.source && (
              <span style={{ fontSize: 11, background: "#27272a", border: "1px solid #3f3f46", borderRadius: 4, padding: "2px 7px", color: "#a1a1aa" }}>
                connector: {currentPiece.source}
              </span>
            )}
          </div>

          {/* Config pill */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#71717a" }}>
            <span>shadow: <b style={{ color: "#a1a1aa" }}>{shadowIntensity}</b></span>
            <span style={{ color: "#3f3f46" }}>|</span>
            <span>exposure: <b style={{ color: "#a1a1aa" }}>{exposure}</b></span>
            <span style={{ color: "#3f3f46" }}>|</span>
            <span>img: <b style={{ color: "#a1a1aa" }}>{width}×{height}px</b></span>
            <span style={{ color: "#3f3f46" }}>|</span>
            {/* Background picker */}
            <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
              BG
              <input
                id="preview-bg-color"
                type="color"
                value={bgColor}
                onChange={e => setBgColor(e.target.value)}
                style={{ width: 22, height: 22, border: "none", background: "none", cursor: "pointer", borderRadius: 4 }}
              />
            </label>
          </div>
        </div>

        {/* 3-D viewport */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: bgColor, position: "relative", overflow: "hidden", transition: "background 0.3s" }}>
          {!modelReady && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 12, color: "#52525b",
              zIndex: 2, pointerEvents: "none",
            }}>
              <Spinner />
              <span style={{ fontSize: 13 }}>Loading model…</span>
            </div>
          )}

          {mvLoaded && modelSrc && (
            <ModelViewer
              key={selected}
              src={modelSrc}
              shadowIntensity={shadowIntensity}
              exposure={exposure}
              environmentImage={environmentImage}
              modelReady={modelReady}
              onReady={() => setModelReady(true)}
            />
          )}
        </div>

        {/* Bottom info bar */}
        {currentPiece && (
          <div style={{
            display: "flex", alignItems: "center", gap: 20,
            padding: "0 24px", height: 40,
            borderTop: "1px solid #27272a", background: "#18181b",
            fontSize: 11, color: "#71717a", flexShrink: 0,
          }}>
            <span>Print weight: <b style={{ color: "#d4d4d8" }}>{currentPiece.printWeight ?? "–"} g</b></span>
            {currentPiece.connectors?.length > 0 && (
              <span>Connectors: <b style={{ color: "#d4d4d8" }}>{currentPiece.connectors.length}</b></span>
            )}
            {currentPiece.extra?.length > 0 && (
              <span>Extra parts: <b style={{ color: "#d4d4d8" }}>{currentPiece.extra.join(", ")}</b></span>
            )}
            {currentPiece.previewImg && (
              <span style={{ marginLeft: "auto" }}>
                Preview image: <a href={currentPiece.previewImg} target="_blank" rel="noreferrer" style={{ color: "#a3e635" }}>{currentPiece.previewImg}</a>
              </span>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function ModelViewer({ src, shadowIntensity, exposure, environmentImage, modelReady, onReady }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleLoad  = () => onReady();
    const handleError = () => onReady();
    el.addEventListener("load",  handleLoad);
    el.addEventListener("error", handleError);
    return () => {
      el.removeEventListener("load",  handleLoad);
      el.removeEventListener("error", handleError);
    };
  }, [onReady]);

  return (
    // eslint-disable-next-line react/no-unknown-property
    <model-viewer
      ref={ref}
      src={src}
      camera-controls
      auto-rotate
      shadow-intensity={String(shadowIntensity)}
      exposure={String(exposure)}
      environment-image={environmentImage}
      tone-mapping="aces"
      camera-target="auto auto auto"
      style={{
        width: "100%",
        height: "100%",
        opacity: modelReady ? 1 : 0,
        transition: "opacity 0.4s",
        "--poster-color": "transparent",
      }}
    />
  );
}

function Spinner() {
  return (
    <div style={{
      width: 32, height: 32,
      border: "3px solid #27272a",
      borderTop: "3px solid #a3e635",
      borderRadius: "50%",
      animation: "spin 0.9s linear infinite",
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
