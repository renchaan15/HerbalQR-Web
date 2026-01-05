import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/theme';

export default function Layout() {
  return (
    // Container Luar (Untuk Desktop: Background Abu-abu)
    <View style={styles.webContainer}>
      <StatusBar style="dark" />
      
      {/* Container Dalam (Membatasi Lebar Aplikasi ala HP) */}
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
          
          {/* Halaman Admin */}
          <Stack.Screen name="admin/dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="admin/add" options={{ headerShown: false }} />
          <Stack.Screen 
            name="admin/edit/[id]" 
            options={{ 
              headerShown: false // Ubah jadi false
            }} 
          />
          
          {/* Halaman Public */}
          <Stack.Screen name="plant/[id]" options={{ headerShown: false }} />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#E0E0E0', // Background Desktop (Abu gelap)
    alignItems: 'center', // Tengahkan aplikasi
    justifyContent: 'center',
  },
  appWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 480, // BATASI LEBAR MAKSIMAL (Kunci agar tidak melar di PC)
    backgroundColor: COLORS.background, // Background asli aplikasi
    // Shadow agar terlihat seperti HP melayang di desktop
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: Platform.OS === 'web' ? 0.1 : 0,
    shadowRadius: 20,
    overflow: 'hidden', // Agar corner radius stack navigation rapi
  },
});