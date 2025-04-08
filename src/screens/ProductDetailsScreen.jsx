import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, FlatList, Animated, Alert, Modal, TextInput } from "react-native";
import { HeartIcon, ShareIcon, ShoppingCartIcon, StarIcon, ChevronLeftIcon, ArrowUpIcon, ArrowDownIcon, DocumentTextIcon, ClockIcon } from "react-native-heroicons/outline";
import { HeartIcon as SolidHeartIcon, StarIcon as SolidStarIcon, ClockIcon as SolidClockIcon } from "react-native-heroicons/solid";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { addToWatchLater, removeFromWatchLater } from "../store/watchLaterSlice";
import Toast from "../components/Toast";
import { useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// Dummy data for testing prescription UI
const DUMMY_PRODUCTS = {
  "1": {
    id: "1",
    name: "Amoxicillin 500mg",
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
        comment: "Effective antibiotic, helped with my infection.",
        helpful: 12,
        verified: true
      },
      {
        id: 2,
        userName: "Priya Patel",
        rating: 4,
        date: "2024-03-10",
        comment: "Good quality medicine, but requires prescription.",
        helpful: 8,
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
      "https://via.placeholder.com/400"
    ],
    description: "Amoxicillin is a penicillin antibiotic that fights bacteria. It is used to treat many different types of infection caused by bacteria.",
    highlights: [
      "500mg per tablet",
      "Effective against bacterial infections",
      "Prescription required",
      "Take as directed by your doctor",
      "Store in a cool, dry place"
    ],
    specifications: {
      "Active Ingredient": "Amoxicillin",
      "Strength": "500mg",
      "Pack Size": "10 tablets",
      "Shelf Life": "24 months",
      "Manufacturer": "HealthCare Pharmaceuticals",
      "Prescription Required": "Yes"
    },
    usage: "Take one tablet every 8 hours or as directed by your doctor.",
    warnings: "Do not take if allergic to penicillin. Keep out of reach of children. Store in a cool, dry place.",
    prescription: true,
  },
  "2": {
    id: "2",
    name: "Vitamin C 1000mg",
    price: "₹199",
    originalPrice: "₹299",
    discount: "33% off",
    rating: 4.5,
    reviews: [
      {
        id: 1,
        userName: "Amit Kumar",
        rating: 5,
        date: "2024-03-12",
        comment: "Great for immunity boost!",
        helpful: 15,
        verified: true
      },
      {
        id: 2,
        userName: "Neha Gupta",
        rating: 4,
        date: "2024-03-08",
        comment: "Good quality vitamin supplement.",
        helpful: 10,
        verified: true
      }
    ],
    ratingDistribution: {
      5: 70,
      4: 25,
      3: 3,
      2: 1,
      1: 1
    },
    images: [
      "https://via.placeholder.com/400",
      "https://via.placeholder.com/400"
    ],
    description: "High-quality Vitamin C supplement for immune system support. Each tablet contains 1000mg of Vitamin C.",
    highlights: [
      "1000mg Vitamin C per tablet",
      "No prescription required",
      "Supports immune system",
      "Antioxidant properties",
      "Easy to swallow"
    ],
    specifications: {
      "Active Ingredient": "Vitamin C (Ascorbic Acid)",
      "Strength": "1000mg",
      "Pack Size": "60 tablets",
      "Shelf Life": "24 months",
      "Manufacturer": "HealthCare Pharmaceuticals",
      "Prescription Required": "No"
    },
    usage: "Take one tablet daily with meals or as directed by your healthcare provider.",
    warnings: "Keep out of reach of children. Store in a cool, dry place.",
    prescription: false,
  },
  "3": {
    id: "3",
    name: "Azithromycin 250mg",
    price: "₹349",
    originalPrice: "₹449",
    discount: "22% off",
    rating: 4.2,
    reviews: [
      {
        id: 1,
        userName: "Suresh Kumar",
        rating: 5,
        date: "2024-03-14",
        comment: "Effective for respiratory infections.",
        helpful: 18,
        verified: true
      },
      {
        id: 2,
        userName: "Meena Patel",
        rating: 4,
        date: "2024-03-09",
        comment: "Works well, but requires prescription.",
        helpful: 9,
        verified: true
      }
    ],
    ratingDistribution: {
      5: 60,
      4: 25,
      3: 10,
      2: 3,
      1: 2
    },
    images: [
      "https://via.placeholder.com/400",
      "https://via.placeholder.com/400"
    ],
    description: "Azithromycin is a macrolide antibiotic used to treat various bacterial infections.",
    highlights: [
      "250mg per tablet",
      "Effective against bacterial infections",
      "Prescription required",
      "Take as directed by your doctor",
      "Store in a cool, dry place"
    ],
    specifications: {
      "Active Ingredient": "Azithromycin",
      "Strength": "250mg",
      "Pack Size": "6 tablets",
      "Shelf Life": "24 months",
      "Manufacturer": "HealthCare Pharmaceuticals",
      "Prescription Required": "Yes"
    },
    usage: "Take one tablet daily or as directed by your doctor.",
    warnings: "Do not take if allergic to macrolide antibiotics. Keep out of reach of children. Store in a cool, dry place.",
    prescription: true,
  }
};

