import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  Platform, 
  KeyboardAvoidingView, 
  ScrollView,
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase'; 
import { COLORS, SHADOWS, SIZES } from '../../constants/theme';
import Input from '../../components/Input';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Harap isi email dan password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/admin/dashboard'); 
    } catch (err) {
      console.log(err);
      let msg = 'Terjadi kesalahan pada login.';
      if (err.code === 'auth/invalid-email') msg = 'Format email salah.';
      if (err.code === 'auth/user-not-found') msg = 'User tidak ditemukan.';
      if (err.code === 'auth/wrong-password') msg = 'Password salah.';
      if (err.code === 'auth/invalid-credential') msg = 'Email atau password salah.';
      
      setError(msg);

      // Handle Alert Web vs Native
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert('Login Gagal', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* --- HEADER SECTION --- */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="security" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Admin Portal</Text>
            <Text style={styles.subtitle}>Masuk untuk mengelola data tanaman herbal</Text>
          </View>

          {/* --- FORM SECTION --- */}
          <View style={styles.formCard}>
            <Input
              label="Email Address"
              placeholder="admin@herbal.com"
              value={email}
              onChangeText={text => setEmail(text)}
              error={error && !email ? 'Email wajib diisi' : null}
            />
            
            <Input
              label="Password"
              placeholder="Masukkan password"
              password
              value={password}
              onChangeText={text => setPassword(text)}
              error={error} 
            />

            {/* Tombol Login Gradient */}
            <TouchableOpacity 
              style={styles.loginButtonWrapper} 
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.secondary, COLORS.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>MASUK DASHBOARD</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* --- FOOTER SECTION --- */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.textBody} />
            <Text style={styles.backButtonText}>Kembali ke Halaman Utama</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5F2', // Abu muda (konsisten dengan tema)
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.large,
  },
  
  // HEADER STYLES
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    ...SHADOWS.card,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textBody,
    textAlign: 'center',
    maxWidth: '80%',
  },

  // FORM CARD STYLES
  formCard: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    ...SHADOWS.card,
    elevation: 4,
  },
  
  // BUTTON STYLES
  loginButtonWrapper: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  gradientButton: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },

  // BACK BUTTON
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    gap: 8,
    opacity: 0.8,
  },
  backButtonText: {
    color: COLORS.textBody,
    fontSize: 14,
    fontWeight: '500',
  },
});