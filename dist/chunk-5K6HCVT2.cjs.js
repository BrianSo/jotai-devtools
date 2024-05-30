"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var __create = Object.create;
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
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var init_react_shim = __esm({
  "react-shim.js"() {
    "use strict";
  }
});

// src/utils/index.ts
init_react_shim();

// src/utils/useAtomsSnapshot.ts
init_react_shim();

var _react3 = require('jotai/react');
var isEqualAtomsValues = (left, right) => left.size === right.size && Array.from(left).every(([left2, v]) => Object.is(right.get(left2), v));
var isEqualAtomsDependents = (left, right) => left.size === right.size && Array.from(left).every(([a, dLeft]) => {
  const dRight = right.get(a);
  return dRight && dLeft.size === dRight.size && Array.from(dLeft).every((d) => dRight.has(d));
});
function useAtomsSnapshot({
  shouldShowPrivateAtoms = false,
  ...options
} = {}) {
  const store = _react3.useStore.call(void 0, options);
  const [atomsSnapshot, setAtomsSnapshot] = _react.useState.call(void 0, () => ({
    values: /* @__PURE__ */ new Map(),
    dependents: /* @__PURE__ */ new Map()
  }));
  const duringReactRenderPhase = _react.useRef.call(void 0, true);
  duringReactRenderPhase.current = true;
  _react.useLayoutEffect.call(void 0, () => {
    duringReactRenderPhase.current = false;
  });
  _react.useEffect.call(void 0, () => {
    const devSubscribeStore = (
      // @ts-expect-error dev_subscribe_state is deprecated in <= 2.0.3
      _optionalChain([store, 'optionalAccess', _ => _.dev_subscribe_store]) || _optionalChain([store, 'optionalAccess', _2 => _2.dev_subscribe_state])
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
      for (const atom of _optionalChain([store, 'access', _3 => _3.dev_get_mounted_atoms, 'optionalCall', _4 => _4()]) || []) {
        if (!shouldShowPrivateAtoms && atom.debugPrivate) {
          continue;
        }
        const atomState = _optionalChain([store, 'access', _5 => _5.dev_get_atom_state, 'optionalCall', _6 => _6(atom)]);
        if (atomState) {
          if ("v" in atomState) {
            values.set(atom, atomState.v);
          }
        }
        const mounted = _optionalChain([store, 'access', _7 => _7.dev_get_mounted, 'optionalCall', _8 => _8(atom)]);
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
    const unsubscribe = _optionalChain([devSubscribeStore, 'optionalCall', _9 => _9(callback, 2)]);
    callback({});
    return unsubscribe;
  }, [store, shouldShowPrivateAtoms]);
  return atomsSnapshot;
}

// src/utils/useGotoAtomsSnapshot.ts
init_react_shim();


function useGotoAtomsSnapshot(options) {
  const store = _react3.useStore.call(void 0, options);
  return _react.useCallback.call(void 0, 
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








var atomToPrintable = (atom) => atom.debugLabel || atom.toString();
var stateToPrintable = ([store, atoms]) => Object.fromEntries(
  atoms.flatMap((atom) => {
    const mounted = _optionalChain([store, 'access', _10 => _10.dev_get_mounted, 'optionalCall', _11 => _11(atom)]);
    if (!mounted) {
      return [];
    }
    const dependents = mounted.t;
    const atomState = _optionalChain([store, 'access', _12 => _12.dev_get_atom_state, 'optionalCall', _13 => _13(atom)]) || {};
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
  const enabled = _nullishCoalesce(_optionalChain([options, 'optionalAccess', _14 => _14.enabled]), () => ( process.env.NODE_ENV !== "production"));
  const store = _react3.useStore.call(void 0, options);
  const [atoms, setAtoms] = _react.useState.call(void 0, []);
  const duringReactRenderPhase = _react.useRef.call(void 0, true);
  duringReactRenderPhase.current = true;
  _react.useLayoutEffect.call(void 0, () => {
    duringReactRenderPhase.current = false;
  });
  _react.useEffect.call(void 0, () => {
    const devSubscribeStore = (
      // @ts-expect-error dev_subscribe_state is deprecated in <= 2.0.3
      _optionalChain([store, 'optionalAccess', _15 => _15.dev_subscribe_store]) || _optionalChain([store, 'optionalAccess', _16 => _16.dev_subscribe_state])
    );
    if (!enabled || !devSubscribeStore) {
      return;
    }
    const callback = () => {
      const deferrableAtomSetAction = () => setAtoms(Array.from(_optionalChain([store, 'access', _17 => _17.dev_get_mounted_atoms, 'optionalCall', _18 => _18()]) || []));
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
    const unsubscribe = _optionalChain([devSubscribeStore, 'optionalCall', _19 => _19(callback, 2)]);
    callback();
    return unsubscribe;
  }, [enabled, store]);
  _react.useDebugValue.call(void 0, [store, atoms], stateToPrintable);
};

// src/utils/useAtomDevtools.ts
init_react_shim();



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
  const [value, setValue] = _react3.useAtom.call(void 0, anAtom, options);
  const lastValue = _react.useRef.call(void 0, value);
  const isTimeTraveling = _react.useRef.call(void 0, false);
  const devtools = _react.useRef.call(void 0, );
  const atomName = name || anAtom.debugLabel || anAtom.toString();
  _react.useEffect.call(void 0, () => {
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
    const unsubscribe = _optionalChain([devtools, 'access', _20 => _20.current, 'optionalAccess', _21 => _21.subscribe, 'call', _22 => _22((message) => {
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
        if (_optionalChain([message, 'access', _23 => _23.payload, 'optionalAccess', _24 => _24.type]) === "JUMP_TO_ACTION" || _optionalChain([message, 'access', _25 => _25.payload, 'optionalAccess', _26 => _26.type]) === "JUMP_TO_STATE") {
          isTimeTraveling.current = true;
          setValueIfWritable(JSON.parse(message.state));
        }
      } else if (message.type === "DISPATCH" && _optionalChain([message, 'access', _27 => _27.payload, 'optionalAccess', _28 => _28.type]) === "COMMIT") {
        _optionalChain([devtools, 'access', _29 => _29.current, 'optionalAccess', _30 => _30.init, 'call', _31 => _31(lastValue.current)]);
      } else if (message.type === "DISPATCH" && _optionalChain([message, 'access', _32 => _32.payload, 'optionalAccess', _33 => _33.type]) === "IMPORT_STATE") {
        const computedStates = _optionalChain([message, 'access', _34 => _34.payload, 'access', _35 => _35.nextLiftedState, 'optionalAccess', _36 => _36.computedStates]) || [];
        computedStates.forEach(({ state }, index) => {
          if (index === 0) {
            _optionalChain([devtools, 'access', _37 => _37.current, 'optionalAccess', _38 => _38.init, 'call', _39 => _39(state)]);
          } else {
            setValueIfWritable(state);
          }
        });
      }
    })]);
    return unsubscribe;
  }, [anAtom, extension, atomName, setValue]);
  _react.useEffect.call(void 0, () => {
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
  const isTimeTraveling = _react.useRef.call(void 0, false);
  const isRecording = _react.useRef.call(void 0, true);
  const devtools = _react.useRef.call(void 0, );
  const snapshots = _react.useRef.call(void 0, []);
  _react.useEffect.call(void 0, () => {
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
    const devtoolsUnsubscribe = _optionalChain([devtools, 'access', _40 => _40.current, 'optionalAccess', _41 => _41.subscribe, 'call', _42 => _42((message) => {
      switch (message.type) {
        case "DISPATCH":
          switch (_optionalChain([message, 'access', _43 => _43.payload, 'optionalAccess', _44 => _44.type])) {
            case "RESET":
              break;
            case "COMMIT":
              _optionalChain([devtools, 'access', _45 => _45.current, 'optionalAccess', _46 => _46.init, 'call', _47 => _47(getDevtoolsState(getSnapshotAt()))]);
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
    })]);
    return () => {
      _optionalChain([extension, 'optionalAccess', _48 => _48.disconnect, 'optionalCall', _49 => _49()]);
      _optionalChain([devtoolsUnsubscribe, 'optionalCall', _50 => _50()]);
    };
  }, [extension, goToSnapshot, name]);
  _react.useEffect.call(void 0, () => {
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










exports.__commonJS = __commonJS; exports.__toESM = __toESM; exports.init_react_shim = init_react_shim; exports.useAtomsSnapshot = useAtomsSnapshot; exports.useGotoAtomsSnapshot = useGotoAtomsSnapshot; exports.useAtomsDebugValue = useAtomsDebugValue; exports.useAtomDevtools = useAtomDevtools; exports.useAtomsDevtools = useAtomsDevtools;