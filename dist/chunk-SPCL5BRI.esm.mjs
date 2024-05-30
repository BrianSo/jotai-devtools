var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// react-shim.js
import React from "react";
var init_react_shim = __esm({
  "react-shim.js"() {
    "use strict";
  }
});

// src/utils/index.ts
init_react_shim();

// src/utils/useAtomsSnapshot.ts
init_react_shim();
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useStore } from "jotai/react";
var isEqualAtomsValues = (left, right) => left.size === right.size && Array.from(left).every(([left2, v]) => Object.is(right.get(left2), v));
var isEqualAtomsDependents = (left, right) => left.size === right.size && Array.from(left).every(([a, dLeft]) => {
  const dRight = right.get(a);
  return dRight && dLeft.size === dRight.size && Array.from(dLeft).every((d) => dRight.has(d));
});
function useAtomsSnapshot({
  shouldShowPrivateAtoms = false,
  ...options
} = {}) {
  const store = useStore(options);
  const [atomsSnapshot, setAtomsSnapshot] = useState(() => ({
    values: /* @__PURE__ */ new Map(),
    dependents: /* @__PURE__ */ new Map()
  }));
  const duringReactRenderPhase = useRef(true);
  duringReactRenderPhase.current = true;
  useLayoutEffect(() => {
    duringReactRenderPhase.current = false;
  });
  useEffect(() => {
    const devSubscribeStore = (
      // @ts-expect-error dev_subscribe_state is deprecated in <= 2.0.3
      store?.dev_subscribe_store || store?.dev_subscribe_state
    );
    if (!devSubscribeStore)
      return;
    let prevValues = /* @__PURE__ */ new Map();
    let prevDependents = /* @__PURE__ */ new Map();
    if (!("dev_subscribe_store" in store)) {
      console.warn(
        "[DEPRECATION-WARNING]: Your Jotai version is out-of-date and contains deprecated properties that will be removed soon. Please update to the latest version of Jotai."
      );
    }
    const callback = (type) => {
      if (typeof type !== "object") {
        console.warn(
          "[DEPRECATION-WARNING]: Your Jotai version is out-of-date and contains deprecated properties that will be removed soon. Please update to the latest version of Jotai."
        );
      }
      const values = /* @__PURE__ */ new Map();
      const dependents = /* @__PURE__ */ new Map();
      for (const atom of store.dev_get_mounted_atoms?.() || []) {
        if (!shouldShowPrivateAtoms && atom.debugPrivate) {
          continue;
        }
        const atomState = store.dev_get_atom_state?.(atom);
        if (atomState) {
          if ("v" in atomState) {
            values.set(atom, atomState.v);
          }
        }
        const mounted = store.dev_get_mounted?.(atom);
        if (mounted) {
          let atomDependents = mounted.t;
          if (!shouldShowPrivateAtoms) {
            atomDependents = new Set(
              Array.from(atomDependents.values()).filter(
                /* NOTE: This just removes private atoms from the dependents list,
                  instead of hiding them from the dependency chain and showing
                  the nested dependents of the private atoms. */
                (dependent) => !dependent.debugPrivate
              )
            );
          }
          dependents.set(atom, atomDependents);
        }
      }
      if (isEqualAtomsValues(prevValues, values) && isEqualAtomsDependents(prevDependents, dependents)) {
        return;
      }
      prevValues = values;
      prevDependents = dependents;
      const deferrableAtomSetAction = () => setAtomsSnapshot({ values, dependents });
      if (duringReactRenderPhase.current) {
        Promise.resolve().then(deferrableAtomSetAction);
      } else {
        deferrableAtomSetAction();
      }
    };
    const unsubscribe = devSubscribeStore?.(callback, 2);
    callback({});
    return unsubscribe;
  }, [store, shouldShowPrivateAtoms]);
  return atomsSnapshot;
}

// src/utils/useGotoAtomsSnapshot.ts
init_react_shim();
import { useCallback } from "react";
import { useStore as useStore2 } from "jotai/react";
function useGotoAtomsSnapshot(options) {
  const store = useStore2(options);
  return useCallback(
    (snapshot) => {
      if (store.dev_restore_atoms) {
        store.dev_restore_atoms(snapshot.values);
      }
    },
    [store]
  );
}

