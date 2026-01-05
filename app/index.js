import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, Platform, View } from 'react-native';
import { db } from '../config/firebase'; // Pastikan path import benar
import { COLORS, SHADOWS } from '../constants/theme';

export default function Home() {
  const router = useRouter();
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Ambil Data untuk Katalog Publik
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

  // --- RENDER HEADER HOME ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
         <View>
            <Text style={styles.subTitle}>Selamat Datang di</Text>
            <Text style={styles.mainTitle}>Herbal Pedia</Text>
         </View>
         {/* Tombol Login Admin Tersembunyi tapi Elegan */}
         <TouchableOpacity onPress={() => router.push('/admin/login')} style={styles.loginBtn}>
            <MaterialIcons name="admin-panel-settings" size={24} color={COLORS.primary} />
         </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
         <Ionicons name="search" size={20} color="#999" />
         <TextInput
            style={styles.searchInput}
            placeholder="Cari tanaman herbal..."
            value={search}
            onChangeText={handleSearch}
         />
      </View>
    </View>
  );

  // --- RENDER ITEM KATALOG ---
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/plant/${item.id}`)} // Ke Halaman Detail
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.badgeContainer}>
           <Text style={styles.badgeText}>HERBAL</Text>
        </View>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.readMore}>
           <Text style={{color: COLORS.primary, fontSize: 12, fontWeight:'600'}}>Baca Selengkapnya</Text>
           <MaterialIcons name="arrow-forward" size={14} color={COLORS.primary} />
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
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
               <Text style={{ color: '#999' }}>Tanaman tidak ditemukan.</Text>
            </View>
          )
        }
      />

      {loading && (
        <View style={{ position: 'absolute', top: '50%', left: 0, right: 0 }}>
           <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
  },
  loginBtn: {
    padding: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...SHADOWS.ios
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  // CARD STYLES
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    ...SHADOWS.card,
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  badgeContainer: {
    backgroundColor: '#F1F8E9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  }
});