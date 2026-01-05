import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  StatusBar, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'; 
import { db } from '../config/firebase'; 
import { COLORS, SHADOWS } from '../constants/theme';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const router = useRouter();
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Ambil Data Realtime
  useEffect(() => {
    const q = query(collection(db, "plants"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlants(data);
      setFilteredPlants(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fungsi Search
  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const newData = plants.filter(item => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        return itemData.indexOf(text.toUpperCase()) > -1;
      });
      setFilteredPlants(newData);
    } else {
      setFilteredPlants(plants);
    }
  };

  // --- RENDER HEADER (Modern & Clean) ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
         <View>
            <Text style={styles.greetingText}>Temukan Manfaat Alam</Text>
            <Text style={styles.brandText}>Herbal Pedia</Text>
         </View>
         
         {/* Tombol Login Admin (Subtle/Minimalis) */}
         <TouchableOpacity 
            onPress={() => router.push('/admin/login')} 
            style={styles.adminButton}
         >
            <MaterialIcons name="security" size={20} color={COLORS.primary} />
         </TouchableOpacity>
      </View>

      {/* Search Bar Floating */}
      <View style={styles.searchWrapper}>
         <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={22} color="#999" style={{marginRight: 10}} />
            <TextInput
                style={styles.searchInput}
                placeholder="Cari tanaman obat..."
                placeholderTextColor="#A0A0A0"
                value={search}
                onChangeText={handleSearch}
            />
            {search.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')}>
                    <Ionicons name="close-circle" size={20} color="#CCC" />
                </TouchableOpacity>
            )}
         </View>
      </View>

      {/* Section Title (Opsional, jika ingin pemisah) */}
      <View style={{marginTop: 25, marginBottom: 10, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
        <Text style={styles.sectionTitle}>Koleksi Terbaru</Text>
        <Text style={{fontSize: 12, color: COLORS.primary, fontWeight:'600'}}>{filteredPlants.length} Tanaman</Text>
      </View>
    </View>
  );

  // --- RENDER CARD (Immersive Style) ---
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/plant/${item.id}`)}
      activeOpacity={0.95}
    >
      {/* Gambar Full Width di Atas */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        
        {/* Badge Kategori Melayang */}
        <View style={styles.floatingBadge}>
           <Text style={styles.badgeText}>HERBAL</Text>
        </View>

        {/* Gradient Overlay di bawah gambar agar transisi halus */}
        <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.05)']}
            style={styles.imageOverlay}
        />
      </View>

      {/* Konten Text */}
      <View style={styles.cardContent}>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start'}}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <MaterialIcons name="arrow-outward" size={20} color={COLORS.primary} />
        </View>
        
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        
        {/* Footer Card: Icons kecil untuk fitur */}
        <View style={styles.cardFooter}>
            <View style={styles.featureTag}>
                <FontAwesome5 name="leaf" size={10} color="#666" />
                <Text style={styles.featureText}>Alami</Text>
            </View>
            <View style={styles.featureTag}>
                <FontAwesome5 name="check-circle" size={10} color="#666" />
                <Text style={styles.featureText}>Terverifikasi</Text>
            </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <FlatList
        data={filteredPlants}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 20, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
               <View style={styles.emptyIconBg}>
                  <Ionicons name="search" size={40} color="#CCC" />
               </View>
               <Text style={styles.emptyText}>Tanaman tidak ditemukan</Text>
               <Text style={styles.emptySubText}>Coba kata kunci lain</Text>
            </View>
          )
        }
      />

      {loading && (
        <View style={styles.loadingOverlay}>
           <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Putih bersih agak abu dikit
  },
  
  // --- HEADER STYLES ---
  headerContainer: {
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  greetingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  brandText: {
    fontSize: 28,
    fontWeight: '800', // Extra Bold
    color: COLORS.textTitle, // Hitam pekat
    letterSpacing: -0.5,
  },
  adminButton: {
    padding: 10,
    backgroundColor: '#F0F5F0',
    borderRadius: 12,
  },

  // --- SEARCH BAR ---
  searchWrapper: {
    // Shadow untuk search bar
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    height: '100%',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  // --- CARD STYLES ---
  card: {
    backgroundColor: 'white',
    borderRadius: 20, // Rounded banget
    marginBottom: 20,
    ...SHADOWS.card, // Shadow lembut dari theme
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FAFAFA',
    overflow: 'hidden',
  },
  imageWrapper: {
    height: 200, // Gambar lebih tinggi
    width: '100%',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 40,
  },
  floatingBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    zIndex: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  
  // Content Card
  cardContent: {
    padding: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
    flex: 1,
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  
  // Footer features
  cardFooter: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 12,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featureText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },

  // --- EMPTY STATE ---
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIconBg: {
    width: 80, height: 80,
    backgroundColor: '#F0F0F0',
    borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },

  loadingOverlay: {
    position: 'absolute',
    top: '50%', left: 0, right: 0,
    alignItems: 'center',
  }
});