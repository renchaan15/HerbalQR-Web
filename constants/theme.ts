import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#4A6741',     // Hijau Herbal/Daun (Earth Tone)
  secondary: '#8AA868',   // Hijau Muda Lembut
  background: '#F8F9FA',  // Putih Gading/Abu sangat muda (Clean)
  card: '#FFFFFF',        // Putih Bersih
  textTitle: '#1A1A1A',   // Hitam tidak pekat
  textBody: '#666666',    // Abu-abu teks
  border: '#E0E0E0',
  error: '#FF4D4D',
  success: '#4CAF50',
  white: '#FFFFFF',
};

export const SHADOWS = {
  ios: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Untuk Android
  },
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  }
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  width,
  height,
  radius: 12, // Rounded Card
};

export const FONTS = {
  // Gunakan system font untuk kesan iOS native
  regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
  bold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
};