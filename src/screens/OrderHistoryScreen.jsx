import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders, setFilters } from '../store/orderHistorySlice';
import { FunnelIcon } from 'react-native-heroicons/outline';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const OrderHistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { orders, loading, filters } = useSelector((state) => state.orderHistory);
  const [showFilters, setShowFilters] = useState(false);

  // Filter orders based on selected status
  const filteredOrders = orders.filter(order => {
    if (filters.status === 'all') return true;
    return order.status === filters.status;
  });

  useEffect(() => {
    // Only initialize mock data if there are no orders
    if (orders.length === 0) {
      const mockOrders = [
        {
          id: '1',
          orderNumber: 'ORD001',
          date: new Date().toISOString(),
          total: 299.99,
          status: 'completed',
          paymentMethod: 'upi',
          deliveryAddress: {
            type: 'Home',
            name: 'John Doe',
            address: '123 Main Street, Apartment 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            phone: '+91 98765 43210',
            isDefault: true,
          },
          items: [
            { 
              name: 'Product 1', 
              quantity: 2, 
              price: 149.99,
              image: 'https://picsum.photos/200',
            },
          ],
          tracking: {
            status: 'completed',
            steps: [
              { title: 'Order Placed', completed: true },
              { title: 'Processing', completed: true },
              { title: 'Shipped', completed: true },
              { title: 'Delivered', completed: true },
            ],
          },
        },
        {
          id: '2',
          orderNumber: 'ORD002',
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          total: 199.99,
          status: 'pending',
          paymentMethod: 'cod',
          deliveryAddress: {
            type: 'Office',
            name: 'John Doe',
            address: '456 Business Park, Floor 3',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400002',
            phone: '+91 98765 43210',
            isDefault: false,
          },
          items: [
            { 
              name: 'Product 2', 
              quantity: 1, 
              price: 199.99,
              image: 'https://picsum.photos/201',
            },
          ],
          tracking: {
            status: 'pending',
            steps: [
              { title: 'Order Placed', completed: true },
              { title: 'Processing', completed: false },
              { title: 'Shipped', completed: false },
              { title: 'Delivered', completed: false },
            ],
          },
        },
      ];
      dispatch(setOrders(mockOrders));
    }
  }, [dispatch, orders.length]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'processing':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { order: item })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
        <Text style={styles.orderDate}>
          {formatDate(item.date)}
        </Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderTotal}>₹{item.total.toFixed(2)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilters = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filters.status === 'all' && styles.filterButtonActive,
        ]}
        onPress={() => dispatch(setFilters({ status: 'all' }))}
      >
        <Text style={[
          styles.filterButtonText,
          filters.status === 'all' && styles.filterButtonTextActive
        ]}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filters.status === 'pending' && styles.filterButtonActive,
        ]}
        onPress={() => dispatch(setFilters({ status: 'pending' }))}
      >
        <Text style={[
          styles.filterButtonText,
          filters.status === 'pending' && styles.filterButtonTextActive
        ]}>Pending</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filters.status === 'completed' && styles.filterButtonActive,
        ]}
        onPress={() => dispatch(setFilters({ status: 'completed' }))}
      >
        <Text style={[
          styles.filterButtonText,
          filters.status === 'completed' && styles.filterButtonTextActive
        ]}>Completed</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filters.status === 'cancelled' && styles.filterButtonActive,
        ]}
        onPress={() => dispatch(setFilters({ status: 'cancelled' }))}
      >
        <Text style={[
          styles.filterButtonText,
          filters.status === 'cancelled' && styles.filterButtonTextActive
        ]}>Cancelled</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2874f0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order History</Text>
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <FunnelIcon size={24} color="#2874f0" />
        </TouchableOpacity>
      </View>
      {showFilters && renderFilters()}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2874f0',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#2874f0',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default OrderHistoryScreen; 