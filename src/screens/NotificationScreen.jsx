import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { 
  BellIcon, 
  ShoppingBagIcon, 
  TagIcon, 
  GiftIcon,
  CheckCircleIcon 
} from 'react-native-heroicons/outline';

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Your order has been delivered!',
    message: 'Order #123456 has been delivered successfully.',
    time: '2 hours ago',
    type: 'order',
    read: false,
    icon: ShoppingBagIcon,
    iconBgColor: '#e3f2fd',
    iconColor: '#2962ff',
  },
  {
    id: '2',
    title: 'Flash Sale is Live!',
    message: 'Don\'t miss out on amazing deals up to 70% off.',
    time: '5 hours ago',
    type: 'promotion',
    read: false,
    icon: TagIcon,
    iconBgColor: '#fff3e0',
    iconColor: '#ff6d00',
  },
  {
    id: '3',
    title: 'Price Drop Alert',
    message: 'Product in your wishlist is now available at a lower price.',
    time: '1 day ago',
    type: 'price',
    read: true,
    icon: BellIcon,
    iconBgColor: '#e8f5e9',
    iconColor: '#2e7d32',
  },
  {
    id: '4',
    title: 'Special Gift for You',
    message: 'You\'ve earned a special discount coupon!',
    time: '2 days ago',
    type: 'reward',
    read: true,
    icon: GiftIcon,
    iconBgColor: '#fce4ec',
    iconColor: '#c2185b',
  },
];

const NotificationScreen = () => {
  const renderNotification = ({ item }) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity 
        style={[
          styles.notificationItem,
          item.read ? styles.readNotification : styles.unreadNotification,
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.iconBgColor }]}>
          <IconComponent size={22} color={item.iconColor} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={[
              styles.title,
              item.read ? styles.readText : styles.unreadText,
            ]}>
              {item.title}
            </Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.markAllRead}>
          <CheckCircleIcon size={20} color="#2874f0" />
          <Text style={styles.markAllReadText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={NOTIFICATIONS}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <BellIcon size={48} color="#666" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2874f0',
    padding: 16,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  markAllRead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllReadText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  listContainer: {
    padding: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unreadNotification: {
    backgroundColor: '#fff',
  },
  readNotification: {
    backgroundColor: '#fafafa',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2874f0',
  },
  unreadText: {
    fontWeight: '600',
    color: '#212121',
  },
  readText: {
    fontWeight: '400',
    color: '#666',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default NotificationScreen; 