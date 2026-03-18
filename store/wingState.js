import { proxy } from "valtio";

// --- Types (JSDoc for intellisense) ---
/**
 * @typedef {Object} WingNode
 * @property {string} piece - pieceId
 * @property {'x'|'y'|'z'} rotationAxis - asse permesso dal pezzo
 * @property {{ base: number, current: number }} rotation - angolo in radianti
 * @property {WingNode[]} children - lista ordinata di figli
 */

/**
 * @typedef {Object} ActiveState
 * @property {number[]|null} path - path del nodo attivo
 * @property {boolean} isRight - true = ala destra, false = ala sinistra
 */

// --- Node factory ---
const createNode = (pieceId) => ({
  piece: pieceId,
  rotation: {
    base: 0,
    current: 0,
  },
  children: [],
});

// --- Path utilities (operate sempre su state.rightWingRoot) ---

/**
 * Ritorna il nodo allo store (mutabile) dato un path di indici.
 * @param {number[]} path
 * @returns {WingNode|null}
 */
export const getNodeByPath = (path) => {
  let node = state.rightWingRoot;
  for (const idx of path) {
    if (!node || !node.children[idx]) return null;
    node = node.children[idx];
  }
  return node;
};

/**
 * Ritorna il nodo parent e l'indice del figlio dato un path.
 * @param {number[]} path
 * @returns {{ parent: WingNode, index: number }|null}
 */
const getParentAndIndex = (path) => {
  if (path.length === 0) return null;
  const parentPath = path.slice(0, -1);
  const index = path[path.length - 1];
  const parent = getNodeByPath(parentPath);
  if (!parent) return null;
  return { parent, index };
};

// --- State ---
export const state = proxy({
  mannequin: {
    height: 1.75,
    widthMultiplier: 1.0,
  },
  backplateHeightRatio: 0.78,
  rightWingRoot: null,
  preset: "empty",
  active: /** @type {ActiveState} */ ({
    path: null,
    isRight: true,
  }),
  presets: {
    empty: null,
  },
  basePresets: ["empty"],
  cameraResetKey: 0,
});

// Re-export for compatibility if needed, though state.presets is preferred
export const presets = state.presets;
export const basePresets = state.basePresets;

// --- Auto-generate Custom Profiles ---
let isBatching = false;
const handlePresetModification = () => {
  if (state.preset === "custom") return;

  if (!isBatching) {
    isBatching = true;

    // Solo i presets in basePresets generano una copia. Gli altri (custom o rinominati) si aggiornano sul posto.
    const isBasePreset = state.basePresets.includes(state.preset);

    if (isBasePreset) {
      let baseName = state.preset;
      let nextNum = 1;
      let newName = `${baseName}_${nextNum}`;
      while (presets[newName] !== undefined) {
        nextNum++;
        newName = `${baseName}_${nextNum}`;
      }
      // Aggiungi sincrono per UI
      presets[newName] = null;
      state.preset = newName;
    }

    // Salva alla fine del tick la struttura state finale
    setTimeout(() => {
      presets[state.preset] = JSON.parse(JSON.stringify(state.rightWingRoot));
      isBatching = false;
    }, 0);
  }
};

// --- Active ---
/**
 * Imposta il nodo attivo con path e lato.
 * @param {number[]|null} path
 * @param {boolean} isRight
 */
export const setActive = (path, isRight = true) => {
  state.active.path = path;
  state.active.isRight = isRight;
};

/**
 * Resetta il nodo attivo.
 */
export const clearActive = () => {
  state.active.path = null;
  state.active.isRight = true;
};

// --- Add ---
/**
 * Aggiunge root:  addPiece([], "A1_arm_large")
 * Aggiunge figlio: addPiece([0, 1], "A1_arm_large")
 *   → viene appeso come ultimo figlio del nodo al path [0, 1]
 */
export const addPiece = (path, pieceId) => {
  const newNode = createNode(pieceId);

  if (path.length === 0) {
    // Sostituisce la radice
    state.rightWingRoot = newNode;
    handlePresetModification();
    return;
  }

  // L'ultimo elemento del path è l'indice del connettore nel parent
  const index = path[path.length - 1];
  const parentPath = path.slice(0, -1);
  const parent =
    parentPath.length === 0
      ? state.rightWingRoot // parent è la radice
      : getNodeByPath(parentPath); // parent è un nodo intermedio

  if (!parent) {
    console.warn("addPiece: parent not found at parentPath", parentPath);
    return;
  }

  // Inserisce all'indice esatto del connettore per mantenere l'ordine
  parent.children[index] = newNode;
  handlePresetModification();
};

// --- Remove ---
/**
 * Rimuove root:  removePiece([])
 * Rimuove nodo: removePiece([0, 1, 2])
 *   → rimuove il nodo (e il suo intero subtree) dal parent
 */
export const removePiece = (path) => {
  if (path.length === 0) {
    state.rightWingRoot = null;
  } else {
    const result = getParentAndIndex(path);
    if (!result) {
      console.warn("removePiece: invalid path", path);
      return;
    }
    const { parent, index } = result;
    // Invece di splice, mettiamo undefined per non scalare gli indici dei fratelli
    // (altrimenti i figli successivi si sposterebbero su connettori sbagliati)
    parent.children[index] = undefined;
  }

  // Resetta active se il nodo rimosso era quello attivo
  if (state.active.path?.join() === path.join()) {
    state.active.path = null;
  }

  handlePresetModification();
};

// --- Rotation ---
/**
 * Aggiorna la current rotation del nodo allo store (non snapshot!).
 * @param {WingNode} storeNode - riferimento diretto allo store
 * @param {number} value - angolo in radianti
 */
export const updateCurrentRotation = (storeNode, value) => {
  storeNode.rotation.current = value;
  handlePresetModification();
};

/**
 * Aggiorna la base rotation del nodo allo store.
 */
export const updateBaseRotation = (storeNode, value) => {
  storeNode.rotation.base = value;
  handlePresetModification();
};

/**
 * Resetta current → base.
 */
export const resetToBase = (storeNode) => {
  storeNode.rotation.current = storeNode.rotation.base;
  handlePresetModification();
};

/**
 * Salva current come nuova base.
 */
export const saveCurrentAsBase = (storeNode) => {
  storeNode.rotation.base = storeNode.rotation.current;
  handlePresetModification();
};

/**
 * Resetta current → base per l'intero albero.
 */
export const resetAllToBase = () => {
  const traverse = (node) => {
    if (!node) return;
    resetToBase(node);
    node.children.forEach(traverse);
  };
  traverse(state.rightWingRoot);
};

/**
 * Salva current come nuova base per l'intero albero.
 */
export const saveAllCurrentAsBase = () => {
  const traverse = (node) => {
    if (!node) return;
    saveCurrentAsBase(node);
    node.children.forEach(traverse);
  };
  traverse(state.rightWingRoot);
};

// --- Presets ---
export const setPreset = (name, config) => {
  state.rightWingRoot = JSON.parse(JSON.stringify(config));
  state.preset = name;
  state.active.path = null;
};

// --- Camera ---
export const triggerCameraReset = () => {
  state.cameraResetKey += 1;
};

// --- Init ---
state.rightWingRoot = JSON.parse(JSON.stringify(presets["empty"]));
