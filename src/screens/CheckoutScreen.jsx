import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { MapPinIcon, CreditCardIcon, BanknotesIcon, QrCodeIcon, ChevronRightIcon, ShieldCheckIcon } from "react-native-heroicons/outline";
import { useSelector, useDispatch } from "react-redux";
import { getCartTotal, clearCart } from '../store/cartSlice';

const ADDRESSES = [
  {
    id: "1",
    type: "Home",
    name: "John Doe",
    address: "123 Main Street, Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    phone: "+91 98765 43210",
    isDefault: true,
  },
  // Add more addresses as needed
];

const PAYMENT_METHODS = [
  {
    id: "upi",
    title: "UPI / QR Code",
    icon: QrCodeIcon,
    description: "Pay using any UPI app",
  },
  {
    id: "card",
    title: "Credit / Debit Card",
    icon: CreditCardIcon,
    description: "All major cards accepted",
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    icon: BanknotesIcon,
    description: "Pay when you receive",
  },
];

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector(getCartTotal);

  const [selectedAddress, setSelectedAddress] = useState(ADDRESSES[0]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Calculate totals
  const itemTotal = cartTotal;
  const deliveryFee = 40;
  const discount = 100;
  const finalTotal = itemTotal + deliveryFee - discount;

  const renderOrderSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.summaryContainer}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.summaryItem}>
            <Image source={{ uri: item.image }} style={styles.summaryImage} />
            <View style={styles.summaryItemDetails}>
              <Text style={styles.summaryItemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.summaryItemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.summaryItemPrice}>{formatPrice(item.numericPrice * item.quantity)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Item Total</Text>
          <Text style={styles.priceValue}>{formatPrice(itemTotal)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Delivery</Text>
          <Text style={styles.priceValue}>{formatPrice(deliveryFee)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Discount</Text>
          <Text style={[styles.priceValue, styles.discountText]}>-{formatPrice(discount)}</Text>
        </View>
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{formatPrice(finalTotal)}</Text>
        </View>
      </View>
    </View>
  );

  const renderAddressSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      <TouchableOpacity
        style={styles.addressCard}
        onPress={() => {
          /* Navigate to address selection */
        }}
      >
        <MapPinIcon size={24} color="#2874f0" />
        <View style={styles.addressInfo}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressType}>{selectedAddress.type}</Text>
            {selectedAddress.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
          <Text style={styles.addressName}>{selectedAddress.name}</Text>
          <Text style={styles.addressText}>{selectedAddress.address}</Text>
          <Text style={styles.addressText}>
            {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
          </Text>
          <Text style={styles.addressPhone}>{selectedAddress.phone}</Text>
        </View>
        <ChevronRightIcon size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderPaymentMethods = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      {PAYMENT_METHODS.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[styles.paymentOption, selectedPayment === method.id && styles.selectedPayment]}
          onPress={() => setSelectedPayment(method.id)}
        >
          <method.icon size={24} color="#2874f0" />
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>{method.title}</Text>
            <Text style={styles.paymentDescription}>{method.description}</Text>
          </View>
          <View style={[styles.radioButton, selectedPayment === method.id && styles.radioButtonSelected]} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const handlePlaceOrder = () => {
    // Add any order processing logic here
    
    // Clear the cart
    dispatch(clearCart());
    
    // Navigate to success screen
    navigation.navigate('OrderSuccess');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderOrderSummary()}
        {renderAddressSection()}
        {renderPaymentMethods()}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.secureInfo}>
          <ShieldCheckIcon size={20} color="#388e3c" />
          <Text style={styles.secureText}>100% Payment Protection</Text>
        </View>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>Place Order • {formatPrice(finalTotal)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "#fff",
    marginBottom: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 16,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  summaryItemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  summaryItemName: {
    fontSize: 14,
    color: "#212121",
  },
  summaryItemQuantity: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
  },
  priceBreakdown: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceValue: {
    fontSize: 14,
    color: "#212121",
  },
  discountText: {
    color: "#388e3c",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  addressInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  addressType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
  },
  defaultBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 12,
    color: "#388e3c",
  },
  addressName: {
    fontSize: 14,
    color: "#212121",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedPayment: {
    backgroundColor: "#f8f8f8",
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#212121",
  },
  paymentDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#bdbdbd",
  },
  radioButtonSelected: {
    borderColor: "#2874f0",
    backgroundColor: "#2874f0",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  secureInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  secureText: {
    fontSize: 12,
    color: "#388e3c",
    marginLeft: 4,
  },
  placeOrderButton: {
    backgroundColor: "#fb641b",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CheckoutScreen;
