# Jotai DevTools

## Prerequisites

- Jotai version `>=1.11.0`
- React version `>=17.0.0`

## Setup

```sh
# npm
npm install jotai-devtools --save

# yarn
yarn add jotai-devtools
```

## UI DevTool

### Provider-less

```tsx
import { createStore } from 'jotai';
import { DevTools } from 'jotai-devtools';

const App = () => {
  return (
    <>
      <DevTools />
      {/* your app */}
    </>
  );
};
```

### With Provider

```tsx
import { createStore } from 'jotai';
import { DevTools } from 'jotai-devtools';

const customStore = createStore();

const App = () => {
  return (
    <Provider store={customStore}>
      <DevTools store={customStore} />
      {/* your app */}
    </Provider>
  );
};
```

### Available props

```ts
type DevToolsProps = {
  // defaults to false
  isInitialOpen?: boolean;
  // pass a custom store
  store?: Store;
  // Defaults to light
  theme?: 'dark' | 'light';
  options?: {
    // Parsing strategy for AtomViewer. Defaults to `raw`
    // `raw` - parses the top level atom value but does not parse the values of atoms within atoms
    // `deep-nested` - Parses values of atoms within atoms. Linear performance curve. Bigger the object, the slower the performance
    atomValueParser?: 'raw' | 'deep-nested';
  };
};
```

## Hooks

Detailed documentation is available on
[https://jotai.org/docs/api/devtools](https://jotai.org/docs/api/devtools)

```tsx
import {
  useAtomsSnapshot,
  useGotoAtomsSnapshot,
  useAtomsDebugValue,
  // Redux devtool hooks
  useAtomDevtools,
  useAtomsDevtools,
} from 'jotai-devtools';
```

## Migration guides

### Migrate Jotai to V2

Find the official migration guide on
[jotai.org](https://jotai.org/docs/guides/migrating-to-v2-api)

### Migrate `jotai/react/devtools` to `jotai-devtools`

1. Install this package

   ```sh
   # npm
   npm install jotai-devtools --save

   # yarn
   yarn add jotai-devtools
   ```

2. Update imports from `jotai/react/devtools` to `jotai-devtools`
   ```diff
   import {
    useAtomsSnapshot,
    useGotoAtomsSnapshot,
    useAtomsDebugValue,
    // Redux devtool integration hooks
    useAtomDevtools,
    useAtomsDevtools,
   - } from 'jotai/react/devtools';
   + } from 'jotai-devtools';
   ```

### Other announcements

✨ [First announcement](https://twitter.com/dai_shi/status/1611717249471246338)
