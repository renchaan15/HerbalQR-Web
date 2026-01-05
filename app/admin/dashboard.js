import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRModal from '../../components/QRModal';
import { auth, db } from '../../config/firebase';
import { COLORS } from '../../constants/theme';

export default function Dashboard() {
  const router = useRouter();
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]); // Untuk Search
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // State Modal QR
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState({ id: '', name: '' });

  // 1. Ambil Data Realtime
  useEffect(() => {
    const q = query(collection(db, "plants"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlants(data);
      setFilteredPlants(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fungsi Search
  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const newData = plants.filter(item => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredPlants(newData);
    } else {
      setFilteredPlants(plants);
    }
  };

const handleLogout = async () => {
    // --- LOGIKA KHUSUS WEB ---
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm("Yakin ingin keluar dari Dashboard?");
      if (confirmLogout) {
        await signOut(auth);
        router.replace('/admin/login');
      }
    } 
    // --- LOGIKA KHUSUS HP (NATIVE) ---
    else {
      Alert.alert("Konfirmasi", "Yakin ingin keluar dari Dashboard?", [
        { text: "Batal", style: "cancel" },
        { 
          text: "Keluar", 
          style: "destructive", 
          onPress: async () => {
            await signOut(auth);
            router.replace('/admin/login');
          }
        }
      ]);
    }
  };

  const handleDelete = (id, name) => {
    Alert.alert("Hapus Data", `Yakin ingin menghapus "${name}"?`, [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: async () => await deleteDoc(doc(db, "plants", id)) }
    ]);
  };

  const handleShowQR = (item) => {
    setSelectedPlant({ id: item.id, name: item.name });
    setModalVisible(true);
  };

  // --- KOMPONEN HEADER MEWAH ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={[COLORS.primary, '#2E4C2E']} // Gradasi Hijau Mewah
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greetingText}>Selamat Datang,</Text>
              <Text style={styles.adminText}>Administrator</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <MaterialIcons name="logout" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Statistik Card Kecil */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{plants.length}</Text>
              <Text style={styles.statLabel}>Total Koleksi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialIcons name="eco" size={24} color="#A3D9A5" />
              <Text style={styles.statLabel}>Herbal Aktif</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Search Bar Floating */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama tanaman..."
            value={search}
            onChangeText={handleSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  // --- ITEM LIST CARD ---
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
          
          <View style={styles.actionRow}>
    {/* Tombol QR */}
    <TouchableOpacity style={styles.actionBtn} onPress={() => handleShowQR(item)}>
        <MaterialIcons name="qr-code" size={16} color={COLORS.primary} />
        <Text style={styles.actionText}>QR</Text>
    </TouchableOpacity>
    
    {/* TOMBOL EDIT BARU */}
    <TouchableOpacity 
        style={[styles.actionBtn, { backgroundColor: '#E3F2FD', marginLeft: 8 }]} 
        onPress={() => router.push(`/admin/edit/${item.id}`)}
    >
        <MaterialIcons name="edit" size={16} color="#1976D2" />
        <Text style={[styles.actionText, { color: '#1976D2' }]}>Ubah</Text>
    </TouchableOpacity>
    
    {/* Tombol Hapus */}
    <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn, { marginLeft: 8 }]} onPress={() => handleDelete(item.id, item.name)}>
        <MaterialIcons name="delete-outline" size={18} color={COLORS.error} />
    </TouchableOpacity>
</View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* List Data dengan Header Gabungan */}
      <FlatList
        data={filteredPlants}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="spa" size={60} color="#DDD" />
              <Text style={styles.emptyText}>Data tanaman tidak ditemukan</Text>
            </View>
          )
        }
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      {/* FAB Modern */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/admin/add')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[COLORS.secondary, COLORS.primary]}
          style={styles.fabGradient}
        >
          <MaterialIcons name="add" size={32} color={COLORS.white} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal QR */}
      <QRModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        plantId={selectedPlant.id}
        plantName={selectedPlant.name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5F2', // Background abu sangat muda (Clean)
  },
  // Header Styles
  headerContainer: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  greetingText: {
    color: '#A3D9A5',
    fontSize: 14,
  },
  adminText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#E0E0E0',
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 20,
  },
  // Search Styles
  searchContainer: {
    marginHorizontal: 20,
    marginTop: -25, // Overlap ke atas header
  },
  searchBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.textTitle,
  },
  // Card Styles
  card: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    padding: 12,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: '#FFF0F0',
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  // Loading & Empty
  loadingOverlay: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#999',
    marginTop: 10,
  },
  // FAB Styles
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});