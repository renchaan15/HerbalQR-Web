import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';

// 1. IMPORT UTILS UNTUK LOAD FONT
import { useFonts } from 'expo-font';
import { 
  Ionicons, 
  MaterialIcons, 
  FontAwesome, 
  FontAwesome5 
} from '@expo/vector-icons';

export default function Layout() {
  
  // 2. LOAD SEMUA FONT YANG DIPAKAI SECARA EKSPLISIT
  const [loaded, error] = useFonts({
    ...Ionicons.font,
    ...MaterialIcons.font,
    ...FontAwesome.font,
    ...FontAwesome5.font,
  });

  // Cek jika ada error saat load font
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // 3. TAMPILKAN LOADING SPINNER SAMPAI FONT SIAP
  // Ini mencegah aplikasi muncul kotak-kotak sebelum font terdownload
  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // 4. JIKA SUDAH LOAD, TAMPILKAN APLIKASI UTAMA
  return (
    <View style={styles.webContainer}>
      <StatusBar style="dark" />
      
      <View style={styles.appWrapper}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.background },
            headerShadowVisible: false,
            headerTintColor: COLORS.primary,
            headerTitleStyle: { fontWeight: 'bold' },
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          {/* Definisi Screen */}
          <Stack.Screen name="index" options={{ headerShown: false }} /> 
          <Stack.Screen name="admin/login" options={{ headerShown: false }} />
          
          <Stack.Screen name="admin/dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="admin/add" options={{ headerShown: false }} />
          <Stack.Screen name="admin/edit/[id]" options={{ headerShown: false }} />
          
          <Stack.Screen name="plant/[id]" options={{ headerShown: false }} />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#E0E0E0', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  appWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 480, 
    backgroundColor: '#FAFAFA', // Sesuaikan dengan COLORS.background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: Platform.OS === 'web' ? 0.1 : 0,
    shadowRadius: 20,
    overflow: 'hidden', 
  },
});