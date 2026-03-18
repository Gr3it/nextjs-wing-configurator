"use client";
import { useState } from "react";
import AddMenu from "./AddMenu";
import ConnectorVisual from "./ConnectorVisual";

export default function AddButton({
  position = [0, 0, 0],
  connectorType,
  parentPath,
  connectorIndex,
  active = false,
}) {
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  return (
    <group position={position}>
      <ConnectorVisual
        type="add"
        active={active}
        onClick={handleClick}
      />

      {/* Piece picker overlay */}
      {open && (
        <AddMenu
          connectorType={connectorType}
          parentPath={parentPath}
          connectorIndex={connectorIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </group>
  );
}