const ProductDetailsScreen = ({ navigation }) => {
  const route = useRoute();
  const { productId } = route.params;
  
  // Get the product from DUMMY_PRODUCTS based on the productId
  const product = DUMMY_PRODUCTS[productId];
  
  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const watchLaterItems = useSelector((state) => state.watchLater.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [sortBy, setSortBy] = useState('newest');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    userName: 'Anonymous User'
  });

  const isInWatchLater = watchLaterItems.some(item => item.id === product.id);

  const handleWatchLater = () => {
    if (isInWatchLater) {
      dispatch(removeFromWatchLater({ productId: product.id }));
      setToastMessage("Removed from Watch Later");
    } else {
      dispatch(addToWatchLater({ product }));
      setToastMessage("Added to Watch Later");
    }
    setShowToast(true);
  };

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => Math.max(1, prev + increment));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    setToastMessage(`${quantity} item${quantity > 1 ? "s" : ""} added to cart`);
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

  const handleSubmitReview = () => {
    if (!reviewForm.comment.trim()) {
      Alert.alert('Error', 'Please enter your review comment');
      return;
    }

    const newReview = {
      id: product.reviews.length + 1,
      userName: reviewForm.userName,
      rating: reviewForm.rating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewForm.comment,
      helpful: 0,
      verified: true
    };

    // In a real app, you would make an API call here to save the review
    Alert.alert(
      'Success',
      'Thank you for your review!',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowReviewModal(false);
            setReviewForm({
              rating: 5,
              comment: '',
              userName: 'Anonymous User'
            });
          }
        }
      ]
    );
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
    const sortedReviews = sortReviews(product.reviews);
    const displayReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 2);

    return (
      <View style={styles.reviewsSection}>
        <View style={styles.reviewsHeader}>
          <View style={styles.reviewsHeaderTop}>
            <Text style={styles.sectionTitle}>Customer Reviews</Text>
            <TouchableOpacity
              style={styles.writeReviewButton}
              onPress={() => setShowReviewModal(true)}
            >
              <Text style={styles.writeReviewButtonText}>Write a Review</Text>
            </TouchableOpacity>
          </View>
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

        {!showAllReviews && product.reviews.length > 2 && (
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
        data={product.images}
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
        {product.images.map((_, index) => (
          <View key={index} style={[styles.paginationDot, index === activeImageIndex && styles.paginationDotActive]} />
        ))}
      </View>

      {/* Thumbnail Preview */}
      <View style={styles.thumbnailContainer}>
        <FlatList
          data={product.images}
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
    const totalReviews = Object.values(product.ratingDistribution).reduce((a, b) => a + b, 0);
    
    return (
      <View style={styles.ratingChartContainer}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        <View style={styles.ratingSummary}>
          <View style={styles.overallRating}>
            <Text style={styles.overallRatingNumber}>{product.rating}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  size={16}
                  color={star <= Math.floor(product.rating) ? "#ffd700" : "#ddd"}
                />
              ))}
            </View>
            <Text style={styles.totalReviews}>{totalReviews} reviews</Text>
          </View>
          <View style={styles.ratingBars}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentage = (product.ratingDistribution[rating] / totalReviews) * 100;
              return (
                <View key={rating} style={styles.ratingBarRow}>
                  <Text style={styles.ratingLabel}>{rating} ★</Text>
                  <View style={styles.ratingBarContainer}>
                    <View style={[styles.ratingBar, { width: `${percentage}%` }]} />
                  </View>
                  <Text style={styles.ratingCount}>{product.ratingDistribution[rating]}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderReviewModal = () => (
    <Modal
      visible={showReviewModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowReviewModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Write a Review</Text>
            <TouchableOpacity onPress={() => setShowReviewModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ratingInput}>
            <Text style={styles.ratingLabel}>Your Rating:</Text>
            <View style={styles.starsInput}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setReviewForm({ ...reviewForm, rating: star })}
                >
                  {star <= reviewForm.rating ? (
                    <SolidStarIcon size={32} color="#ffd700" />
                  ) : (
                    <StarIcon size={32} color="#ddd" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TextInput
            style={styles.reviewInput}
            multiline
            numberOfLines={4}
            placeholder="Write your review here..."
            value={reviewForm.comment}
            onChangeText={(text) => setReviewForm({ ...reviewForm, comment: text })}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitReview}
          >
            <Text style={styles.submitButtonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderPrescriptionInfo = () => {
    if (product.prescription) {
      return (
        <View style={styles.prescriptionInfo}>
          <DocumentTextIcon size={20} color="#ff4444" />
          <Text style={styles.prescriptionText}>Prescription Required</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Toast message={toastMessage} isVisible={showToast} onHide={() => setShowToast(false)} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ChevronLeftIcon size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleWatchLater} style={styles.headerButton}>
            {isInWatchLater ? (
              <SolidClockIcon size={24} color="#2874f0" />
            ) : (
              <ClockIcon size={24} color="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.headerButton}>
            {isFavorite ? <SolidHeartIcon size={24} color="#ff4444" /> : <HeartIcon size={24} color="#fff" />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <ShoppingCartIcon size={24} color="#fff" />
            {cartCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <ShareIcon size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImageCarousel()}

        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          {renderPrescriptionInfo()}

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{product.price}</Text>
            {product.originalPrice && <Text style={styles.originalPrice}>{product.originalPrice}</Text>}
            {product.discount && <Text style={styles.discount}>{product.discount}</Text>}
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
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Usage Instructions</Text>
            <Text style={styles.usageText}>{product.usage}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Warnings</Text>
            <Text style={styles.warningText}>{product.warnings}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            {product.highlights.map((highlight, index) => (
              <Text key={index} style={styles.highlightItem}>
                • {highlight}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            {Object.entries(product.specifications).map(([key, value]) => (
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
            dispatch(addToCart({ product, quantity }));
            navigation.navigate('Cart');
          }}
        >
          <Text style={styles.bottomButtonText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
      {renderReviewModal()}
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
    marginBottom: 16,
  },
  reviewsHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  writeReviewButton: {
    backgroundColor: '#2874f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  writeReviewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
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
    fontSize: 24,
    color: '#666',
  },
  ratingInput: {
    marginBottom: 20,
  },
  starsInput: {
    flexDirection: 'row',
    gap: 8,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#2874f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerBadge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  prescriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3f3',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  prescriptionText: {
    color: '#ff4444',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default ProductDetailsScreen;
