"use client";
import { useJoyride, STATUS } from "react-joyride";
import { useSnapshot } from "valtio";
import { state } from "@/store/wingState";

export default function Tutorial() {
  const snap = useSnapshot(state);

  const { Tour } = useJoyride({
    run: snap.showTutorial,
    continuous: true,
    options: {
      spotlightRadius: 8,
      buttons: ["close", "primary", "skip", "back"],
    },
    styles: {
      arrow: {
        color: "#1a1a1a",
      },
      tooltip: {
        borderRadius: "16px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
        padding: "24px",
        backgroundColor: "#1a1a1a",
      },
      tooltipTitle: {
        fontFamily: "monospace",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        color: "#fff",
        fontWeight: "bold",
        marginBottom: "6px",
      },
      tooltipContent: {
        fontFamily: "monospace",
        fontSize: "12px",
        lineHeight: "1.6",
        color: "#ccc",
      },
      buttonPrimary: {
        backgroundColor: "#242424",
        border: "1px solid #383838",
        color: "#fff",
        borderRadius: "8px",
        fontFamily: "monospace",
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        fontSize: "12px",
        padding: "10px 18px",
        transition: "all 0.2s ease",
      },
      buttonBack: {
        color: "#fff",
        fontFamily: "monospace",
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        fontSize: "12px",
        marginRight: "12px",
      },
      buttonSkip: {
        color: "#fff",
        fontFamily: "monospace",
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        fontSize: "12px",
      },
      buttonClose: {
        color: "#fff",
        margin: "6px",
      },
      beaconInner: {
        backgroundColor: "#fff",
      },
      beaconOuter: {
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        borderColor: "#fff",
      },
    },
    steps: [
      {
        target: "#three-canvas-container",
        title: "Chapter 1/5: 3D Editor Guide",
        content: (
          <div className="space-y-4 text-sm text-left">
            <div className="space-y-2">
              <p className="text-white">
                <b>Selection & Navigation:</b>
              </p>
              <ul className="list-disc list-inside text-xs text-[#aaa] space-y-1 pl-1">
                <li>
                  <b>Select:</b> Click on a 3D part
                </li>
                <li>
                  <b>Deselect:</b> Click the same part again or press <b>Esc</b>
                </li>
                <li>
                  <b>Camera:</b> Left Click (Rotate), Right Click (Pan), Scroll
                  (Zoom)
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[#333] space-y-2">
              <p className="text-white">
                <b>Modification:</b>
              </p>
              <ul className="list-disc list-inside text-xs text-[#aaa] space-y-1 pl-1">
                <li>
                  <b>Rotate:</b> Use the blue gizmo axes
                </li>
                <li>
                  <b>Delete:</b> Click the minus (-) icon
                </li>
                <li>
                  <b>Add:</b> Click the plus (+) connectors
                </li>
              </ul>
            </div>
          </div>
        ),
        placement: "center",
        styles: {
          tooltip: {
            width: 500,
          },
        },
      },
      {
        target: "#mannequin-controls",
        title: "Chapter 2/5: Configuration",
        content: (
          <div className="space-y-2 text-sm text-left">
            <p>Use the sliders to match your own body measurements.</p>
            <p>
              This provides an <b>accurate</b> sense of the wing dimensions
              relative to your frame.
            </p>
          </div>
        ),
        placement: "right",
      },
      {
        target: "#presets-section",
        title: "Chapter 3/5: Profiles & Presets",
        content: (
          <div className="space-y-2 text-sm text-left">
            <p>
              Use the dropdown to find <b>Base Presets</b> or manage your custom
              profiles.
            </p>
            <p>
              You can also <b>Import/Export</b> your profile configurations here
              to save local copies.
            </p>
            <p className="text-amber-500 uppercase font-bold">
              Note: these files save site presets only, not 3D models.
            </p>
          </div>
        ),
        placement: "right",
      },
      {
        target: "#pose-actions",
        title: "Chapter 4/5: Poses",
        content: (
          <div className="space-y-2 text-sm text-left">
            <p className="text-white">Manage the base poses:</p>
            <ul className="list-disc list-inside text-xs text-[#aaa] space-y-1">
              <li>
                <b>Set Base:</b> Saves current pose as the new base
              </li>
              <li>
                <b>Reset Pose:</b> Replaces current pose with base values
              </li>
            </ul>
          </div>
        ),
        placement: "right",
      },
      {
        target: "#pieces-list-button",
        title: "Chapter 5/5: Build Summary",
        content: (
          <div className="space-y-2 text-sm text-left">
            <p>
              Review the comprehensive <b>Pieces List</b> for your build.
            </p>
            <p>
              See exactly what you need to print: the full list of components,
              estimated filament weights, and direct <b>MakerWorld</b> links to
              start your project.
            </p>
          </div>
        ),
        placement: "right",
      },
    ],
    onEvent: (data) => {
      const { status } = data;
      if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
        state.showTutorial = false;
        localStorage.setItem("hasSeenTutorial", "true");
      }
    },
  });

  return Tour;
}
