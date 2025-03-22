import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CheckCircleIcon } from "react-native-heroicons/outline";

const OrderSuccessScreen = ({ navigation }) => {
  useEffect(() => {
    // Automatically redirect to Home after 2 seconds
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <CheckCircleIcon size={80} color="#388e3c" />
      <Text style={styles.title}>Thank You!</Text>
      <Text style={styles.message}>Your order has been placed successfully</Text>
      <Text style={styles.redirectText}>Redirecting to home...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 20,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  redirectText: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
  },
});

export default OrderSuccessScreen; 