import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";

// In a real app, you'd implement persistent storage with a proper solution
// For demonstration, we'll use a global variable (not recommended for production)
let savedFormData = null;

const GleeForm = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveloding, setloading] = useState(false); // state for loader visibility

  // Form fields
  const [formData, setFormData] = useState({
    firm_name: "",
    username: "",
    mobile: "",
    address_Line_1: "",
    zip_code: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (savedFormData) {
          setFormData(savedFormData);
        }

        // Fetch data from API
        const response = await axios.post(
          "https://api.plusdistribution.in/pdpl/glee-biotech/get-form-details",
          { user_id: 3040 },
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.data.responseCode === 1) {
          if (!savedFormData && response.data.response.length > 0) {
            setFormData(response.data.response[0]);
          }
        } else {
          setError("No data found");
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Save form data
  const handleSave = async () => {
    try {
      setloading(true); // show loader

      savedFormData = { ...formData };
      console..log("Saved form data:", savedFormData);

      await axios.post("https://api.plusdistribution.in/pdpl/glee-biotech/save-form-details", savedFormData, {
        headers: { "Content-Type": "application/json" },
      });

      Alert.alert("Success", "Form data saved successfully!");
    } catch (err) {
      Alert.alert("Error", "Failed to save form data");
    } finally {
      setloading(false);
    }
  };

  // Clear saved form data
  const handleClear = () => {
    savedFormData = null;

    setFormData({
      firm_name: "",
      username: "",
      mobile: "",
      address_Line_1: "",
      zip_code: "",
    });

    Alert.alert("Success", "Form data cleared");
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A6FFF" />
        <Text style={styles.loadingText}>Loading your data...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setLoading(true)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Edit Details</Text>
          <Text style={styles.subHeader}>Please fill in your information</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Firm Name</Text>
            <TextInput
              style={styles.input}
              value={formData.firm_name || ""}
              onChangeText={(text) => handleChange("firm_name", text)}
              placeholder="Enter firm name"
              placeholderTextColor="#9EA0A4"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={formData.username || ""}
              onChangeText={(text) => handleChange("username", text)}
              placeholder="Enter username"
              placeholderTextColor="#9EA0A4"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={styles.input}
              value={formData.mobile || ""}
              onChangeText={(text) => handleChange("mobile", text)}
              placeholder="Enter mobile number"
              placeholderTextColor="#9EA0A4"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address_Line_1 || ""}
              onChangeText={(text) => handleChange("address_Line_1", text)}
              placeholder="Enter address"
              placeholderTextColor="#9EA0A4"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Zip Code</Text>
            <TextInput
              style={styles.input}
              value={formData.zip_code || ""}
              onChangeText={(text) => handleChange("zip_code", text)}
              placeholder="Enter zip code"
              placeholderTextColor="#9EA0A4"
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
              {saveloding ? <ActivityIndicator size="large" color="#FFFFFF" /> : <Text style={styles.buttonText}>Save Information</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    backgroundColor: "#F7F9FC",
  },
  loadingText: {
    marginTop: 0,
    fontSize: 16,
    color: "#4A6FFF",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F7F9FC",
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E384D",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: "#8798AD",
    marginBottom: 8,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#2E384D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#2E384D",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E3E8F0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#2E384D",
    backgroundColor: "#FAFBFC",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: "#4A6FFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#4A6FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#FF647C",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4A6FFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default GleeForm;
