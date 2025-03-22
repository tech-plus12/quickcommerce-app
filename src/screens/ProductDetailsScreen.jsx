import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, FlatList, Animated, Alert } from "react-native";
import { HeartIcon, ShareIcon, ShoppingCartIcon, StarIcon, ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon as SolidHeartIcon } from "react-native-heroicons/solid";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import Toast from "../components/Toast";

const { width } = Dimensions.get("window");

const PRODUCT = {
  id: "1",
  name: "Premium Wireless Earbuds",
  price: "₹1,499",
  originalPrice: "₹2,999",
  discount: "50% off",
  rating: 4.5,
  reviews: 2345,
  images: ["https://via.placeholder.com/400", "https://via.placeholder.com/400", "https://via.placeholder.com/400", "https://via.placeholder.com/400"],
  description: "High-quality wireless earbuds with noise cancellation and premium sound quality.",
  highlights: ["Active Noise Cancellation", "24-hour battery life", "Premium sound quality", "Touch controls", "Voice assistant support"],
  specifications: {
    "Battery Life": "24 hours",
    "Bluetooth Version": "5.0",
    "Charging Time": "2 hours",
    Weight: "58g",
    Warranty: "1 year",
  },
};

const ProductDetailsScreen = ({ navigation }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => Math.max(1, prev + increment));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product: PRODUCT, quantity }));
    setShowToast(true);
  };

  const renderImageCarousel = () => (
    <View style={styles.carouselContainer}>
      <Animated.FlatList
        ref={flatListRef}
        data={PRODUCT.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveImageIndex(newIndex);
        }}
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.productImage} resizeMode="cover" />}
        keyExtractor={(_, index) => index.toString()}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {PRODUCT.images.map((_, index) => (
          <View key={index} style={[styles.paginationDot, index === activeImageIndex && styles.paginationDotActive]} />
        ))}
      </View>

      {/* Thumbnail Preview */}
      <View style={styles.thumbnailContainer}>
        <FlatList
          data={PRODUCT.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                setActiveImageIndex(index);
                flatListRef.current?.scrollToOffset({
                  offset: index * width,
                  animated: true,
                });
              }}
            >
              <Image source={{ uri: item }} style={[styles.thumbnail, index === activeImageIndex && styles.thumbnailActive]} />
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => `thumb-${index}`}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Toast message={`${quantity} item${quantity > 1 ? "s" : ""} added to cart`} isVisible={showToast} onHide={() => setShowToast(false)} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ChevronLeftIcon size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.headerButton}>
            {isFavorite ? <SolidHeartIcon size={24} color="#ff4444" /> : <HeartIcon size={24} color="#fff" />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <ShareIcon size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImageCarousel()}

        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{PRODUCT.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{PRODUCT.price}</Text>
            <Text style={styles.originalPrice}>{PRODUCT.originalPrice}</Text>
            <Text style={styles.discount}>{PRODUCT.discount}</Text>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(-1)}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(1)}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{PRODUCT.rating} ★</Text>
            </View>
            <Text style={styles.reviewCount}>{PRODUCT.reviews.toLocaleString()} Reviews</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            {PRODUCT.highlights.map((highlight, index) => (
              <Text key={index} style={styles.highlightItem}>
                • {highlight}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            {Object.entries(PRODUCT.specifications).map(([key, value]) => (
              <View key={key} style={styles.specificationRow}>
                <Text style={styles.specificationKey}>{key}</Text>
                <Text style={styles.specificationValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.bottomButton, styles.addToCartButton]} onPress={handleAddToCart}>
          <ShoppingCartIcon size={24} color="#fff" />
          <Text style={styles.bottomButtonText}>ADD TO CART</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomButton, styles.buyNowButton]}
          onPress={() => {
            /* Handle buy now */
          }}
        >
          <Text style={styles.bottomButtonText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 48,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: "row",
  },
  carouselContainer: {
    height: width,
    backgroundColor: "#f5f5f5",
  },
  productImage: {
    width: width,
    height: width,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#2874f0",
    width: 20,
  },
  thumbnailContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 8,
  },
  thumbnailList: {
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  thumbnailActive: {
    borderColor: "#2874f0",
    borderWidth: 2,
  },
  detailsContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
  },
  originalPrice: {
    fontSize: 18,
    color: "#666",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  discount: {
    fontSize: 16,
    color: "#388e3c",
    fontWeight: "500",
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingBadge: {
    backgroundColor: "#388e3c",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  ratingText: {
    color: "#fff",
    fontWeight: "500",
  },
  reviewCount: {
    color: "#666",
    fontSize: 14,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 12,
  },
  highlightItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  specificationRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  specificationKey: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  specificationValue: {
    flex: 2,
    fontSize: 14,
    color: "#212121",
  },
  bottomBar: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  bottomButton: {
    flex: 1,
    flexDirection: "row",
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  addToCartButton: {
    backgroundColor: "#ff9f00",
  },
  buyNowButton: {
    backgroundColor: "#fb641b",
  },
  bottomButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    color: "#212121",
    marginRight: 16,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  quantityButtonText: {
    fontSize: 20,
    color: "#2874f0",
    fontWeight: "600",
  },
  quantityValue: {
    width: 40,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
});

export default ProductDetailsScreen;
