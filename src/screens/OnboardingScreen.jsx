import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Animated, Dimensions, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");

const dummySlides = [
  {
    id: "1",
    imageUrl: "https://img.freepik.com/free-vector/shopping-app-concept-illustration_114360-83.jpg",
    title: "Welcome to QuickShop",
    description: "Your one-stop destination for all your shopping needs",
  },
  {
    id: "2",
    imageUrl: "https://img.freepik.com/free-vector/ecommerce-web-page-concept-illustration_114360-8204.jpg",
    title: "Easy Shopping",
    description: "Browse through thousands of products with ease",
  },
  {
    id: "3",
    imageUrl: "https://img.freepik.com/free-vector/delivery-service-illustrated_23-2148505081.jpg",
    title: "Fast Delivery",
    description: "Get your orders delivered right to your doorstep",
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setSlides(dummySlides);
      setLoading(false);
    }, 1000);
  }, []);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace("Login");
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const Paginator = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return <Animated.View style={[styles.dot, { width: dotWidth, opacity }]} key={index} />;
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B37B7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setTimeout(() => {
              setSlides(dummySlides);
              setLoading(false);
            }, 1000);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#7B5AC5", "#5B37B7", "#4A2D96"]} style={styles.gradientBackground} />

      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.replace("Login")}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.flatlistContainer}>
        <FlatList
          data={slides}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <Paginator />

      <TouchableOpacity style={styles.nextButton} onPress={scrollTo}>
        <LinearGradient colors={["#7B5AC5", "#5B37B7", "#4A2D96"]} style={styles.buttonGradient}>
          <Text style={styles.nextButtonText}>{currentIndex === slides.length - 1 ? "Get Started" : "Next"}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.4,
  },
  flatlistContainer: {
    flex: 3,
  },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  image: {
    flex: 0.7,
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: "contain",
    borderRadius: 10, // Add some rounded corners
  },
  textContainer: {
    flex: 0.3,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontWeight: "300",
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 64,
  },
  paginationContainer: {
    flexDirection: "row",
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#5B37B7",
    marginHorizontal: 8,
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
  nextButton: {
    marginBottom: 30,
    width: width * 0.8,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    padding: 12,
    backgroundColor: "#5B37B7",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default OnboardingScreen;
