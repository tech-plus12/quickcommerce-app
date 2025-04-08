import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ChevronLeftIcon, ClockIcon, ShoppingCartIcon } from 'react-native-heroicons/outline';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

const { width } = Dimensions.get('window');

const SALE_DETAILS = {
  id: 'sale1',
  title: "Special Health Package",
  endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  description: "Get amazing discounts on our premium health packages. Limited time offer!",
  products: [
    {
      id: "pkg1",
      name: "Premium Health Kit",
      price: "₹999",
      originalPrice: "₹1499",
      discount: "33% off",
      image: "https://via.placeholder.com/400",
      description: "Complete health monitoring kit with digital thermometer and blood pressure monitor",
      features: ["Digital Thermometer", "Blood Pressure Monitor", "Pulse Oximeter"],
      soldPercentage: 30,
      totalStock: 50
    },
    {
      id: "pkg2",
      name: "Wellness Package",
      price: "₹799",
      originalPrice: "₹1299",
      discount: "38% off",
      image: "https://via.placeholder.com/400",
      description: "Essential wellness products for daily health maintenance",
      features: ["Multivitamins", "Omega-3", "Probiotics"],
      soldPercentage: 45,
      totalStock: 75
    }
  ]
};

const SaleDetailsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = SALE_DETAILS.endTime - now;

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size={24} color="#2874f0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{SALE_DETAILS.title}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.timerContainer}>
          <ClockIcon size={24} color="#ff6b6b" />
          <Text style={styles.timerTitle}>Sale Ends in:</Text>
          <View style={styles.timerBoxes}>
            <View style={styles.timerBox}>
              <Text style={styles.timerValue}>{timeLeft.days}</Text>
              <Text style={styles.timerLabel}>Days</Text>
            </View>
            <Text style={styles.timerSeparator}>:</Text>
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

        <Text style={styles.description}>{SALE_DETAILS.description}</Text>

        {SALE_DETAILS.products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{product.price}</Text>
                <Text style={styles.originalPrice}>{product.originalPrice}</Text>
                <Text style={styles.discount}>{product.discount}</Text>
              </View>

              <View style={styles.featuresContainer}>
                {product.features.map((feature, index) => (
                  <Text key={index} style={styles.feature}>• {feature}</Text>
                ))}
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

              <TouchableOpacity 
                style={styles.addToCartButton}
                onPress={() => handleAddToCart(product)}
              >
                <ShoppingCartIcon size={20} color="#fff" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  timerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  timerTitle: {
    fontSize: 16,
    color: '#212121',
    marginVertical: 8,
  },
  timerBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timerBox: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    minWidth: 48,
    alignItems: 'center',
  },
  timerValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  timerLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  timerSeparator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginHorizontal: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  productCard: {
    backgroundColor: '#fff',
    marginBottom: 8,
    padding: 16,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  originalPrice: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discount: {
    fontSize: 16,
    color: '#388e3c',
    marginLeft: 8,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  feature: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  stockContainer: {
    marginBottom: 16,
  },
  stockBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  stockProgress: {
    height: '100%',
    backgroundColor: '#ff6b6b',
  },
  stockText: {
    fontSize: 12,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: '#2874f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SaleDetailsScreen; 