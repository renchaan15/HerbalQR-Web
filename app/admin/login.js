import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../components/Input';
import { auth } from '../../config/firebase'; // Pastikan path ini benar sesuai struktur folder
import { COLORS, SHADOWS, SIZES } from '../../constants/theme';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Validasi sederhana
    if (!email || !password) {
      setError('Harap isi email dan password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Jika sukses, arahkan ke Dashboard
      router.replace('/admin/dashboard'); 
    } catch (err) {
      console.log(err);
      // Custom pesan error agar lebih mudah dibaca
      let msg = 'Terjadi kesalahan pada login.';
      if (err.code === 'auth/invalid-email') msg = 'Format email salah.';
      if (err.code === 'auth/user-not-found') msg = 'User tidak ditemukan.';
      if (err.code === 'auth/wrong-password') msg = 'Password salah.';
      if (err.code === 'auth/invalid-credential') msg = 'Email atau password salah.';
      
      setError(msg);
      // Tampilkan alert juga untuk mobile
      Alert.alert('Login Gagal', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Admin Login</Text>
        <Text style={styles.subtitle}>Masuk untuk mengelola data tanaman.</Text>

        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="Contoh: admin@herbal.com"
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
            error={error} // Tampilkan error global di bawah field password juga
          />

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Masuk Dashboard</Text>
            )}
          </TouchableOpacity>
          
          {/* Tombol Back to Home (Opsional) */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Kembali ke Beranda</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SIZES.large,
  },
  content: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textBody,
    marginBottom: 30,
  },
  form: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    ...SHADOWS.card,
  },
  button: {
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    ...SHADOWS.ios,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.textBody,
  },
});