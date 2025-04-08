import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { TrashIcon, MinusIcon, PlusIcon, DocumentTextIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { getCartTotal, removeFromCart, updateQuantity } from "../store/cartSlice";

const CartScreen = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const total = useSelector(getCartTotal);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const prescriptionRequired = cartItems.some(item => item.product.prescription);

  const handleUpdateQuantity = (productId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigation.navigate('Checkout');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.product.name}</Text>
          {item.product.prescription && (
            <View style={styles.prescriptionBadge}>
              <DocumentTextIcon size={16} color="#ff4444" />
              <Text style={styles.prescriptionText}>Prescription Required</Text>
            </View>
          )}
        </View>
        <Text style={styles.itemPrice}>{item.product.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => handleUpdateQuantity(item.product.id, item.quantity, -1)}
          >
            <MinusIcon size={16} color="#212121" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => handleUpdateQuantity(item.product.id, item.quantity, 1)}
          >
            <PlusIcon size={16} color="#212121" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => dispatch(removeFromCart(item.product.id))} 
        style={styles.removeButton}
      >
        <TrashIcon size={24} color="#ff6161" />
      </TouchableOpacity>
    </View>
  );

  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.product.id}
        ListEmptyComponent={
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
          </View>
        }
      />
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          {prescriptionRequired && (
            <View style={styles.prescriptionNote}>
              <DocumentTextIcon size={20} color="#ff4444" />
              <Text style={styles.prescriptionNoteText}>
                Some items require prescription. You'll be asked to upload them during checkout.
              </Text>
            </View>
          )}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.checkoutButton} 
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  cartItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 1,
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemHeader: {
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
    marginBottom: 4,
  },
  prescriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3f3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  prescriptionText: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
    color: "#212121",
    minWidth: 24,
    textAlign: "center",
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  prescriptionNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3f3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  prescriptionNoteText: {
    flex: 1,
    color: '#ff4444',
    fontSize: 14,
    marginLeft: 8,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalText: {
    fontSize: 16,
    color: "#666",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
  },
  checkoutButton: {
    backgroundColor: "#2874f0",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyCartText: {
    fontSize: 16,
    color: "#666",
  },
});

export default CartScreen;
