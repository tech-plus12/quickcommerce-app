import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

const HEALTH_PROMOTIONS = [
  {
    id: "1",
    title: "Health Checkup Kits",
    image: "https://via.placeholder.com/400x200",
    discount: "20% OFF",
    description: "Complete health screening kits at special prices",
    tag: "Best Seller",
    validUntil: "31 Dec 2024",
    terms: "Valid on all health checkup kits",
  },
  {
    id: "2",
    title: "Vitamin Supplements",
    image: "https://via.placeholder.com/400x200",
    discount: "15% OFF",
    description: "Premium vitamins and supplements",
    tag: "Limited Time",
    validUntil: "15 Jan 2024",
    terms: "Valid on all vitamin products",
  },
  {
    id: "3",
    title: "First Aid Kits",
    image: "https://via.placeholder.com/400x200",
    discount: "25% OFF",
    description: "Essential first aid supplies",
    tag: "Popular",
    validUntil: "20 Jan 2024",
    terms: "Valid on all first aid products",
  },
  {
    id: "4",
    title: "Personal Care",
    image: "https://via.placeholder.com/400x200",
    discount: "30% OFF",
    description: "Daily personal care products",
    tag: "New",
    validUntil: "10 Jan 2024",
    terms: "Valid on all personal care items",
  },
  {
    id: "5",
    title: "Health Devices",
    image: "https://via.placeholder.com/400x200",
    discount: "10% OFF",
    description: "Medical devices and equipment",
    tag: "Special",
    validUntil: "25 Jan 2024",
    terms: "Valid on all health devices",
  },
  {
    id: "6",
    title: "Baby Care Products",
    image: "https://via.placeholder.com/400x200",
    discount: "18% OFF",
    description: "Essential baby care items",
    tag: "Family",
    validUntil: "5 Jan 2024",
    terms: "Valid on all baby care products",
  },
];

const HealthPromotionsScreen = ({ navigation }) => {
  const renderPromotionCard = (promotion) => (
    <TouchableOpacity 
      key={promotion.id} 
      style={styles.promotionCard}
      onPress={() => navigation.navigate('PromotionDetails', { promotion })}
    >
      <Image source={{ uri: promotion.image }} style={styles.promotionImage} />
      <View style={styles.promotionInfo}>
        <Text style={styles.promotionTitle}>{promotion.title}</Text>
        <Text style={styles.promotionDescription}>{promotion.description}</Text>
        <View style={styles.promotionFooter}>
          <View style={styles.discountContainer}>
            <Text style={styles.discountText}>{promotion.discount}</Text>
            <Text style={styles.validUntil}>Valid till {promotion.validUntil}</Text>
          </View>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{promotion.tag}</Text>
          </View>
        </View>
        <Text style={styles.termsText}>{promotion.terms}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size={24} color="#2874f0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Promotions</Text>
      </View>
      <ScrollView style={styles.content}>
        {HEALTH_PROMOTIONS.map(renderPromotionCard)}
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
    padding: 16,
  },
  promotionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  promotionImage: {
    width: '100%',
    height: 200,
  },
  promotionInfo: {
    padding: 16,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  promotionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  promotionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountContainer: {
    flex: 1,
  },
  discountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c',
  },
  validUntil: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  tagContainer: {
    backgroundColor: '#2874f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default HealthPromotionsScreen; 