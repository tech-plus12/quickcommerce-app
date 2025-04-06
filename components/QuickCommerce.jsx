import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, FlatList, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    // Replace with your actual API calls
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - replace with your actual API response
      setFeaturedProducts([
        {
          id: "1",
          name: "Wireless Headphones",
          price: 129.99,
          image: "https://via.placeholder.com/150",
          discount: "20%",
        },
        {
          id: "2",
          name: "Smart Watch",
          price: 199.99,
          image: "https://via.placeholder.com/150",
        },
        {
          id: "3",
          name: "Fitness Tracker",
          price: 89.99,
          image: "https://via.placeholder.com/150",
          discount: "15%",
        },
        {
          id: "4",
          name: "Bluetooth Speaker",
          price: 79.99,
          image: "https://via.placeholder.com/150",
        },
      ]);

      setCategories([
        { id: "1", name: "Electronics", icon: "laptop" },
        { id: "2", name: "Clothing", icon: "shirt" },
        { id: "3", name: "Home", icon: "home" },
        { id: "4", name: "Beauty", icon: "brush" },
        { id: "5", name: "Sports", icon: "basketball" },
      ]);

      setLoading(false);
    } catch (error) {
            setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#777" />
        <Text style={styles.searchPlaceholder}>Search products...</Text>
      </View>
      <TouchableOpacity style={styles.cartButton} onPress={() => navigation?.navigate?.("Cart")}>
        <Icon name="cart" size={24} color="#333" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>3</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderBanner = () => (
    <View style={styles.bannerContainer}>
      <Image source={{ uri: "https://via.placeholder.com/800x300" }} style={styles.banner} resizeMode="cover" />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>Spring Sale</Text>
        <Text style={styles.bannerSubtitle}>Up to 50% off</Text>
        <TouchableOpacity style={styles.bannerButton} onPress={() => navigation?.navigate?.("Sales")}>
          <Text style={styles.bannerButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryItem} onPress={() => navigation?.navigate?.("Category", { categoryId: item.id, categoryName: item.name })}>
            <View style={styles.categoryIcon}>
              <Icon name={item.icon} size={24} color="#333" />
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderFeaturedProducts = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <TouchableOpacity onPress={() => navigation?.navigate?.("ProductList", { type: "featured" })}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={featuredProducts}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard} onPress={() => navigation?.navigate?.("ProductDetails", { productId: item.id })}>
            <View style={styles.productImageContainer}>
              <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
              {item.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{item.discount}</Text>
                </View>
              )}
            </View>
            <View style={styles.productDetails}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={(e) => {
                e.stopPropagation();
                // Add to cart functionality
              }}
            >
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderQuickAccess = () => (
    <View style={styles.quickAccessContainer}>
      <TouchableOpacity style={styles.quickAccessItem} onPress={() => navigation?.navigate?.("FlashDeals")}>
        <Icon name="flash" size={24} color="#333" />
        <Text style={styles.quickAccessText}>Flash Deals</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quickAccessItem} onPress={() => navigation?.navigate?.("NewArrivals")}>
        <Icon name="time" size={24} color="#333" />
        <Text style={styles.quickAccessText}>New Arrivals</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quickAccessItem} onPress={() => navigation?.navigate?.("Wishlist")}>
        <Icon name="heart" size={24} color="#333" />
        <Text style={styles.quickAccessText}>Wishlist</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quickAccessItem} onPress={() => navigation?.navigate?.("Rewards")}>
        <Icon name="gift" size={24} color="#333" />
        <Text style={styles.quickAccessText}>Rewards</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B37B7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderBanner()}
        {renderQuickAccess()}
        {renderCategories()}
        {renderFeaturedProducts()}

        {/* Recent Items Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Viewed</Text>
            <TouchableOpacity onPress={() => navigation?.navigate?.("RecentlyViewed")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts.slice(0, 3)}
            keyExtractor={(item) => `recent-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.productCard} onPress={() => navigation?.navigate?.("ProductDetails", { productId: item.id })}>
                <View style={styles.productImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
                </View>
                <View style={styles.productDetails}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.productPrice}>${item.price}</Text>
                </View>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    // Add to cart functionality
                  }}
                >
                  <Icon name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 10,
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: "#777",
    fontSize: 14,
  },
  cartButton: {
    marginLeft: 15,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#5B37B7",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  bannerContainer: {
    width: width,
    height: 180,
    position: "relative",
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bannerSubtitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 15,
  },
  bannerButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  quickAccessContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "space-around",
  },
  quickAccessItem: {
    alignItems: "center",
  },
  quickAccessText: {
    marginTop: 5,
    fontSize: 12,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAllText: {
    color: "#5B37B7",
    fontSize: 14,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 10,
    width: 70,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
  },
  productsContainer: {
    paddingHorizontal: 10,
  },
  productCard: {
    width: 150,
    backgroundColor: "#fff",
    marginHorizontal: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },
  productImageContainer: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#ff3d00",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  productDetails: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B37B7",
  },
  addToCartButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#5B37B7",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
