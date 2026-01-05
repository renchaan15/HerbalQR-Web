import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/firebase';
import { COLORS, SHADOWS } from '../../constants/theme';
import { uploadToCloudinary } from '../../utils/uploadImage';

export default function AddPlant() {
  const router = useRouter();
  
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [benefit, setBenefit] = useState('');
  const [compounds, setCompounds] = useState([{ name: '', amount: '' }]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const addCompoundRow = () => setCompounds([...compounds, { name: '', amount: '' }]);
  
  const removeCompoundRow = (index) => {
    const newRows = [...compounds];
    newRows.splice(index, 1);
    setCompounds(newRows);
  };
  
  const updateCompound = (text, index, field) => {
    const newRows = [...compounds];
    newRows[index][field] = text;
    setCompounds(newRows);
  };

  const handleSave = async () => {
    if (!name || !desc || !image) {
      Alert.alert("Data Belum Lengkap", "Harap isi Nama, Deskripsi, dan Gambar.");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(image);
      
      await addDoc(collection(db, "plants"), {
        name,
        description: desc,
        benefit,
        compounds: compounds,
        imageUrl,
        createdAt: serverTimestamp()
      });

      Alert.alert("Sukses", "Tanaman berhasil ditambahkan!");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* --- HEADER GRADIENT --- */}
      <LinearGradient
        colors={[COLORS.primary, '#2E4C2E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Koleksi</Text>
        <View style={{ width: 40 }} /> {/* Placeholder agar title center */}
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* --- SECTION 1: GAMBAR --- */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Foto Tanaman</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {image ? (
                <>
                  <Image source={{ uri: image }} style={styles.previewImage} />
                  <View style={styles.editOverlay}>
                    <MaterialIcons name="edit" size={20} color="white" />
                    <Text style={{color:'white', fontSize: 12, marginLeft: 5}}>Ganti Foto</Text>
                  </View>
                </>
              ) : (
                <View style={styles.placeholder}>
                  <View style={styles.iconCircle}>
                    <MaterialIcons name="add-a-photo" size={32} color={COLORS.primary} />
                  </View>
                  <Text style={styles.placeholderText}>Tap untuk upload foto</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* --- SECTION 2: INFORMASI UTAMA --- */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informasi Dasar</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Tanaman</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Contoh: Ginseng Jawa" 
                value={name} 
                onChangeText={setName} 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Deskripsi Singkat</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Jelaskan karakteristik tanaman..." 
                multiline 
                numberOfLines={3} 
                value={desc} 
                onChangeText={setDesc} 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Khasiat & Manfaat</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Sebutkan manfaat utama..." 
                multiline 
                numberOfLines={3} 
                value={benefit} 
                onChangeText={setBenefit} 
              />
            </View>
          </View>

          {/* --- SECTION 3: SENYAWA AKTIF --- */}
          <View style={styles.card}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 15}}>
              <Text style={styles.cardTitle}>Kandungan Senyawa</Text>
              <TouchableOpacity onPress={addCompoundRow}>
                 <Text style={{color: COLORS.primary, fontWeight:'600'}}>+ Tambah</Text>
              </TouchableOpacity>
            </View>
            
            {compounds.map((item, index) => (
              <View key={index} style={styles.compoundRow}>
                <View style={{flex: 2}}>
                    <Text style={styles.smallLabel}>Nama Senyawa</Text>
                    <TextInput 
                        style={styles.smallInput} 
                        placeholder="Mis: Saponin" 
                        value={item.name}
                        onChangeText={(text) => updateCompound(text, index, 'name')}
                    />
                </View>
                <View style={{flex: 1, marginHorizontal: 10}}>
                    <Text style={styles.smallLabel}>Kadar</Text>
                    <TextInput 
                        style={styles.smallInput} 
                        placeholder="%" 
                        value={item.amount}
                        onChangeText={(text) => updateCompound(text, index, 'amount')}
                    />
                </View>
                {compounds.length > 1 && (
                  <TouchableOpacity onPress={() => removeCompoundRow(index)} style={{marginTop: 18}}>
                    <Ionicons name="trash-outline" size={22} color={COLORS.error} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Footer Space for FAB */}
          <View style={{ height: 100 }} />

        </ScrollView>
      </KeyboardAvoidingView>

      {/* --- FLOATING SAVE BUTTON --- */}
      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.secondary, COLORS.primary]}
            style={styles.saveGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>SIMPAN DATA</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5F2', // Abu muda mewah
  },
  header: {
    paddingTop: 50, // Sesuaikan notch
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...SHADOWS.ios,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backBtn: {
    padding: 5,
  },
  scrollContent: {
    padding: 20,
  },
  
  // CARD STYLES
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textTitle,
    marginBottom: 15,
  },

  // IMAGE PICKER
  imagePicker: {
    height: 200,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 60, height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  editOverlay: {
    position: 'absolute',
    bottom: 10, right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // INPUT FIELDS
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    color: COLORS.textBody,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textTitle,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  // COMPOUNDS
  compoundRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  smallLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  smallInput: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },

  // FLOATING BUTTON
  footerContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  saveGradient: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});