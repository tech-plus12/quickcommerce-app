import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, PhoneIcon, EnvelopeIcon, ChevronRightIcon } from "react-native-heroicons/outline";

const FAQ_ITEMS = [
  {
    question: "How do I track my order?",
    answer: "You can track your order in the Orders section of your account or using the tracking number sent to your email.",
  },
  {
    question: "What are the payment methods available?",
    answer: "We accept Credit/Debit cards, Net Banking, UPI, and Cash on Delivery.",
  },
  {
    question: "How can I return a product?",
    answer: "You can initiate a return within 7 days of delivery through the Orders section.",
  },
];

const HelpSupportScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search for help" placeholderTextColor="#666" />
      </View>
      <View style={styles.contactContainer}>
        <TouchableOpacity style={styles.contactOption}>
          <ChatBubbleLeftRightIcon size={24} color="#2874f0" />
          <Text style={styles.contactText}>Chat with Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactOption}>
          <PhoneIcon size={24} color="#2874f0" />
          <Text style={styles.contactText}>Call Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactOption}>
          <EnvelopeIcon size={24} color="#2874f0" />
          <Text style={styles.contactText}>Email Us</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {FAQ_ITEMS.map((item, index) => (
          <TouchableOpacity key={index} style={styles.faqItem}>
            <View style={styles.faqHeader}>
              <QuestionMarkCircleIcon size={20} color="#2874f0" />
              <Text style={styles.question}>{item.question}</Text>
              <ChevronRightIcon size={20} color="#666" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Help Topics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help Topics</Text>
        {["Orders", "Payments", "Shipping", "Returns", "Account"].map((topic, index) => (
          <TouchableOpacity key={index} style={styles.topicItem}>
            <Text style={styles.topicText}>{topic}</Text>
            <ChevronRightIcon size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Still need help? Our customer support team is available 24/7</Text>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#2874f0",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  contactOption: {
    alignItems: "center",
  },
  contactText: {
    marginTop: 8,
    color: "#2874f0",
    fontSize: 14,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 8,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212121",
    padding: 16,
    paddingBottom: 8,
  },
  faqItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  question: {
    flex: 1,
    fontSize: 14,
    color: "#212121",
    marginLeft: 12,
  },
  topicItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  topicText: {
    fontSize: 16,
    color: "#212121",
  },
  footer: {
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: "#2874f0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HelpSupportScreen;