// src/utils/useAtomsDebugValue.ts
init_react_shim();
import {
  useDebugValue,
  useEffect as useEffect2,
  useLayoutEffect as useLayoutEffect2,
  useRef as useRef2,
  useState as useState2
} from "react";
import { useStore as useStore3 } from "jotai/react";
var atomToPrintable = (atom) => atom.debugLabel || atom.toString();
var stateToPrintable = ([store, atoms]) => Object.fromEntries(
  atoms.flatMap((atom) => {
    const mounted = store.dev_get_mounted?.(atom);
    if (!mounted) {
      return [];
    }
    const dependents = mounted.t;
    const atomState = store.dev_get_atom_state?.(atom) || {};
    return [
      [
        atomToPrintable(atom),
        {
          ..."e" in atomState && { error: atomState.e },
          ..."v" in atomState && { value: atomState.v },
          dependents: Array.from(dependents).map(atomToPrintable)
        }
      ]
    ];
  })
);
var useAtomsDebugValue = (options) => {
  const enabled = options?.enabled ?? process.env.NODE_ENV !== "production";
  const store = useStore3(options);
  const [atoms, setAtoms] = useState2([]);
  const duringReactRenderPhase = useRef2(true);
  duringReactRenderPhase.current = true;
  useLayoutEffect2(() => {
    duringReactRenderPhase.current = false;
  });
  useEffect2(() => {
    const devSubscribeStore = (
      // @ts-expect-error dev_subscribe_state is deprecated in <= 2.0.3
      store?.dev_subscribe_store || store?.dev_subscribe_state
    );
    if (!enabled || !devSubscribeStore) {
      return;
    }
    const callback = () => {
      const deferrableAtomSetAction = () => setAtoms(Array.from(store.dev_get_mounted_atoms?.() || []));
      if (duringReactRenderPhase.current) {
        Promise.resolve().then(deferrableAtomSetAction);
      } else {
        deferrableAtomSetAction();
      }
    };
    if (!("dev_subscribe_store" in store)) {
      console.warn(
        "[DEPRECATION-WARNING] Jotai version you're using contains deprecated dev-only properties that will be removed soon. Please update to the latest version of Jotai."
      );
    }
    const unsubscribe = devSubscribeStore?.(callback, 2);
    callback();
    return unsubscribe;
  }, [enabled, store]);
  useDebugValue([store, atoms], stateToPrintable);
};

// src/utils/useAtomDevtools.ts
init_react_shim();
import { useEffect as useEffect3, useRef as useRef3 } from "react";
import { useAtom } from "jotai/react";

// src/utils/redux-extension/createReduxConnection.ts
init_react_shim();
var createReduxConnection = (extension, name) => {
  if (!extension)
    return void 0;
  const connection = extension.connect({ name });
  return Object.assign(connection, {
    shouldInit: true
  });
};

// src/utils/redux-extension/getReduxExtension.ts
init_react_shim();
var getReduxExtension = (enabled = process.env.NODE_ENV !== "production") => {
  if (!enabled) {
    return void 0;
  }
  const reduxExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
  if (!reduxExtension && process.env.NODE_ENV !== "production") {
    console.warn("Please install/enable Redux devtools extension");
    return void 0;
  }
  return reduxExtension;
};

// src/utils/useAtomDevtools.ts
function useAtomDevtools(anAtom, options) {
  const { enabled, name } = options || {};
  const extension = getReduxExtension(enabled);
  const [value, setValue] = useAtom(anAtom, options);
  const lastValue = useRef3(value);
  const isTimeTraveling = useRef3(false);
  const devtools = useRef3();
  const atomName = name || anAtom.debugLabel || anAtom.toString();
  useEffect3(() => {
    if (!extension) {
      return;
    }
    const setValueIfWritable = (value2) => {
      if (typeof setValue === "function") {
        setValue(value2);
        return;
      }
      console.warn(
        "[Warn] you cannot do write operations (Time-travelling, etc) in read-only atoms\n",
        anAtom
      );
    };
    devtools.current = createReduxConnection(extension, atomName);
    const unsubscribe = devtools.current?.subscribe((message) => {
      if (message.type === "ACTION" && message.payload) {
        try {
          setValueIfWritable(JSON.parse(message.payload));
        } catch (e) {
          console.error(
            "please dispatch a serializable value that JSON.parse() support\n",
            e
          );
        }
      } else if (message.type === "DISPATCH" && message.state) {
        if (message.payload?.type === "JUMP_TO_ACTION" || message.payload?.type === "JUMP_TO_STATE") {
          isTimeTraveling.current = true;
          setValueIfWritable(JSON.parse(message.state));
        }
      } else if (message.type === "DISPATCH" && message.payload?.type === "COMMIT") {
        devtools.current?.init(lastValue.current);
      } else if (message.type === "DISPATCH" && message.payload?.type === "IMPORT_STATE") {
        const computedStates = message.payload.nextLiftedState?.computedStates || [];
        computedStates.forEach(({ state }, index) => {
          if (index === 0) {
            devtools.current?.init(state);
          } else {
            setValueIfWritable(state);
          }
        });
      }
    });
    return unsubscribe;
  }, [anAtom, extension, atomName, setValue]);
  useEffect3(() => {
    if (!devtools.current) {
      return;
    }
    lastValue.current = value;
    if (devtools.current.shouldInit) {
      devtools.current.init(value);
      devtools.current.shouldInit = false;
    } else if (isTimeTraveling.current) {
      isTimeTraveling.current = false;
    } else {
      devtools.current.send(
        `${atomName} - ${(/* @__PURE__ */ new Date()).toLocaleString()}`,
        value
      );
    }
  }, [anAtom, extension, atomName, value]);
}

