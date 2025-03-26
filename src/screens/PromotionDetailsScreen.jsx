import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ChevronLeftIcon, TagIcon, ClockIcon, InformationCircleIcon } from 'react-native-heroicons/outline';

const PromotionDetailsScreen = ({ route, navigation }) => {
  const { promotion } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size={24} color="#2874f0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promotion Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <Image source={{ uri: promotion.image }} style={styles.promotionImage} />
        
        <View style={styles.promotionInfo}>
          <View style={styles.titleContainer}>
            <Text style={styles.promotionTitle}>{promotion.title}</Text>
            <View style={styles.tagContainer}>
              <TagIcon size={16} color="#fff" style={styles.tagIcon} />
              <Text style={styles.tagText}>{promotion.tag}</Text>
            </View>
          </View>

          <View style={styles.discountContainer}>
            <Text style={styles.discountText}>{promotion.discount}</Text>
            <View style={styles.validityContainer}>
              <ClockIcon size={16} color="#666" style={styles.clockIcon} />
              <Text style={styles.validityText}>Valid till {promotion.validUntil}</Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{promotion.description}</Text>
          </View>

          <View style={styles.termsContainer}>
            <View style={styles.termsHeader}>
              <InformationCircleIcon size={20} color="#2874f0" />
              <Text style={styles.termsTitle}>Terms & Conditions</Text>
            </View>
            <Text style={styles.termsText}>{promotion.terms}</Text>
          </View>

          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => navigation.navigate('ProductDetails', { product: promotion })}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  content: {
    flex: 1,
  },
  promotionImage: {
    width: '100%',
    height: 250,
  },
  promotionInfo: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  promotionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    marginRight: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2874f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  discountContainer: {
    marginBottom: 24,
  },
  discountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 8,
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 4,
  },
  validityText: {
    fontSize: 14,
    color: '#666',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  termsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  termsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2874f0',
    marginLeft: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  shopNowButton: {
    backgroundColor: '#2874f0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shopNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PromotionDetailsScreen; 