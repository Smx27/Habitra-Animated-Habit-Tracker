import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableFreeze, enableScreens } from 'react-native-screens';

import { ThemeProvider } from '@/theme';

void SplashScreen.preventAutoHideAsync();
enableScreens(true);
enableFreeze(true);

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const interactionTask = InteractionManager.runAfterInteractions(() => {
      setIsAppReady(true);
    });

    return () => {
      interactionTask.cancel();
    };
  }, []);

  useEffect(() => {
    if (!isAppReady) {
      return;
    }

    void SplashScreen.hideAsync();
  }, [isAppReady]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Stack screenOptions={{ headerTitle: 'Habitra', headerShadowVisible: false }} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
