import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { MagnifyingGlassIcon, ShoppingCartIcon, BellIcon, ChevronRightIcon, PlusIcon, ClockIcon, FireIcon } from "react-native-heroicons/outline";
import { FireIcon as SolidFireIcon } from "react-native-heroicons/solid";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { addToWatchLater } from "../store/watchLaterSlice";

const CATEGORIES = [
  { id: "1", name: "Medicines", icon: "💊" },
  { id: "2", name: "Vitamins", icon: "🥛" },
  { id: "3", name: "Personal Care", icon: "🧴" },
  { id: "4", name: "Health Devices", icon: "🩺" },
  { id: "5", name: "First Aid", icon: "🏥" },
  { id: "6", name: "Baby Care", icon: "👶" },
  { id: "7", name: "Ayurveda", icon: "🌿" },
  { id: "8", name: "Health Food", icon: "🥗" },
];

const DEALS = [
  {
    id: "1",
    title: "Health Checkup Kits",
    image: "https://via.placeholder.com/400x200",
    discount: "20% OFF",
    description: "Complete health screening kits at special prices",
    tag: "Best Seller",
  },
  {
    id: "2",
    title: "Vitamin Supplements",
    image: "https://via.placeholder.com/400x200",
    discount: "15% OFF",
    description: "Premium vitamins and supplements",
    tag: "Limited Time",
  },
  {
    id: "3",
    title: "First Aid Kits",
    image: "https://via.placeholder.com/400x200",
    discount: "25% OFF",
    description: "Essential first aid supplies",
    tag: "Popular",
  },
  {
    id: "4",
    title: "Personal Care",
    image: "https://via.placeholder.com/400x200",
    discount: "30% OFF",
    description: "Daily personal care products",
    tag: "New",
  },
];

const HEALTH_TIPS = [
  {
    id: "1",
    title: "Stay Hydrated",
    description: "Drink 8 glasses of water daily",
    icon: "💧",
  },
  {
    id: "2",
    title: "Regular Exercise",
    description: "30 minutes of daily activity",
    icon: "🏃",
  },
  {
    id: "3",
    title: "Healthy Diet",
    description: "Eat balanced meals",
    icon: "🥗",
  },
  {
    id: "4",
    title: "Sleep Well",
    description: "7-8 hours of quality sleep",
    icon: "😴",
  },
];

const DUMMY_PRODUCTS = [
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
    name: "Vitamin C 1000mg",
    price: "₹299",
    image: "https://via.placeholder.com/200",
    rating: 4.2,
    prescription: false,
  },
  {
    id: "3",
    name: "Blood Pressure Monitor",
    price: "₹1,999",
    image: "https://via.placeholder.com/200",
    rating: 4.7,
    prescription: false,
  },
  {
    id: "4",
    name: "First Aid Kit",
    price: "₹899",
    image: "https://via.placeholder.com/200",
    rating: 4.0,
    prescription: false,
  },
  {
    id: "5",
    name: "Hand Sanitizer",
    price: "₹199",
    image: "https://via.placeholder.com/200",
    rating: 4.3,
    prescription: false,
  },
  {
    id: "6",
    name: "Digital Thermometer",
    price: "₹299",
    image: "https://via.placeholder.com/200",
    rating: 4.6,
    prescription: false,
  },
];

