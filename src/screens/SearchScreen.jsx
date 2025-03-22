import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { PlusIcon } from 'react-native-heroicons/outline';

// Import DUMMY_PRODUCTS from your data source or copy it here
const DUMMY_PRODUCTS = [
  {
    id: '1',
    name: 'Premium Wireless Earbuds',
    price: '₹1,499',
    originalPrice: '₹2,999',
    image: 'https://via.placeholder.com/200',
    rating: 4.5,
    reviews: 2345,
    discount: '50% off',
  },
  // ... rest of your DUMMY_PRODUCTS
];

const SearchScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = DUMMY_PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <TouchableOpacity
        style={styles.resultContent}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>{item.price}</Text>
          {item.originalPrice && (
            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>{item.originalPrice}</Text>
              <Text style={styles.discount}>{item.discount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={() => handleAddToCart(item)}
      >
        <PlusIcon size={16} color="#fff" />
        <Text style={styles.addToCartText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MagnifyingGlassIcon size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products..."
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus={true}
        />
      </View>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            {searchQuery ? 'No results found' : 'Start typing to search'}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  resultItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultContent: {
    flex: 1,
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    color: '#212121',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2874f0',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discount: {
    fontSize: 14,
    color: '#388e3c',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: '#2874f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default SearchScreen; 