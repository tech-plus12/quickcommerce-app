import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, FlatList, Animated, Alert } from "react-native";
import { HeartIcon, ShareIcon, ShoppingCartIcon, StarIcon, ChevronLeftIcon, ArrowUpIcon, ArrowDownIcon } from "react-native-heroicons/outline";
import { HeartIcon as SolidHeartIcon, StarIcon as SolidStarIcon } from "react-native-heroicons/solid";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import Toast from "../components/Toast";

const { width } = Dimensions.get("window");

const PRODUCT = {
  id: "1",
  name: "HealthCare Plus - Vitamin D3 1000 IU",
  price: "₹299",
  originalPrice: "₹399",
  discount: "25% off",
  rating: 4.3,
  reviews: [
    {
      id: 1,
      userName: "Rahul Sharma",
      rating: 5,
      date: "2024-03-15",
      comment: "Excellent product! I've been taking it for 3 months and noticed significant improvement in my vitamin D levels.",
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      userName: "Priya Patel",
      rating: 4,
      date: "2024-03-10",
      comment: "Good quality supplement. Easy to swallow and reasonably priced.",
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      userName: "Amit Kumar",
      rating: 5,
      date: "2024-03-05",
      comment: "Best vitamin D supplement I've used. The tablets are small and easy to take.",
      helpful: 15,
      verified: true
    },
    {
      id: 4,
      userName: "Neha Gupta",
      rating: 3,
      date: "2024-02-28",
      comment: "Product is okay, but the packaging could be better.",
      helpful: 5,
      verified: true
    }
  ],
  ratingDistribution: {
    5: 65,
    4: 20,
    3: 10,
    2: 3,
    1: 2
  },
  images: [
    "https://via.placeholder.com/400",
    "https://via.placeholder.com/400",
    "https://via.placeholder.com/400",
    "https://via.placeholder.com/400"
  ],
  description: "High-quality Vitamin D3 supplement for bone health and immune system support. Each tablet contains 1000 IU of Vitamin D3.",
  highlights: [
    "1000 IU Vitamin D3 per tablet",
    "Easy to swallow",
    "Suitable for daily use",
    "Strengthens bones and teeth",
    "Supports immune system"
  ],
  specifications: {
    "Active Ingredient": "Vitamin D3 (Cholecalciferol)",
    "Strength": "1000 IU",
    "Pack Size": "60 tablets",
    "Shelf Life": "24 months",
    "Manufacturer": "HealthCare Pharmaceuticals",
    "Prescription Required": "No"
  },
  usage: "Take one tablet daily with meals or as directed by your healthcare provider.",
  warnings: "Keep out of reach of children. Store in a cool, dry place. Do not exceed the recommended dose.",
};

const ProductDetailsScreen = ({ navigation }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'highest', 'lowest'
  const [showAllReviews, setShowAllReviews] = useState(false);

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => Math.max(1, prev + increment));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product: PRODUCT, quantity }));
    setShowToast(true);
  };

  const sortReviews = (reviews) => {
    switch (sortBy) {
      case 'newest':
        return [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'highest':
        return [...reviews].sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return [...reviews].sort((a, b) => a.rating - b.rating);
      default:
        return reviews;
    }
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUserInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified Purchase</Text>
            </View>
          )}
        </View>
        <Text style={styles.reviewDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.reviewRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          star <= item.rating ? (
            <SolidStarIcon key={star} size={16} color="#ffd700" />
          ) : (
            <StarIcon key={star} size={16} color="#ddd" />
          )
        ))}
      </View>
      
      <Text style={styles.reviewComment}>{item.comment}</Text>
      
      <View style={styles.reviewFooter}>
        <TouchableOpacity style={styles.helpfulButton}>
          <Text style={styles.helpfulText}>Helpful ({item.helpful})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportButton}>
          <Text style={styles.reportText}>Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReviewsSection = () => {
    const sortedReviews = sortReviews(PRODUCT.reviews);
    const displayReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 2);

    return (
      <View style={styles.reviewsSection}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          <View style={styles.sortContainer}>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'newest' && styles.sortButtonActive]}
              onPress={() => setSortBy('newest')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'newest' && styles.sortButtonTextActive]}>Newest</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'highest' && styles.sortButtonActive]}
              onPress={() => setSortBy('highest')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'highest' && styles.sortButtonTextActive]}>Highest</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'lowest' && styles.sortButtonActive]}
              onPress={() => setSortBy('lowest')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'lowest' && styles.sortButtonTextActive]}>Lowest</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={displayReviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.noReviewsText}>No reviews yet</Text>
          }
        />

        {!showAllReviews && PRODUCT.reviews.length > 2 && (
          <TouchableOpacity 
            style={styles.showMoreButton}
            onPress={() => setShowAllReviews(true)}
          >
            <Text style={styles.showMoreText}>Show More Reviews</Text>
          </TouchableOpacity>
        )}
      </View>
    );
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

  const renderRatingChart = () => {
    const totalReviews = Object.values(PRODUCT.ratingDistribution).reduce((a, b) => a + b, 0);
    
    return (
      <View style={styles.ratingChartContainer}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        <View style={styles.ratingSummary}>
          <View style={styles.overallRating}>
            <Text style={styles.overallRatingNumber}>{PRODUCT.rating}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  size={16}
                  color={star <= Math.floor(PRODUCT.rating) ? "#ffd700" : "#ddd"}
                />
              ))}
            </View>
            <Text style={styles.totalReviews}>{totalReviews} reviews</Text>
          </View>
          <View style={styles.ratingBars}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentage = (PRODUCT.ratingDistribution[rating] / totalReviews) * 100;
              return (
                <View key={rating} style={styles.ratingBarRow}>
                  <Text style={styles.ratingLabel}>{rating} ★</Text>
                  <View style={styles.ratingBarContainer}>
                    <View style={[styles.ratingBar, { width: `${percentage}%` }]} />
                  </View>
                  <Text style={styles.ratingCount}>{PRODUCT.ratingDistribution[rating]}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{PRODUCT.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Usage Instructions</Text>
            <Text style={styles.usageText}>{PRODUCT.usage}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Warnings</Text>
            <Text style={styles.warningText}>{PRODUCT.warnings}</Text>
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

          {renderRatingChart()}
          {renderReviewsSection()}
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
            dispatch(addToCart({ product: PRODUCT, quantity }));
            navigation.navigate('Cart');
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
  ratingChartContainer: {
    marginTop: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ratingSummary: {
    flexDirection: 'row',
    marginTop: 16,
  },
  overallRating: {
    alignItems: 'center',
    paddingRight: 24,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  overallRatingNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#212121',
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: '#666',
  },
  ratingBars: {
    flex: 1,
    marginLeft: 24,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    width: 40,
    fontSize: 12,
    color: '#666',
  },
  ratingBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    backgroundColor: '#ffd700',
    borderRadius: 4,
  },
  ratingCount: {
    width: 30,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  usageText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#ff4444',
    lineHeight: 20,
    marginBottom: 16,
  },
  reviewsSection: {
    marginTop: 24,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  sortButtonActive: {
    backgroundColor: '#2874f0',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  reviewItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#388e3c',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  helpfulButton: {
    paddingVertical: 4,
  },
  helpfulText: {
    fontSize: 12,
    color: '#666',
  },
  reportButton: {
    paddingVertical: 4,
  },
  reportText: {
    fontSize: 12,
    color: '#666',
  },
  showMoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  showMoreText: {
    fontSize: 14,
    color: '#2874f0',
    fontWeight: '500',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 24,
  },
});

export default ProductDetailsScreen;
