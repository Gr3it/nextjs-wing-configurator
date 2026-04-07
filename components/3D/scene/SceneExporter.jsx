"use client";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { toast } from "react-toastify";

export default function SceneExporter() {
  const { scene } = useThree();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if "E" or "e" is pressed
      if (event.key === "e" || event.key === "E") {
        // Prevent action if user is typing in an input or textarea
        if (
          event.target.tagName === "INPUT" ||
          event.target.tagName === "TEXTAREA"
        ) {
          return;
        }

        exportScene();
      }
    };

    const exportScene = () => {
      const exporter = new GLTFExporter();
      const options = {
        binary: true, // Export as .glb
        animations: [],
        includeCustomExtensions: true,
      };

      toast.info("Exporting scene... Please wait.");

      exporter.parse(
        scene,
        (result) => {
          if (result instanceof ArrayBuffer) {
            saveArrayBuffer(result, "icarus-scene.glb");
          } else {
            const output = JSON.stringify(result, null, 2);
            saveString(output, "icarus-scene.gltf");
          }
          toast.success("Scene exported successfully!");
        },
        (error) => {
          console.error("An error happened during GLTF export:", error);
          toast.error("Export failed. Check console for details.");
        },
        options
      );
    };

    const saveString = (text, filename) => {
      save(new Blob([text], { type: "text/plain" }), filename);
    };

    const saveArrayBuffer = (buffer, filename) => {
      save(new Blob([buffer], { type: "application/octet-stream" }), filename);
    };

    const save = (blob, filename) => {
      const link = document.createElement("a");
      link.style.display = "none";
      document.body.appendChild(link);
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      document.body.removeChild(link);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scene]);

  return null;
}
