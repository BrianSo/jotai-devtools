import { A as AtomsSnapshot, O as Options$1 } from './types-9156c01b.js';
import { useStore, useAtom } from 'jotai/react';
import { WritableAtom, Atom } from 'jotai/vanilla';

type SnapshotOptions = Options$1 & {
    /**
     * Defaults to `false`
     *
     * Private are atoms that are used by Jotai libraries internally to manage state.
     * They're often used internally in atoms like `atomWithStorage` or `atomWithLocation`, etc. to manage state.
     */
    shouldShowPrivateAtoms?: boolean;
};
declare function useAtomsSnapshot({ shouldShowPrivateAtoms, ...options }?: SnapshotOptions): AtomsSnapshot;

declare function useGotoAtomsSnapshot(options?: Options$1): (snapshot: AtomsSnapshot) => void;

type Options = Parameters<typeof useStore>[0] & {
    enabled?: boolean;
};
declare const useAtomsDebugValue: (options?: Options) => void;

type DevtoolOptions = Parameters<typeof useAtom>[1] & {
    name?: string;
    enabled?: boolean;
};
declare function useAtomDevtools<Value, Result>(anAtom: WritableAtom<Value, [Value], Result> | Atom<Value>, options?: DevtoolOptions): void;

type DevtoolsOptions = SnapshotOptions & {
    enabled?: boolean;
};
declare function useAtomsDevtools(name: string, options?: DevtoolsOptions): void;

export { useAtomDevtools, useAtomsDebugValue, useAtomsDevtools, useAtomsSnapshot, useGotoAtomsSnapshot };
