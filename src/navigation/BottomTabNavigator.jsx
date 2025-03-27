import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CartScreen from "../screens/CartScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import SearchScreen from "../screens/SearchScreen";
import OrderSuccessScreen from "../screens/OrderSuccessScreen";
import CategoryProductsScreen from "../screens/CategoryProductsScreen";
import HealthPromotionsScreen from "../screens/HealthPromotionsScreen";
import PromotionDetailsScreen from "../screens/PromotionDetailsScreen";
import WatchLaterScreen from "../screens/WatchLaterScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import { HomeIcon, ShoppingCartIcon, ClockIcon } from "react-native-heroicons/outline";
import {
  HomeIcon as SolidHomeIcon,
  ShoppingCartIcon as SolidShoppingCartIcon,
  ClockIcon as SolidClockIcon,
} from "react-native-heroicons/solid";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen name="HealthPromotions" component={HealthPromotionsScreen} />
      <Stack.Screen name="PromotionDetails" component={PromotionDetailsScreen} />
      <Stack.Screen name="WatchLater" component={WatchLaterScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          title: "Search Products",
          headerStyle: {
            backgroundColor: "#2874f0",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
};

const CartStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
    </Stack.Navigator>
  );
};

const OrderHistoryStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrderHistoryList" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    </Stack.Navigator>
  );
};

const CartIconWithBadge = ({ focused, color, size }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <View>
      {focused ? (
        <SolidShoppingCartIcon size={24} color={color} />
      ) : (
        <ShoppingCartIcon size={22} color={color} />
      )}
      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {cartCount > 99 ? '99+' : cartCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return focused ? <SolidHomeIcon size={24} color={color} /> : <HomeIcon size={22} color={color} />;
          } else if (route.name === "Cart") {
            return <CartIconWithBadge focused={focused} color={color} size={size} />;
          } else if (route.name === "OrderHistory") {
            return focused ? <SolidClockIcon size={24} color={color} /> : <ClockIcon size={22} color={color} />;
          }
          return null;
        },
        tabBarActiveTintColor: "#2874f0",
        tabBarInactiveTintColor: "#666666",
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: "#2874f0",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShown: false,
        unmountOnBlur: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "Home",
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          title: "Cart",
        }}
      />
      <Tab.Screen
        name="OrderHistory"
        component={OrderHistoryStack}
        options={{
          title: "Orders",
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default BottomTabNavigator;
