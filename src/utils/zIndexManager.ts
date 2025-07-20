// zIndexManager.ts
let currentZIndex = 1000;

export const getNextZIndex = () => ++currentZIndex;
