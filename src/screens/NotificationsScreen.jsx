import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { BellIcon } from 'react-native-heroicons/outline';

const DUMMY_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Order Confirmed',
    message: 'Your order #12345 has been confirmed',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Special Offer',
    message: 'Get 20% off on all health products',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    title: 'Delivery Update',
    message: 'Your order #12345 is out for delivery',
    time: '1 day ago',
    read: true,
  },
];

const NotificationsScreen = ({ navigation }) => {
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => {
        // Handle notification press
      }}
    >
      <View style={styles.notificationIcon}>
        <BellIcon size={24} color={item.read ? '#666' : '#2874f0'} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, !item.read && styles.unreadText]}>
          {item.title}
        </Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={DUMMY_NOTIFICATIONS}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
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
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  unreadNotification: {
    backgroundColor: '#f8f9ff',
    borderColor: '#e8eaff',
  },
  notificationIcon: {
    marginRight: 16,
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  unreadText: {
    color: '#2874f0',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});

export default NotificationsScreen; 