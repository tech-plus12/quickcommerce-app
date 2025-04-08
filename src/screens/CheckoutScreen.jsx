import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { MapPinIcon, CreditCardIcon, BanknotesIcon, QrCodeIcon, ChevronRightIcon, ShieldCheckIcon, DocumentTextIcon, HomeIcon } from "react-native-heroicons/outline";
import { useSelector, useDispatch } from "react-redux";
import { getCartTotal, clearCart, getPrescriptionItems } from '../store/cartSlice';
import { addOrder } from '../store/orderHistorySlice';
import PrescriptionUploadModal from '../components/PrescriptionUploadModal';

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
  const prescriptionItems = useSelector(getPrescriptionItems);
  const cartTotal = useSelector(getCartTotal);
  const [selectedAddress, setSelectedAddress] = useState(ADDRESSES[0]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Calculate totals
  const itemTotal = cartTotal;
  const deliveryFee = 40;
  const discount = 100;
  const finalTotal = itemTotal + deliveryFee - discount;

  const handleUploadPrescription = (product) => {
    setSelectedProduct(product);
    setShowPrescriptionModal(true);
  };

  const handlePlaceOrder = () => {
    // Check if all prescription items have been uploaded
    const pendingPrescriptions = prescriptionItems.filter(
      item => item.prescriptionStatus !== 'uploaded' && item.prescriptionStatus !== 'approved'
    );

    if (pendingPrescriptions.length > 0) {
      Alert.alert(
        'Prescription Required',
        'Please upload prescriptions for all required items before placing the order.',
        [
          {
            text: 'Upload Now',
            onPress: () => handleUploadPrescription(pendingPrescriptions[0].product)
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
      return;
    }

    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    // Create order object with all necessary details
    const order = {
      id: Date.now().toString(),
      orderNumber: `ORD${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      total: finalTotal,
      status: 'pending',
      paymentMethod: selectedPayment,
      deliveryAddress: selectedAddress,
      items: cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: parseFloat(item.product.price.replace('₹', '')),
        image: item.product.image,
        prescription: item.product.prescription,
        prescriptionStatus: item.prescriptionStatus,
        prescriptionImage: item.prescriptionImage
      })),
      tracking: {
        status: 'pending',
        steps: [
          { title: 'Order Placed', completed: true },
          { title: 'Processing', completed: false },
          { title: 'Shipped', completed: false },
          { title: 'Delivered', completed: false },
        ],
      },
    };

    // Add order to order history
    dispatch(addOrder(order));
    
    // Clear the cart
    dispatch(clearCart());
    
    // Navigate to success screen
    navigation.navigate('OrderSuccess');
  };

  const renderOrderSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.summaryContainer}>
        {cartItems.map((item, index) => (
          <View key={`order-item-${item.product.id}-${index}`} style={styles.summaryItem}>
            <Image 
              source={{ uri: item.product.image }} 
              style={styles.summaryImage}
            />
            <View style={styles.summaryItemDetails}>
              <Text style={styles.summaryItemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.summaryItemQuantity}>Qty: {item.quantity}</Text>
              {item.product.prescription && (
                <View style={[
                  styles.prescriptionStatus,
                  item.prescriptionStatus === 'uploaded' && styles.prescriptionStatusUploaded
                ]}>
                  <DocumentTextIcon 
                    size={16} 
                    color={item.prescriptionStatus === 'uploaded' ? '#388e3c' : '#ff4444'} 
                  />
                  <Text style={[
                    styles.prescriptionStatusText,
                    item.prescriptionStatus === 'uploaded' && styles.prescriptionStatusTextUploaded
                  ]}>
                    {item.prescriptionStatus === 'uploaded' ? 'Prescription Uploaded' : 'Prescription Required'}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.summaryItemPrice}>
              ₹{(parseFloat(item.product.price.replace('₹', '')) * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {prescriptionItems.length > 0 && (
        <View style={styles.prescriptionSection}>
          <View style={styles.prescriptionHeader}>
            <DocumentTextIcon size={24} color="#ff4444" />
            <Text style={styles.prescriptionTitle}>Upload Prescriptions</Text>
          </View>
          <Text style={styles.prescriptionSubtitle}>
            Please upload valid prescriptions for the following items:
          </Text>
          {prescriptionItems.map((item, index) => (
            <View key={`prescription-${item.product.id}-${index}`} style={styles.prescriptionItem}>
              <View style={styles.prescriptionItemInfo}>
                <Text style={styles.prescriptionItemName}>{item.product.name}</Text>
                <Text style={styles.prescriptionItemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  item.prescriptionStatus === 'uploaded' && styles.uploadButtonSuccess
                ]}
                onPress={() => handleUploadPrescription(item.product)}
                disabled={item.prescriptionStatus === 'uploaded'}
              >
                <DocumentTextIcon 
                  size={16} 
                  color={item.prescriptionStatus === 'uploaded' ? '#fff' : '#fff'} 
                />
                <Text style={styles.uploadButtonText}>
                  {item.prescriptionStatus === 'uploaded' ? 'Prescription Added' : 'Upload Prescription'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

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

      {selectedProduct && (
        <PrescriptionUploadModal
          visible={showPrescriptionModal}
          onClose={() => {
            setShowPrescriptionModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onUpload={() => {
            setShowPrescriptionModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 16,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  summaryItemDetails: {
    flex: 1,
    marginRight: 12,
  },
  summaryItemName: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 4,
  },
  summaryItemQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryItemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  prescriptionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3f3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  prescriptionStatusUploaded: {
    backgroundColor: '#e8f5e9',
  },
  prescriptionStatusText: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  prescriptionStatusTextUploaded: {
    color: '#388e3c',
  },
  prescriptionSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff3f3',
    borderRadius: 8,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  prescriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff4444',
    marginLeft: 8,
  },
  prescriptionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  prescriptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  prescriptionItemInfo: {
    flex: 1,
  },
  prescriptionItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  prescriptionItemQuantity: {
    fontSize: 12,
    color: '#666',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2874f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  uploadButtonSuccess: {
    backgroundColor: '#388e3c',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  priceBreakdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#212121',
  },
  discountText: {
    color: '#388e3c',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
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
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  secureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  secureText: {
    marginLeft: 8,
    color: '#388e3c',
    fontSize: 14,
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
  emptyCartText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default CheckoutScreen;
