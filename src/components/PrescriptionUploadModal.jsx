import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { CameraIcon, PhotoIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import { updatePrescriptionStatus } from '../store/cartSlice';

const PrescriptionUploadModal = ({ visible, onClose, product, onUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleCameraUpload = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Please grant camera permission to use this feature.');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: false,
    };

    try {
      const result = await launchCamera(options);
      if (result.didCancel) {
        return;
      }
      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage);
        return;
      }
      if (result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to launch camera. Please try again.');
    }
  };

  const handleGalleryUpload = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel) {
        return;
      }
      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage);
        return;
      }
      if (result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open gallery. Please try again.');
    }
  };

  const handleUpload = () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      dispatch(updatePrescriptionStatus({ 
        productId: product.id, 
        status: 'uploaded',
        prescriptionImage: selectedImage.uri 
      }));
      setUploading(false);
      if (onUpload) {
        onUpload(selectedImage);
      }
      onClose();
    }, 1500);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Prescription</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <XMarkIcon size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product?.name}</Text>
            <Text style={styles.prescriptionRequired}>Prescription Required</Text>
          </View>

          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadOptions}>
              <TouchableOpacity
                style={styles.uploadOption}
                onPress={handleCameraUpload}
              >
                <CameraIcon size={32} color="#2874f0" />
                <Text style={styles.uploadOptionText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadOption}
                onPress={handleGalleryUpload}
              >
                <PhotoIcon size={32} color="#2874f0" />
                <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.uploadButton,
              (!selectedImage || uploading) && styles.uploadButtonDisabled
            ]}
            onPress={handleUpload}
            disabled={!selectedImage || uploading}
          >
            <Text style={styles.uploadButtonText}>
              {uploading ? 'Uploading...' : 'Upload Prescription'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  closeButton: {
    padding: 4,
  },
  productInfo: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  prescriptionRequired: {
    fontSize: 14,
    color: '#ff4444',
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  uploadOption: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    width: '45%',
  },
  uploadOptionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#212121',
    textAlign: 'center',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  changeImageButton: {
    padding: 8,
  },
  changeImageText: {
    color: '#2874f0',
    fontSize: 14,
    fontWeight: '500',
  },
  uploadButton: {
    backgroundColor: '#2874f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    backgroundColor: '#b3b3b3',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PrescriptionUploadModal; 