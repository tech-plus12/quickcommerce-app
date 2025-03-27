import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { cancelOrder } from '../store/orderHistorySlice';
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  HomeIcon,
  XCircleIcon,
} from 'react-native-heroicons/outline';

const OrderDetailsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { order } = route.params;

  const canCancelOrder = () => {
    return order.status === 'pending' || order.status === 'processing';
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            dispatch(cancelOrder({ orderId: order.id }));
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      case 'processing':
        return '#2196F3';
      case 'shipped':
        return '#FF9800';
      default:
        return '#FFC107';
    }
  };

  const renderTrackingSteps = () => (
    <View style={styles.trackingContainer}>
      <Text style={styles.sectionTitle}>Order Tracking</Text>
      <View style={styles.trackingSteps}>
        {order.tracking?.steps.map((step, index) => (
          <View key={step.title} style={styles.stepContainer}>
            <View style={[
              styles.stepIconContainer,
              step.completed && { borderColor: '#4CAF50' }
            ]}>
              {step.completed ? (
                <CheckCircleIcon size={24} color="#4CAF50" />
              ) : (
                <ClockIcon size={24} color="#BDBDBD" />
              )}
            </View>
            <Text style={[
              styles.stepTitle,
              step.completed && styles.stepTitleCompleted
            ]}>
              {step.title}
            </Text>
            {index < order.tracking.steps.length - 1 && (
              <View style={[
                styles.stepLine,
                step.completed && styles.stepLineCompleted
              ]} />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderOrderItems = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Items</Text>
      {order.items?.map((item, index) => (
        <View key={index} style={styles.orderItem}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
          </View>
          <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Order Number</Text>
        <Text style={styles.summaryValue}>#{order.orderNumber}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Order Date</Text>
        <Text style={styles.summaryValue}>
          {new Date(order.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Payment Method</Text>
        <Text style={styles.summaryValue}>
          {order.paymentMethod === 'upi' ? 'UPI' :
           order.paymentMethod === 'card' ? 'Card' :
           'Cash on Delivery'}
        </Text>
      </View>
      {order.deliveryAddress && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Address</Text>
          <Text style={styles.summaryValue}>
            {order.deliveryAddress.address}
          </Text>
        </View>
      )}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total Amount</Text>
        <Text style={styles.summaryValue}>₹{order.total.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Details</Text>
        {canCancelOrder() && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelOrder}
          >
            <XCircleIcon size={24} color="#F44336" />
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
        <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
      </View>

      {renderTrackingSteps()}
      {renderOrderItems()}
      {renderOrderSummary()}
    </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  cancelButtonText: {
    color: '#F44336',
    marginLeft: 4,
    fontSize: 16,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  trackingContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  trackingSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  stepTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  stepTitleCompleted: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  stepLine: {
    position: 'absolute',
    top: 24,
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: '#E0E0E0',
    zIndex: -1,
  },
  stepLineCompleted: {
    backgroundColor: '#4CAF50',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2874f0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
});

export default OrderDetailsScreen; 