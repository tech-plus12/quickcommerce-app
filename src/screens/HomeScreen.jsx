import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  BellIcon,
  ChevronRightIcon,
} from 'react-native-heroicons/outline';

const CATEGORIES = [
  { id: '1', name: 'Fashion', icon: '👕' },
  { id: '2', name: 'Electronics', icon: '📱' },
  { id: '3', name: 'Home', icon: '🏠' },
  { id: '4', name: 'Beauty', icon: '💄' },
  { id: '5', name: 'Toys', icon: '🎮' },
];

const DEALS = [
  {
    id: '1',
    title: 'Flash Sale!',
    image: 'https://via.placeholder.com/400x200',
    discount: '50% OFF',
  },
  {
    id: '2',
    title: 'Mega Deals',
    image: 'https://via.placeholder.com/400x200',
    discount: '30% OFF',
  },
];

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
  {
    id: '2',
    name: 'Smart Watch',
    price: '₹2,999',
    image: 'https://via.placeholder.com/200',
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Running Shoes',
    price: '₹1,999',
    image: 'https://via.placeholder.com/200',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Laptop Bag',
    price: '₹899',
    image: 'https://via.placeholder.com/200',
    rating: 4.0,
  },
  {
    id: '5',
    name: 'Phone Case',
    price: '₹499',
    image: 'https://via.placeholder.com/200',
    rating: 4.3,
  },
  {
    id: '6',
    name: 'Power Bank',
    price: '₹1,299',
    image: 'https://via.placeholder.com/200',
    rating: 4.6,
  },
];

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(2);
  const [notificationCount, setNotificationCount] = useState(3);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <MagnifyingGlassIcon size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
          <BellIcon size={24} color="#fff" />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
          <ShoppingCartIcon size={24} color="#fff" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryItem}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderDeals = () => (
    <View style={styles.dealsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Deals of the Day</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRightIcon size={20} color="#2874f0" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dealsScroll}>
        {DEALS.map((deal) => (
          <TouchableOpacity key={deal.id} style={styles.dealCard}>
            <Image source={{ uri: deal.image }} style={styles.dealImage} />
            <View style={styles.dealInfo}>
              <Text style={styles.dealTitle}>{deal.title}</Text>
              <Text style={styles.dealDiscount}>{deal.discount}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderProductCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>{item.price}</Text>
          <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          <Text style={styles.discountLabel}>{item.discount}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{item.rating} ★</Text>
          <Text style={styles.reviews}>({item.reviews})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderCategories()}
        {renderDeals()}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Products</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRightIcon size={20} color="#2874f0" />
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {DUMMY_PRODUCTS.map(renderProductCard)}
          </View>
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
    padding: 16,
    backgroundColor: '#2874f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff6161',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoriesSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  categoriesScroll: {
    marginTop: 12,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
  },
  dealsSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#2874f0',
    fontSize: 14,
    fontWeight: '500',
  },
  dealsScroll: {
    marginTop: 12,
  },
  dealCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dealImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  dealInfo: {
    padding: 12,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  dealDiscount: {
    color: '#388e3c',
    fontWeight: 'bold',
  },
  productsSection: {
    padding: 16,
    backgroundColor: '#fff',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: (Dimensions.get('window').width - 40) / 2,
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
});

export default HomeScreen;
