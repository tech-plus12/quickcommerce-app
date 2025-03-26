import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

// Dummy data for category products
const CATEGORY_PRODUCTS = {
  "Medicines": [
    {
      id: "1",
      name: "Paracetamol 500mg",
      price: "₹49",
      originalPrice: "₹65",
      image: "https://via.placeholder.com/200",
      rating: 4.5,
      reviews: 2345,
      discount: "25% off",
      prescription: false,
    },
    {
      id: "2",
      name: "Aspirin 75mg",
      price: "₹39",
      originalPrice: "₹55",
      image: "https://via.placeholder.com/200",
      rating: 4.3,
      reviews: 1890,
      discount: "30% off",
      prescription: false,
    },
    {
      id: "3",
      name: "Ibuprofen 400mg",
      price: "₹59",
      originalPrice: "₹75",
      image: "https://via.placeholder.com/200",
      rating: 4.4,
      reviews: 2100,
      discount: "20% off",
      prescription: false,
    },
  ],
  "Vitamins": [
    {
      id: "1",
      name: "Vitamin C 1000mg",
      price: "₹299",
      image: "https://via.placeholder.com/200",
      rating: 4.2,
      reviews: 1560,
      prescription: false,
    },
    {
      id: "2",
      name: "Vitamin D3 1000IU",
      price: "₹399",
      image: "https://via.placeholder.com/200",
      rating: 4.6,
      reviews: 980,
      prescription: false,
    },
    {
      id: "3",
      name: "Multivitamin Tablets",
      price: "₹499",
      image: "https://via.placeholder.com/200",
      rating: 4.5,
      reviews: 2100,
      prescription: false,
    },
  ],
  "Personal Care": [
    {
      id: "1",
      name: "Hand Sanitizer",
      price: "₹199",
      image: "https://via.placeholder.com/200",
      rating: 4.3,
      reviews: 3200,
      prescription: false,
    },
    {
      id: "2",
      name: "Face Wash",
      price: "₹299",
      image: "https://via.placeholder.com/200",
      rating: 4.4,
      reviews: 2800,
      prescription: false,
    },
    {
      id: "3",
      name: "Body Lotion",
      price: "₹399",
      image: "https://via.placeholder.com/200",
      rating: 4.2,
      reviews: 1900,
      prescription: false,
    },
  ],
  // Add more categories as needed
};

const CategoryProductsScreen = ({ navigation }) => {
  const route = useRoute();
  const { categoryName } = route.params;
  const dispatch = useDispatch();

  const products = CATEGORY_PRODUCTS[categoryName] || [];

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const renderProductCard = (item) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.productCard} 
      onPress={() => navigation.navigate("ProductDetails", { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>{item.price}</Text>
          {item.originalPrice && <Text style={styles.originalPrice}>{item.originalPrice}</Text>}
          {item.discount && <Text style={styles.discountLabel}>{item.discount}</Text>}
        </View>
        <View style={styles.productFooter}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{item.rating} ★</Text>
            <Text style={styles.reviews}>({item.reviews})</Text>
          </View>
          {item.prescription && (
            <View style={styles.prescriptionBadge}>
              <Text style={styles.prescriptionText}>Rx</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size={24} color="#2874f0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.productsGrid}>
          {products.map(renderProductCard)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  content: {
    flex: 1,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  productCard: {
    width: (Dimensions.get('window').width - 24) / 2,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#212121',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discountLabel: {
    fontSize: 14,
    color: '#388e3c',
    fontWeight: '500',
    marginLeft: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388e3c',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rating: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  reviews: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  prescriptionBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prescriptionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CategoryProductsScreen; 