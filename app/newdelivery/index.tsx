import { GOOGLE_MAPS_API_KEYS } from "@/config";
import { Order, orderDetails } from "@/constants/api";
import { insertOrder } from "@/lib/db";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// Function to generate a simple random unique ID
const generateRandomId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

const NewDelivery = () => {
  const textInput1: any = useRef(4);

  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");

  const [errors, setErrors] = useState<Partial<Order>>({});

  const [orders, setOrders] = useState<Order[]>(orderDetails);
  const validateForm = (): boolean => {
    const newErrors: Partial<Order> = {};
    if (!senderName.trim()) newErrors.senderName = "Sender name is required";
    if (!recipientName.trim())
      newErrors.recipientName = "Recipient name is required";
    if (!address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newOrder: Order = {
      id: generateRandomId(),
      senderName,
      recipientName,
      address,

      status: "in_transit",
      syncStatus: "local",
    };

    // Add new order to array
    insertOrder(newOrder);
    setOrders((prevOrders) => [...prevOrders, newOrder]);

    Alert.alert("Success", "Delivery request created successfully!");

    // Reset form
    setSenderName("");
    setRecipientName("");
    setAddress("");
    textInput1.current?.setAddressText("");
    setErrors({});
    router.replace("/orders");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Delivery Request</Text>

      {/* Sender Name */}
      <Text style={styles.label}>Sender Name</Text>
      <TextInput
        style={[styles.input, errors.senderName && styles.errorInput]}
        placeholder="Enter sender name"
        value={senderName}
        onChangeText={setSenderName}
      />
      {errors.senderName && (
        <Text style={styles.errorText}>{errors.senderName}</Text>
      )}

      {/* Recipient Name */}
      <Text style={styles.label}>Recipient Name</Text>
      <TextInput
        style={[styles.input, errors.recipientName && styles.errorInput]}
        placeholder="Enter recipient name"
        value={recipientName}
        onChangeText={setRecipientName}
      />
      {errors.recipientName && (
        <Text style={styles.errorText}>{errors.recipientName}</Text>
      )}

      {/* Address */}
      <Text style={styles.label}>Delivery Address</Text>
      <GooglePlacesAutocomplete
        nearbyPlacesAPI="GooglePlacesSearch"
        placeholder="deliver to"
        listViewDisplayed="auto"
        debounce={400}
        currentLocation={false}
        ref={textInput1}
        minLength={2}
        enablePoweredByContainer={false}
        fetchDetails={true}
        styles={autoComplete}
        query={{
          key: GOOGLE_MAPS_API_KEYS,
          language: "en",
        }}
        onPress={(data, details = null) => {
          setAddress(data.description);
        }}
      />

      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Request</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewDelivery;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginVertical: 10,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#007BFF",
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  orderCard: {
    padding: 15,
    marginTop: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
});

const autoComplete = {
  textInput: {
    backgroundColor: "grey",

    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    flex: 1,
    borderWidth: 1,
    marginHorizontal: 15,
  },
  container: {
    paddingTop: 20,

    backgroundColor: "white",
  },

  textInputContainer: {
    flexDirection: "row",
  },
};
