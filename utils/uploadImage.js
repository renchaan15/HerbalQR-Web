import { Platform } from 'react-native';
import { CLOUDINARY_URL, UPLOAD_PRESET } from '../config/cloudinary';

export const uploadToCloudinary = async (uri) => {
  if (!uri) return null;

  try {
    const formData = new FormData();

    // --- KHUSUS WEB ---
    if (Platform.OS === 'web') {
      // Di Web, kita harus ubah URI menjadi Blob dulu
      const response = await fetch(uri);
      const blob = await response.blob();
      formData.append('file', blob);
    } 
    // --- KHUSUS HP (Android/iOS) ---
    else {
      let filename = uri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      formData.append('file', { uri: uri, name: filename, type });
    }

    formData.append('upload_preset', UPLOAD_PRESET); 

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
      // Hapus header 'content-type' agar browser mengaturnya otomatis (boundary)
    });

    const data = await response.json();

    // Cek error dari Cloudinary
    if (data.error) {
      console.error("Cloudinary Error:", data.error.message);
      throw new Error(data.error.message);
    }
    
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error("Gagal mendapatkan URL gambar");
    }
  } catch (error) {
    console.error("Upload Error Detail:", error);
    throw error;
  }
};