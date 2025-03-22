import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CartScreen from '../screens/CartScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  UserIcon, 
  BellIcon 
} from "react-native-heroicons/outline";
import { 
  HomeIcon as SolidHomeIcon, 
  ShoppingCartIcon as SolidShoppingCartIcon,
  UserIcon as SolidUserIcon, 
  BellIcon as SolidBellIcon 
} from "react-native-heroicons/solid";
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
};

const CartStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
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
            return focused ? <SolidShoppingCartIcon size={24} color={color} /> : <ShoppingCartIcon size={22} color={color} />;
          } else if (route.name === "Notifications") {
            return focused ? <SolidBellIcon size={24} color={color} /> : <BellIcon size={22} color={color} />;
          } else if (route.name === "Profile") {
            return focused ? <SolidUserIcon size={24} color={color} /> : <UserIcon size={22} color={color} />;
          }
          return null;
        },
        tabBarActiveTintColor: "#2874f0",
        tabBarInactiveTintColor: "#666666",
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#2874f0',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartStack}
        options={{
          title: 'Cart',
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationScreen}
        options={{
          title: 'Notifications',
        }}
      />
      {/* <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
