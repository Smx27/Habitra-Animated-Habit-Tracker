# Habitra Animated Habit Tracker

<p align="center">
  <strong>A delightful, motion-rich habit tracking app built for mobile-first experiences</strong>
</p>

<div align="center">

[![React Native](https://img.shields.io/badge/React%20Native-0.75+-61dafb?style=flat-square&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51+-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-4.2+-06B6D4?style=flat-square)](https://www.nativewind.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

Habitra is a modern **mobile habit tracker** prototype built with Expo and React Native. It demonstrates polished micro-interactions, smooth animations, clean theming, and a scalable architecture—all designed to encourage daily habit completion through delightful visual feedback.

Perfect for building personal productivity tools or as a reference for production-grade React Native applications.

## ✨ Features

- 🎯 **Local-first tracking** - No backend required; habits stored in client state with Zustand
- 🎨 **Motion-rich UI** - Pulse animations, Lottie celebrations, and haptic feedback for every action
- 🌙 **Smart theming** - Automatic light/dark mode with consistent design tokens
- 📱 **Cross-platform** - Runs on iOS, Android, and web with a single codebase
- ⚡ **Type-safe** - Full TypeScript support with strict type checking
- 🏗️ **Scalable architecture** - Clean separation of concerns ready for production growth

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- One of the following:
  - iOS Simulator (macOS + Xcode)
  - Android Emulator (Android Studio)
  - Expo Go on a physical device

### Installation

```bash
# Clone and install dependencies
git clone <your-repo-url>
cd habitra-animated-habit-tracker
npm install

# Start development server
npm run start

# Run on specific platform
npm run android    # Android Emulator
npm run ios        # iOS Simulator
npm run web        # Web browser
```

For production builds:
```bash
npm run android:prod
npm run ios:prod
```

### Type Checking

```bash
npm run typecheck
```

## 🏗️ Architecture

### Project Structure

```text
src/
├── app/              # Expo Router route definitions & layouts
├── assets/           # Static assets (Lottie JSON, images)
├── components/
│   ├── animations/   # Reanimated & motion components
│   ├── habit/        # Domain-specific habit components
│   └── ui/           # Reusable UI primitives (Button, Card, Text)
├── constants/        # App and domain constants
├── features/         # Feature-specific logic
├── hooks/            # Custom hooks for side effects
├── store/            # Zustand state management
├── theme/            # Design tokens & ThemeProvider
├── types/            # Shared TypeScript types
└── utils/            # Pure utility functions
```

### Key Design Decisions

| Aspect | Solution | Why |
|--------|----------|-----|
| **State** | Zustand | Lightweight, minimal boilerplate, perfect for local-first apps |
| **Animations** | Reanimated + Lottie | Smooth 60fps motion + celebration sequences |
| **Styling** | NativeWind + Tailwind | Consistent tokens, familiar DX, smaller bundle |
| **Routing** | Expo Router | File-based routing, deep linking support out of box |
| **Language** | TypeScript | Type safety, better IDE support, scalable codebase |

### Component Responsibilities

- **`components/ui`** → Domain-agnostic primitives (Button, Card, Text, etc.)
- **`components/habit`** → Habit-specific composite components
- **`hooks/`** → Side effect orchestration (state mutations + haptics)
- **`store/`** → Pure state and action definitions
- **`theme/`** → Design tokens & semantic color mappings

## 🎨 Theming

Habitra uses a **token-first design system**:

```typescript
// Automatic light/dark detection
const { colors, spacing, radius, typography } = useThemeTokens();

// Semantic color names
<View className={colors.backgroundClass} />
<Text className={colors.textPrimaryClass} />
```

All design tokens are centralized in `src/theme/` and include:
- ✅ Semantic colors (light & dark modes)
- ✅ Spacing scale (8px grid)
- ✅ Border radius variants
- ✅ Typography styles
- ✅ Shadow definitions

Add new tokens in one place and use them everywhere.

## 🎬 Animation Patterns

### React Native Reanimated
For interactive, continuous motion:
```typescript
// Example: Pulsing orb for habit completion
const animValue = useSharedValue(1);
const animStyle = useAnimatedStyle(() => ({
  opacity: animValue.value,
}));
```

### Lottie
For celebratory sequences with zero animation logic:
```typescript
<Lottie source={require('@/assets/success.json')} />
```

**Guidelines:**
- Keep durations subtle (200-400ms for interactions)
- Pair success actions with haptic feedback
- Avoid animation overhead on list renders

## 📋 Development Guidelines

### 1. Component Patterns
- Create small, composable UI primitives
- Use explicit prop types (`type Props = { ... }`)
- Keep routes thin—compose from feature components
- Keep files under ~200 lines; split if needed

### 2. State Management
```typescript
// Use Zustand for cross-screen state
const { habits, addHabit } = useHabitStore();

// Use hooks for orchestration
const { completeHabit } = useHabitActions();

// Keep component state local unless shared
const [isLoading, setIsLoading] = useState(false);
```

### 3. Naming Conventions
- **Components**: PascalCase (`HabitCard`, `ProgressOrb`)
- **Hooks**: `useX` prefix (`useHabitActions`, `useAnimation`)
- **Stores**: `<domain>Store.ts` (`habitStore.ts`)
- **Utils**: Concise names (`cn.ts`, `haptics.ts`)

## 🔧 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Runtime** | Expo 51+ | Managed React Native, instant hot reload |
| **UI Framework** | React Native + TypeScript | Type-safe, native performance |
| **Routing** | Expo Router | File-based, deep linking, native stack nav |
| **Styling** | NativeWind 4.2+ | Tailwind for React Native |
| **Animations** | Reanimated 3.17+ + Lottie 7.3+ | Smooth 60fps motion |
| **State** | Zustand 5+ | Minimal API, great DX |
| **Haptics** | expo-haptics | Native vibration feedback |
| **Language** | TypeScript 5+ | Type safety at scale |

## ⚠️ Troubleshooting

### Cache Issues
```bash
npx expo start -c    # Clear Metro cache
```

### Reanimated not working?
- ✅ Ensure `react-native-reanimated/plugin` is in `babel.config.js`
- ✅ Keep Reanimated plugin **last** in the plugin list
- ✅ Clear cache after Babel changes

### NativeWind styles not applying?
- ✅ Verify `src/**/*.{ts,tsx}` is in `tailwind.config.js` content
- ✅ Check `nativewind-env.d.ts` is in TypeScript `includes`
- ✅ Rebuild after config changes

### Routes not updating?
- ✅ Verify `src/app` folder exists and has route files
- ✅ Confirm `"plugins": ["expo-router"]` in `app.json`
- ✅ Restart dev server with cache clear

## 📚 Project Goals

This project demonstrates:

- **UI polish first** - Beautiful baseline UI with consistent design language
- **Animation-driven feedback** - Celebrate every habit completion with motion
- **Local-first architecture** - Fast, deterministic interactions without backend
- **Production-ready organization** - Scale from prototype to full app with minimal refactoring

## 🤝 Contributing

Contributions welcome! Please follow the architecture patterns documented above and keep code type-safe and well-organized.

## 📄 License

MIT License - feel free to use this as a reference or starting point for your own projects.

## 📦 Available Scripts

```bash
npm run start         # Start Metro bundler
npm run android       # Run on Android Emulator
npm run ios           # Run on iOS Simulator
npm run web           # Run in web browser
npm run typecheck     # Run TypeScript type checking
npm run android:prod  # Production Android build
npm run ios:prod      # Production iOS build
```

## 🔐 Type Safety & Quality

This project enforces strict TypeScript:

```bash
npm run typecheck
```

All components use explicit prop types and strict `noImplicitAny` checking. Path aliases (`@/*` → `src/*`) are configured for clean imports.

## 🎯 Best Practices

### When to Use Each Folder

| Folder | Purpose | Example |
|--------|---------|---------|
| `components/ui` | Generic, reusable UI pieces | Button, Card, Text |
| `components/habit` | Habit-specific features | HabitCard, HabitForm |
| `hooks` | Reusable side-effect logic | `useHabitActions`, `useAnimation` |
| `store` | Global state definitions | `habitStore.ts` |
| `utils` | Pure, stateless functions | `cn.ts`, `date.ts` |
| `theme` | Design tokens & colors | `tokens.ts`, `ThemeProvider` |

### Performance Tips

- Keep animation durations subtle (200-400ms)
- Use `useCallback` for expensive calculations
- Lazy-load routes with Expo Router's built-in code-splitting
- Monitor bundle size with Metro's built-in analysis

## 🚨 Common Gotchas

### ❌ Route Changes Not Reflecting
→ Clear cache: `npx expo start -c` and restart the dev server

### ❌ Reanimated Animations Not Working
→ Verify plugin order in `babel.config.js` (Reanimated **must** be last)

### ❌ NativeWind Styles Missing
→ Check `tailwind.config.js` includes `src/**/*.{ts,tsx}` in content

### ❌ Type Errors After Install
→ Run `npm run typecheck` and check `nativewind-env.d.ts` is in TypeScript includes

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated)
- [NativeWind Docs](https://www.nativewind.dev)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Expo Router Guide](https://docs.expo.dev/routing/introduction)

---

<p align="center">
  <strong>Built with ❤️ using React Native + Expo</strong>
  <br/>
  Ready for mobile-first production apps
</p>
