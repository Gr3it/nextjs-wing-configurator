"use client";
import React from "react";
import { useGLTF } from "@react-three/drei";
import piecesData from "@/data/pieces.json";
import { useHighlightedScene } from "../../../hooks/useHighlightedScene";

export default function ExtraPiece({ pieceKey, active }) {
  const pieceInfo = piecesData.pieces[pieceKey];
  if (!pieceInfo) return null;

  const { scene } = useGLTF(`/${piecesData.info.folder}${pieceInfo.file}`);
  const clonedScene = useHighlightedScene(scene, active);

  return <primitive object={clonedScene} castShadow receiveShadow />;
}
