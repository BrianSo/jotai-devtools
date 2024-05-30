import { S as Store } from './types-9156c01b.js';
import 'jotai/react';
import 'jotai/vanilla';

type DevToolsOptions = {
    /**
     * Defaults to `false`
     *
     * Private are atoms that are used by Jotai libraries internally to manage state.
     * They're often used internally in atoms like `atomWithStorage` or `atomWithLocation`, etc. to manage state.
     */
    shouldShowPrivateAtoms?: boolean;
    /**
     * Defaults to `false`
     *
     * Expands the JSON tree view fully on Atom Viewer, Timeline, etc.
     */
    shouldExpandJsonTreeViewInitially?: boolean;
    /**
     * Defaults to 750ms
     *
     * The interval (in milliseconds) between each step of the time travel playback.
     */
    timeTravelPlaybackInterval?: number;
    /**
     * Defaults to Infinity
     *
     * The maximum number of snapshots to keep in the history.
     * The higher the number the more memory it will consume.
     *
     * We recommend setting it to around ~30
     */
    snapshotHistoryLimit?: number;
};

type ExtensionProps = {
    store?: Store | undefined;
    isInitialOpen?: boolean;
};

type DevToolsProps = ExtensionProps & {
    theme?: 'dark' | 'light';
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    nonce?: string;
    options?: DevToolsOptions;
};
declare const InternalDevTools: (props: DevToolsProps) => JSX.Element | null;

export { DevToolsProps, InternalDevTools };