import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  UserCircleIcon,
  ShoppingBagIcon,
  HeartIcon,
  CreditCardIcon,
  MapPinIcon,
  ClockIcon,
  CogIcon,
  QuestionMarkCircleIcon,
} from 'react-native-heroicons/outline';

const USER_DATA = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 98765 43210',
  avatar: 'https://via.placeholder.com/100',
};

const MENU_ITEMS = [
  {
    title: 'Orders',
    icon: ShoppingBagIcon,
    subtitle: 'Check your order status',
    route: 'Orders',
  },
  {
    title: 'Wishlist',
    icon: HeartIcon,
    subtitle: 'Your favorite items',
    route: 'Wishlist',
  },
  {
    title: 'Payment Methods',
    icon: CreditCardIcon,
    subtitle: 'Saved cards & wallets',
    route: 'Payments',
  },
  {
    title: 'Addresses',
    icon: MapPinIcon,
    subtitle: 'Save addresses for checkout',
    route: 'Addresses',
  },
  {
    title: 'Purchase History',
    icon: ClockIcon,
    subtitle: 'Details of past purchases',
    route: 'History',
  },
  {
    title: 'Settings',
    icon: CogIcon,
    subtitle: 'App settings & preferences',
    route: 'Settings',
  },
  {
    title: 'Help & Support',
    icon: QuestionMarkCircleIcon,
    subtitle: 'FAQs & customer support',
    route: 'Support',
  },
];

const MyAccountScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: USER_DATA.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{USER_DATA.name}</Text>
            <Text style={styles.email}>{USER_DATA.email}</Text>
            <Text style={styles.phone}>{USER_DATA.phone}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.menuIconContainer}>
              <item.icon size={24} color="#2874f0" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Version Info */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2874f0',
    padding: 20,
    paddingTop: 60,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  phone: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  editButtonText: {
    color: '#2874f0',
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  version: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
    fontSize: 12,
  },
});

export default MyAccountScreen; 