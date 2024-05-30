import {
  InternalDevTools
} from "./chunk-F4PZPTVH.esm.mjs";
import {
  init_react_shim,
  useAtomDevtools,
  useAtomsDebugValue,
  useAtomsDevtools,
  useAtomsSnapshot,
  useGotoAtomsSnapshot
} from "./chunk-SPCL5BRI.esm.mjs";

// src/index.ts
init_react_shim();
var DevTools = process.env.NODE_ENV !== "production" ? InternalDevTools : () => null;
export {
  DevTools,
  useAtomDevtools,
  useAtomsDebugValue,
  useAtomsDevtools,
  useAtomsSnapshot,
  useGotoAtomsSnapshot
};
