import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Image, Alert } from "react-native";

const DoctorFeedbackForm = () => {
  const [doctorName, setDoctorName] = useState("");
  const [hospital, setHospital] = useState("");
  const [place, setPlace] = useState("");
  const [tm, setTM] = useState("");
  const [hq, setHQ] = useState("");
  const [visitedStall, setVisitedStall] = useState(null);
  const [rating, setRating] = useState("Not Visited");
  const [receivedInfo, setReceivedInfo] = useState(null);
  const [suggestedMolecule, setSuggestedMolecule] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [showProductList, setShowProductList] = useState(false);

  const handleSubmit = () => {
    // Validate required fields
    if (!doctorName || !hospital || !place) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    const data = {
      doctorName,
      hospital,
      place,
      tm,
      hq,
      visitedStall,
      rating,
      receivedInfo,
      suggestedMolecule,
      suggestions,
    };
    console.log(data);

    Alert.alert("Thank You", `Thank you Dr. ${doctorName} for your valuable feedback!`, [{ text: "OK", onPress: () => resetForm() }]);
  };

  const resetForm = () => {
    setDoctorName("");
    setHospital("");
    setPlace("");
    setTM("");
    setHQ("");
    setVisitedStall(null);
    setRating(null);
    setReceivedInfo(null);
    setSuggestedMolecule("");
    setSuggestions("");
    setShowProductList(false);
  };

  const renderProductList = () => {
    if (!showProductList) return null;

    return (
      <View style={styles.productListContainer}>
        <Text style={styles.productListTitle}>Glee Biotech Products Range</Text>
        <View style={styles.productList}>
          <Text style={styles.productItem}>• CTAZ-EDTA </Text>
          <Text style={styles.productItem}>• GLPIROME </Text>
          <Text style={styles.productItem}>• GMERO </Text>
          <Text style={styles.productItem}>• TIZGLEE </Text>
          <Text style={styles.productItem}>• GLEEPEN </Text>
          <Text style={styles.productItem}>• GLCEFTA </Text>
          <Text style={styles.productItem}>• GLPOLY </Text>
          <Text style={styles.productItem}>• GCOLIST </Text>
          <Text style={styles.productItem}>• GLTREO </Text>
          <Text style={styles.productItem}>• AIMBACT </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>GLEE BIOTECH</Text>
          </View>
          <Text style={styles.headerTitle}>ISCCM Kochi {new Date().getFullYear()} Feedback</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name of Doctor*</Text>
            <TextInput style={styles.input} value={doctorName} onChangeText={setDoctorName} placeholder="Enter your name" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hospital*</Text>
            <TextInput style={styles.input} value={hospital} onChangeText={setHospital} placeholder="Enter your hospital" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Place*</Text>
            <TextInput style={styles.input} value={place} onChangeText={setPlace} placeholder="Enter your location" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>TM</Text>
            <TextInput style={styles.input} value={tm} onChangeText={setTM} placeholder="Territory Manager" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>HQ</Text>
            <TextInput style={styles.input} value={hq} onChangeText={setHQ} placeholder="Headquarters" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Q1. Have you visited Glee Biotech stall @ ISCCM Kochi?</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity style={[styles.option, visitedStall === true && styles.selectedOption]} onPress={() => setVisitedStall(true)}>
                <Text style={[styles.optionText, visitedStall === true && styles.selectedOptionText]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.option, visitedStall === false && styles.selectedOption]} onPress={() => setVisitedStall(false)}>
                <Text style={[styles.optionText, visitedStall === false && styles.selectedOptionText]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {visitedStall === true && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Q2. What is your rating for Glee Biotech's presence @ ISCCM Kochi?</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity style={[styles.ratingOption, rating === "Very Good" && styles.selectedOption]} onPress={() => setRating("Very Good")}>
                  <Text style={[styles.optionText, rating === "Very Good" && styles.selectedOptionText]}>Very Good</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.ratingOption, rating === "Good" && styles.selectedOption]} onPress={() => setRating("Good")}>
                  <Text style={[styles.optionText, rating === "Good" && styles.selectedOptionText]}>Good</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.ratingOption, rating === "Moderate" && styles.selectedOption]} onPress={() => setRating("Moderate")}>
                  <Text style={[styles.optionText, rating === "Moderate" && styles.selectedOptionText]}>Moderate</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Q3. Have you received enough information about our products?</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[styles.option, receivedInfo === true && styles.selectedOption]}
                onPress={() => {
                  setReceivedInfo(true);
                  setShowProductList(false);
                }}
              >
                <Text style={[styles.optionText, receivedInfo === true && styles.selectedOptionText]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.option, receivedInfo === false && styles.selectedOption]}
                onPress={() => {
                  setReceivedInfo(false);
                  setShowProductList(true);
                }}
              >
                <Text style={[styles.optionText, receivedInfo === false && styles.selectedOptionText]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {renderProductList()}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Q4. Which molecule you suggest Glee Biotech should introduce?</Text>
            <TextInput
              style={styles.textArea}
              value={suggestedMolecule}
              onChangeText={setSuggestedMolecule}
              placeholder="Your suggestion"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Q5. Your suggestions for Glee Biotech to move forward in Critical Care</Text>
            <TextInput
              style={styles.textArea}
              value={suggestions}
              onChangeText={setSuggestions}
              placeholder="Your valuable suggestions"
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank You Doctor for Your Response</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollView: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoContainer: {
    width: 200,
    height: 60,
    backgroundColor: "#0066cc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
    minHeight: 80,
    textAlignVertical: "top",
  },
  optionsContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  option: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#fafafa",
    maxWidth: 120,
  },
  ratingOption: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  optionText: {
    fontSize: 16,
    color: "#555",
  },
  selectedOption: {
    backgroundColor: "#0066cc",
    borderColor: "#0066cc",
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "500",
  },
  productListContainer: {
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0066cc",
  },
  productListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0066cc",
  },
  productList: {
    paddingLeft: 8,
  },
  productItem: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#0066cc",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#555",
    fontStyle: "italic",
  },
});

export default DoctorFeedbackForm;
