import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { TrashIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { getCartTotal, removeFromCart, updateQuantity } from "../store/cartSlice";

const CartScreen = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const total = useSelector(getCartTotal);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => dispatch(updateQuantity({ productId: item.id, quantity: item.quantity - 1 }))}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => dispatch(updateQuantity({ productId: item.id, quantity: item.quantity + 1 }))}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))} style={styles.removeButton}>
        <TrashIcon size={24} color="#ff6161" />
      </TouchableOpacity>
    </View>
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('INR', '₹');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
          </View>
        }
      />
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.checkoutButton} 
            onPress={() => navigation.navigate("Checkout")}
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
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    color: "#212121",
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
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
