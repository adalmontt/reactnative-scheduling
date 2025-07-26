import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Audio } from 'expo-av'; // fixed import
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplayItalic: require('../assets/fonts/PlayfairDisplay-Italic.ttf'),
    PlayfairDisplayNormal: require('../assets/fonts/PlayfairDisplay-Normal.ttf'),
  });

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,

          shouldDuckAndroid: false,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          staysActiveInBackground: false,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.warn('Audio config error', e);
      }
    };

    if (fontsLoaded) {
      configureAudio();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="form" options={{ headerShown: false }} />
        <Stack.Screen name="details" options={{ headerShown: false }} />
        <Stack.Screen name="edit" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