const FLASH_SALE = {
  title: "Flash Sale",
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  products: [
    {
      id: "flash1",
      name: "Vitamin D3 1000 IU",
      price: "₹199",
      originalPrice: "₹299",
      discount: "33% off",
      image: "https://via.placeholder.com/200",
      soldPercentage: 75,
      totalStock: 100
    },
    {
      id: "flash2",
      name: "Multivitamin Tablets",
      price: "₹399",
      originalPrice: "₹599",
      discount: "33% off",
      image: "https://via.placeholder.com/200",
      soldPercentage: 60,
      totalStock: 100
    },
    {
      id: "flash3",
      name: "Protein Powder",
      price: "₹799",
      originalPrice: "₹999",
      discount: "20% off",
      image: "https://via.placeholder.com/200",
      soldPercentage: 45,
      totalStock: 100
    }
  ]
};

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(2);
  const [notificationCount, setNotificationCount] = useState(3);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = FLASH_SALE.endTime - now;

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    setIsSearching(!!text);

    if (text.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = DUMMY_PRODUCTS.filter((product) => product.name.toLowerCase().includes(text.toLowerCase()));
    setSearchResults(results);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleAddToWatchLater = (product) => {
    dispatch(addToWatchLater({ product }));
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <MagnifyingGlassIcon size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products..."
          value={searchQuery}
          onChangeText={handleSearch}
          onFocus={() => navigation.navigate("Search")}
        />
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => navigation.navigate("WatchLater")}
        >
          <ClockIcon size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => navigation.navigate("Notifications")}
        >
          <BellIcon size={24} color="#fff" />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => navigation.navigate("Cart")}
        >
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
          <TouchableOpacity 
            key={category.id} 
            style={styles.categoryItem}
            onPress={() => navigation.navigate('CategoryProducts', { categoryName: category.name })}
          >
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
        <Text style={styles.sectionTitle}>Health Promotions</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('HealthPromotions')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRightIcon size={20} color="#2874f0" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dealsScroll}>
        {DEALS.map((deal) => (
          <TouchableOpacity 
            key={deal.id} 
            style={styles.dealCard}
            onPress={() => navigation.navigate('PromotionDetails', { 
              promotion: {
                ...deal,
                validUntil: "31 Dec 2024",
                terms: "Valid on all products in this category"
              }
            })}
          >
            <Image source={{ uri: deal.image }} style={styles.dealImage} />
            <View style={styles.dealInfo}>
              <Text style={styles.dealTitle}>{deal.title}</Text>
              <Text style={styles.dealDescription}>{deal.description}</Text>
              <View style={styles.dealFooter}>
                <Text style={styles.dealDiscount}>{deal.discount}</Text>
                <View style={styles.dealTag}>
                  <Text style={styles.dealTagText}>{deal.tag}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderHealthTips = () => (
    <View style={styles.healthTipsSection}>
      <Text style={styles.sectionTitle}>Health Tips</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.healthTipsScroll}>
        {HEALTH_TIPS.map((tip) => (
          <View key={tip.id} style={styles.healthTipCard}>
            <Text style={styles.healthTipIcon}>{tip.icon}</Text>
            <Text style={styles.healthTipTitle}>{tip.title}</Text>
            <Text style={styles.healthTipDescription}>{tip.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

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
          <TouchableOpacity 
            style={styles.watchLaterButton}
            onPress={() => handleAddToWatchLater(item)}
          >
            <ClockIcon size={20} color="#2874f0" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSearchResults = () => (
    <View style={styles.searchResultsContainer}>
      {searchResults.map((item) => (
        <View key={item.id} style={styles.searchResultItem}>
          <TouchableOpacity style={styles.searchResultContent} onPress={() => navigation.navigate("ProductDetails", { product: item })}>
            <Image source={{ uri: item.image }} style={styles.searchResultImage} />
            <View style={styles.searchResultInfo}>
              <Text style={styles.searchResultName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.searchResultPrice}>{item.price}</Text>
              {item.originalPrice && <Text style={styles.searchResultOriginalPrice}>{item.originalPrice}</Text>}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(item)}>
            <PlusIcon size={16} color="#fff" />
            <Text style={styles.addToCartText}>Add</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderFlashSale = () => (
    <View style={styles.flashSaleContainer}>
      <View style={styles.flashSaleHeader}>
        <View style={styles.flashSaleTitleContainer}>
          <SolidFireIcon size={24} color="#ff4444" />
          <Text style={styles.flashSaleTitle}>Flash Sale</Text>
        </View>
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownLabel}>Ends in:</Text>
          <View style={styles.countdownTimer}>
            <View style={styles.timerBox}>
              <Text style={styles.timerValue}>{timeLeft.hours.toString().padStart(2, '0')}</Text>
              <Text style={styles.timerLabel}>Hrs</Text>
            </View>
            <Text style={styles.timerSeparator}>:</Text>
            <View style={styles.timerBox}>
              <Text style={styles.timerValue}>{timeLeft.minutes.toString().padStart(2, '0')}</Text>
              <Text style={styles.timerLabel}>Min</Text>
            </View>
            <Text style={styles.timerSeparator}>:</Text>
            <View style={styles.timerBox}>
              <Text style={styles.timerValue}>{timeLeft.seconds.toString().padStart(2, '0')}</Text>
              <Text style={styles.timerLabel}>Sec</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.flashSaleScroll}
      >
        {FLASH_SALE.products.map((product) => (
          <TouchableOpacity 
            key={product.id}
            style={styles.flashSaleCard}
            onPress={() => navigation.navigate("ProductDetails", { product })}
          >
            <Image source={{ uri: product.image }} style={styles.flashSaleImage} />
            <View style={styles.flashSaleInfo}>
              <Text style={styles.flashSaleProductName} numberOfLines={2}>
                {product.name}
              </Text>
              <View style={styles.flashSalePriceContainer}>
                <Text style={styles.flashSalePrice}>{product.price}</Text>
                <Text style={styles.flashSaleOriginalPrice}>{product.originalPrice}</Text>
                <Text style={styles.flashSaleDiscount}>{product.discount}</Text>
              </View>
              <View style={styles.stockContainer}>
                <View style={styles.stockBar}>
                  <View 
                    style={[
                      styles.stockProgress, 
                      { width: `${product.soldPercentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.stockText}>
                  {product.totalStock - (product.totalStock * product.soldPercentage / 100)} left
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {isSearching ? (
          searchResults.length > 0 ? (
            renderSearchResults()
          ) : (
            <Text style={styles.noResultsText}>No products found</Text>
          )
        ) : (
          <>
            {renderFlashSale()}
            {renderCategories()}
            {renderDeals()}
            {renderHealthTips()}
            <View style={styles.productsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Featured Products</Text>
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <ChevronRightIcon size={20} color="#2874f0" />
                </TouchableOpacity>
              </View>
              <View style={styles.productsGrid}>{DUMMY_PRODUCTS.map(renderProductCard)}</View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#2874f0",
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
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
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ff6161",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  categoriesSection: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  categoriesScroll: {
    marginTop: 12,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 24,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: "#666",
  },
  dealsSection: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    color: "#2874f0",
    fontSize: 14,
    fontWeight: "500",
  },
  dealsScroll: {
    marginTop: 12,
  },
  dealCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dealImage: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  dealInfo: {
    padding: 12,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  dealDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  dealFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dealDiscount: {
    color: "#388e3c",
    fontWeight: "bold",
  },
  dealTag: {
    backgroundColor: "#2874f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dealTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  healthTipsSection: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  healthTipsScroll: {
    marginTop: 12,
  },
  healthTipCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  healthTipIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  healthTipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },
  healthTipDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  productsSection: {
    padding: 16,
    backgroundColor: "#fff",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: (Dimensions.get("window").width - 40) / 2,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#212121",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
  },
  originalPrice: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  discountLabel: {
    fontSize: 14,
    color: "#388e3c",
    fontWeight: "500",
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#388e3c",
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rating: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  reviews: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
  searchResultsContainer: {
    backgroundColor: "#fff",
    padding: 12,
  },
  searchResultContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  searchResultItem: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  searchResultInfo: {
    marginLeft: 12,
    flex: 1,
  },
  searchResultName: {
    fontSize: 14,
    color: "#212121",
  },
  searchResultPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2874f0",
    marginTop: 4,
  },
  searchResultOriginalPrice: {
    fontSize: 12,
    color: "#666",
    textDecorationLine: "line-through",
    marginTop: 2,
  },
  addToCartButton: {
    backgroundColor: "#2874f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  noResultsText: {
    textAlign: "center",
    padding: 20,
    color: "#666",
    fontSize: 16,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  watchLaterButton: {
    padding: 8,
    backgroundColor: '#f0f7ff',
    borderRadius: 20,
  },
  flashSaleContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
  },
  flashSaleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  flashSaleTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  flashSaleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
    marginLeft: 8,
  },
  countdownContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countdownLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  countdownTimer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerBox: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 40,
    alignItems: "center",
  },
  timerValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff4444",
  },
  timerLabel: {
    fontSize: 12,
    color: "#666",
  },
  timerSeparator: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff4444",
    marginHorizontal: 4,
  },
  flashSaleScroll: {
    marginTop: 8,
  },
  flashSaleCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  flashSaleImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  flashSaleInfo: {
    padding: 12,
  },
  flashSaleProductName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#212121",
    marginBottom: 8,
  },
  flashSalePriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  flashSalePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff4444",
  },
  flashSaleOriginalPrice: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  flashSaleDiscount: {
    fontSize: 14,
    color: "#388e3c",
    fontWeight: "500",
    marginLeft: 8,
  },
  stockContainer: {
    marginTop: 8,
  },
  stockBar: {
    height: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    overflow: "hidden",
  },
  stockProgress: {
    height: "100%",
    backgroundColor: "#ff4444",
    borderRadius: 2,
  },
  stockText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});

export default HomeScreen;
