# Habitra Animated Habit Tracker

Habitra is a local-first habit tracking mobile app prototype built with Expo + TypeScript. It focuses on polished micro-interactions (pulse and lottie feedback), clean theming, and a composable `src/*` architecture that can scale from a demo to a production-ready tracker.

## Project Overview

### Goals

- **UI polish first**: Build a clean, modern baseline UI with reusable primitives (`Button`, `Card`, `Text`) and consistent spacing/radius/typography tokens.
- **Animation-driven feedback**: Celebrate progress through lightweight, meaningful motion (orb pulse, success animation, haptic cue).
- **Local-first iteration**: Keep user interaction fast and deterministic by storing habit progress in client state (Zustand) without requiring backend setup.
- **Scalable organization**: Separate app routes, feature components, state, theme tokens, utilities, and types so new habit features can be added with minimal refactors.

## Tech Stack Summary

- **Framework/runtime**: Expo + React Native + TypeScript
- **Routing**: Expo Router (`src/app`) with file-based routes
- **Animations**: React Native Reanimated + Lottie (`lottie-react-native`) + SVG (`react-native-svg`)
- **Styling**: NativeWind (Tailwind utility classes for RN)
- **State management**: Zustand (lightweight global store)
- **UX helpers**: `expo-haptics`, `expo-blur`, `react-native-gesture-handler`
- **Developer ergonomics**:
  - Path aliases (`@/*` -> `src/*`) via TypeScript + Babel module resolver
  - Strict TypeScript checks via `npm run typecheck`

## Prerequisites

Install these before running the app:

- Node.js 18+
- npm 9+
- Expo-compatible simulator/emulator setup:
  - iOS Simulator (macOS + Xcode)
  - Android Emulator (Android Studio)
  - OR Expo Go on a physical device

## Install and Run

```bash
npm install
npm run start
```

Common platform targets:

```bash
npm run android
npm run ios
npm run web
```

Type checking:

```bash
npm run typecheck
```

## Folder Architecture (`src/*`)

```text
src/
  app/                 # Expo Router route entrypoints and layouts
  assets/              # Local static assets (e.g., Lottie JSON)
  components/
    animations/        # Reanimated/SVG motion components
    habit/             # Habit-domain composite components
    ui/                # Reusable presentational primitives
  constants/           # App/domain constants
  hooks/               # Feature hooks that coordinate side effects
  store/               # Zustand stores (state + actions)
  theme/               # Design tokens and ThemeProvider
  types/               # Shared TS domain contracts
  utils/               # Small pure helpers and platform wrappers
```

### How responsibilities are split

- `app/` should stay thin: compose screens from feature and UI components.
- `components/ui` should remain domain-agnostic and token-driven.
- `components/habit` should express habit-specific UI composition.
- `hooks/` should orchestrate action flows (e.g., mutate store + trigger haptics).
- `store/` should only expose state and state transition functions.
- `theme/` is the source of truth for spacing, radius, shadows, typography, and semantic colors.

## Theming Strategy

Habitra uses a token-first theme model:

- `ThemeProvider` detects OS light/dark scheme and exposes a token bundle via `useThemeTokens`.
- Semantic color classes (`backgroundClass`, `textPrimaryClass`, etc.) are defined per scheme and consumed by components.
- Non-color tokens (`spacing`, `radius`, `typography`, `shadows`) are centralized and reused across primitives.
- Components should consume tokens from the theme hook rather than hardcoding visual values.

### Theme conventions

- Prefer semantic token names over raw utility classes in app/feature components.
- Keep theme additions centralized under `src/theme/*`.
- If introducing new color usage, map it into semantic colors for both light and dark modes.

## Animation Conventions

- Use **Reanimated** for continuous/interactive motion (e.g., pulse loops, transforms).
- Use **Lottie** for decorative celebratory moments with minimal logic.
- Keep animation components isolated in `components/animations` when reusable.
- Keep durations/easing intentional and subtle; avoid overly aggressive movement for core interactions.
- Pair key success interactions with haptic feedback where appropriate.

## Development Guidelines

### 1) Component patterns

- Use small composable primitives in `components/ui`, then build feature-level components in `components/<feature>`.
- Keep route files in `app/` focused on composition and data wiring, not implementation-heavy UI logic.
- Prefer explicit prop types (`type Props = { ... }`) for each component.
- Keep utilities pure (`utils/`) and reusable.

### 2) State management boundaries

- Put cross-screen or session-relevant state in Zustand stores (`store/`).
- Keep transient UI-only state local to a component.
- Move multi-step state + side-effect orchestration into hooks (`hooks/`) rather than screens.
- Avoid placing side effects directly inside store definitions unless truly state-layer concerns.

### 3) Naming and file-size conventions

- **Naming**:
  - Components/hooks/types: PascalCase for components, `useX` for hooks, clear domain names (e.g., `HabitCounterCard`, `useHabitActions`).
  - Store files: `<domain>Store.ts`.
  - Utility files: concise verb/noun names (`cn.ts`, `haptics.ts`).
- **File size target**:
  - Prefer keeping files under ~200 lines.
  - If a file grows beyond ~250 lines, split by responsibility (UI extraction, hook extraction, token extraction).

## Troubleshooting

### Reanimated pitfalls

- Ensure `react-native-reanimated/plugin` is included in `babel.config.js`.
- Keep the Reanimated Babel plugin last in the plugin list.
- After changing Babel/Reanimated setup, clear Metro cache:

```bash
npx expo start -c
```

### NativeWind pitfalls

- Confirm `nativewind/babel` is enabled in `babel.config.js`.
- Ensure `tailwind.config.js` `content` includes all source globs (e.g., `./src/**/*.{ts,tsx}`).
- Verify `nativewind-env.d.ts` is included in TypeScript config includes.

### Expo Router pitfalls

- Ensure Expo Router plugin is registered in `app.json` (`"plugins": ["expo-router"]`).
- Keep route files inside `src/app` and ensure layout files (`_layout.tsx`) export navigator wrappers correctly.
- If routing changes are not reflected, restart the dev server with cache clear (`npx expo start -c`).

## Scripts

- `npm run start` - start Metro bundler
- `npm run android` - open Android dev target
- `npm run ios` - open iOS dev target
- `npm run web` - run on web
- `npm run typecheck` - run TypeScript compilation checks
