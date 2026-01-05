import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/firebase';
import { COLORS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export default function PlantDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlant = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "plants", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPlant(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching plant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!plant) {
    return (
      <View style={styles.center}>
        <Text style={{color: COLORS.textBody, marginBottom: 20}}>Tanaman tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.btnBackHome}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* --- HEADER IMAGE FULL SCREEN --- */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: plant.imageUrl }} style={styles.image} />
          {/* Overlay Gradient Hitam di Bawah Gambar agar Transisi Halus */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imageOverlay}
          />
          
          {/* Tombol Back Custom (Glassmorphism) */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* --- CONTENT CONTAINER (FLOATING SHEET) --- */}
        <View style={styles.contentContainer}>
          
          {/* Garis Indikator Swipe (Hiasan) */}
          <View style={styles.headerBar} />
          
          {/* Judul & Kategori */}
          <View style={styles.titleSection}>
             <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>HERBAL COLLECTION</Text>
             </View>
             <Text style={styles.title}>{plant.name}</Text>
             {/* Karena DB tidak ada scientific name, kita hardcode atau pakai placeholder jika mau */}
             {/* <Text style={styles.scientificName}>Scientific Name</Text> */}
          </View>
          
          <View style={styles.divider} />

          {/* 1. DESCRIPTION */}
          <View style={styles.section}>
             <Text style={styles.sectionTitle}>Tentang Tanaman</Text>
             <Text style={styles.descriptionText}>{plant.description}</Text>
          </View>

          {/* 2. KEY BENEFITS (Card Style) */}
          <View style={styles.benefitCard}>
             <View style={styles.benefitHeader}>
                <View style={styles.iconCircle}>
                   <MaterialIcons name="medical-services" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.benefitTitle}>Khasiat & Manfaat</Text>
             </View>
             <Text style={styles.benefitText}>{plant.benefit}</Text>
          </View>

          {/* 3. ACTIVE COMPOUNDS (Grid Style Modern) */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <MaterialIcons name="science" size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Kandungan Senyawa</Text>
            </View>
            
            <View style={styles.compoundsContainer}>
              {Array.isArray(plant.compounds) && plant.compounds.length > 0 ? (
                plant.compounds.map((item, index) => (
                  <View key={index} style={styles.compoundCard}>
                    <View style={styles.compoundTop}>
                       <Text style={styles.compoundAmount}>{item.amount || '?'}</Text>
                       <MaterialIcons name="bubble-chart" size={18} color="#A5D6A7" />
                    </View>
                    <Text style={styles.compoundName}>{item.name}</Text>
                  </View>
                ))
              ) : (
                // Fallback Layout
                <View style={styles.emptyCompound}>
                   <Text style={{color: COLORS.textBody}}>{plant.content || "Data belum tersedia"}</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Footer Space */}
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      {/* Floating Action Button (Optional: Share/Save) */}
      <TouchableOpacity style={styles.fab}>
         <Ionicons name="heart-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2', // Abu sangat muda
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBackHome: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  // --- HEADER IMAGE ---
  imageContainer: {
    width: width,
    height: height * 0.45, // 45% tinggi layar
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: 150,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    width: 40, 
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.3)', // Semi transparan
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  
  // --- CONTENT SHEET ---
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -40, // Overlap ke atas gambar
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 25,
    paddingTop: 15,
    minHeight: height * 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 }, // Shadow ke atas
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  headerBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  
  // --- TITLE SECTION ---
  titleSection: {
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800', // Extra Bold
    color: '#1A1A1A',
    lineHeight: 34,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.textBody,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },

  // --- SECTIONS ---
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
    textAlign: 'justify',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },

  // --- BENEFIT CARD (New Design) ---
  benefitCard: {
    backgroundColor: '#F5F9F5', // Hijau sangat pudar
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  iconCircle: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  benefitText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },

  // --- ACTIVE COMPOUNDS (Grid) ---
  compoundsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  compoundCard: {
    width: (width - 50 - 12) / 2, // 2 Kolom pas (Total width - padding - gap) / 2
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  compoundTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compoundAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  compoundName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  emptyCompound: {
    width: '100%',
    padding: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    alignItems: 'center',
  },

  // --- FAB ---
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  }
});