// src/utils/useAtomsDevtools.ts
init_react_shim();
import { useEffect as useEffect4, useRef as useRef4 } from "react";
var atomToPrintable2 = (atom) => atom.debugLabel ? `${atom}:${atom.debugLabel}` : `${atom}`;
var getDevtoolsState = (atomsSnapshot) => {
  const values = {};
  atomsSnapshot.values.forEach((v, atom) => {
    values[atomToPrintable2(atom)] = v;
  });
  const dependents = {};
  atomsSnapshot.dependents.forEach((d, atom) => {
    dependents[atomToPrintable2(atom)] = Array.from(d).map(atomToPrintable2);
  });
  return {
    values,
    dependents
  };
};
function useAtomsDevtools(name, options) {
  const { enabled } = options || {};
  const extension = getReduxExtension(enabled);
  const atomsSnapshot = useAtomsSnapshot(options);
  const goToSnapshot = useGotoAtomsSnapshot(options);
  const isTimeTraveling = useRef4(false);
  const isRecording = useRef4(true);
  const devtools = useRef4();
  const snapshots = useRef4([]);
  useEffect4(() => {
    if (!extension) {
      return;
    }
    const getSnapshotAt = (index = snapshots.current.length - 1) => {
      const snapshot = snapshots.current[index >= 0 ? index : 0];
      if (!snapshot) {
        throw new Error("snapshot index out of bounds");
      }
      return snapshot;
    };
    devtools.current = createReduxConnection(extension, name);
    const devtoolsUnsubscribe = devtools.current?.subscribe((message) => {
      switch (message.type) {
        case "DISPATCH":
          switch (message.payload?.type) {
            case "RESET":
              break;
            case "COMMIT":
              devtools.current?.init(getDevtoolsState(getSnapshotAt()));
              snapshots.current = [];
              break;
            case "JUMP_TO_ACTION":
            case "JUMP_TO_STATE":
              isTimeTraveling.current = true;
              goToSnapshot(getSnapshotAt(message.payload.actionId - 1));
              break;
            case "PAUSE_RECORDING":
              isRecording.current = !isRecording.current;
              break;
          }
      }
    });
    return () => {
      extension?.disconnect?.();
      devtoolsUnsubscribe?.();
    };
  }, [extension, goToSnapshot, name]);
  useEffect4(() => {
    if (!devtools.current) {
      return;
    }
    if (devtools.current.shouldInit) {
      devtools.current.init(void 0);
      devtools.current.shouldInit = false;
      return;
    }
    if (isTimeTraveling.current) {
      isTimeTraveling.current = false;
    } else if (isRecording.current) {
      snapshots.current.push(atomsSnapshot);
      devtools.current.send(
        {
          type: `${snapshots.current.length}`,
          updatedAt: (/* @__PURE__ */ new Date()).toLocaleString()
        },
        getDevtoolsState(atomsSnapshot)
      );
    }
  }, [atomsSnapshot]);
}

export {
  __commonJS,
  __toESM,
  init_react_shim,
  useAtomsSnapshot,
  useGotoAtomsSnapshot,
  useAtomsDebugValue,
  useAtomDevtools,
  useAtomsDevtools
};