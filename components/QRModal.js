import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, Linking, Platform, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

const QRModal = ({ visible, onClose, plantId, plantName }) => {
  // URL Base (Sesuaikan nanti saat deploy)
  const baseUrl = "https://herbal-app-mobile.vercel.app/plant/"; 
  const fullUrl = `${baseUrl}${plantId}`;

  // URL API QR Code
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(fullUrl)}`;

  const [downloading, setDownloading] = useState(false);

  // --- FUNGSI DOWNLOAD QR ---
  const handleDownload = async () => {
    setDownloading(true);
    try {
      if (Platform.OS === 'web') {
        // 1. Fetch gambar sebagai Blob
        const response = await fetch(qrImageUrl);
        const blob = await response.blob();
        
        // 2. Buat URL objek sementara
        const blobUrl = URL.createObjectURL(blob);
        
        // 3. Buat elemen <a> fiktif untuk trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `QR-${plantName.replace(/\s+/g, '-')}.png`; // Nama file: QR-Jahe-Merah.png
        document.body.appendChild(link);
        link.click();
        
        // 4. Bersihkan memori
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } else {
        // Fallback untuk HP (Android/iOS Native)
        // Membuka browser agar user bisa "Long Press" -> "Save Image"
        Linking.openURL(qrImageUrl);
      }
    } catch (error) {
      console.error("Gagal download:", error);
      alert("Gagal mengunduh gambar.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>QR Code Tanaman</Text>
          <Text style={styles.plantName}>{plantName}</Text>

          {/* Container QR */}
          <View style={styles.qrContainer}>
             <Image 
                source={{ uri: qrImageUrl }} 
                style={{ width: 200, height: 200 }} 
                resizeMode="contain"
             />
          </View>
          
          <Text style={styles.infoText}>
            Gunakan QR ini untuk dicetak pada label tanaman.
          </Text>

          <View style={styles.buttonRow}>
            {/* Tombol Download Baru */}
            <TouchableOpacity 
                style={[styles.button, styles.buttonSuccess]} 
                onPress={handleDownload}
                disabled={downloading}
            >
              {downloading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                   <MaterialIcons name="file-download" size={18} color="white" />
                   <Text style={styles.textStyle}>Simpan QR</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.button, styles.buttonOutline]} 
                onPress={() => Linking.openURL(fullUrl)}
            >
              <Text style={{color: COLORS.primary}}>Tes Link</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.buttonClose]} 
              onPress={onClose}
            >
              <Text style={styles.textStyle}>Tutup</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    ...SHADOWS.card,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.textTitle,
  },
  plantName: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 20,
    fontWeight: '600',
  },
  qrContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  infoText: {
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.textBody,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap', // Agar tombol turun ke bawah jika layar sempit
    justifyContent: 'center'
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 2,
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'center',
  },
  buttonSuccess: {
    backgroundColor: '#2E7D32', // Hijau tua untuk download
  },
  buttonOutline: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonClose: {
    backgroundColor: '#757575', // Abu-abu untuk tutup
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default QRModal;