import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Ordersdetail = () => {
  const { id, sender, recipient, status, syncStatus, address } =
    useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          borderRadius: 20,
          borderWidth: 1,
          padding: 10,
          borderColor: "orange",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "blue" }}>
          Ordersdetail
        </Text>

        <Text style={{ color: "red", fontSize: 14 }}>Id: {id}</Text>
        <Text style={{ color: "red", fontSize: 14 }}>Sender: {sender}</Text>
        <Text style={{ color: "red", fontSize: 14 }}>
          Recepient: {recipient}
        </Text>
        <Text style={{ color: "red", fontSize: 14 }}>Status: {status}</Text>
        <Text style={{ color: "red", fontSize: 14 }}>
          {" "}
          sync Status: {syncStatus}
        </Text>
        <Text style={{ color: "red", fontSize: 14 }}>Address: {address}</Text>
      </View>
    </View>
  );
};

export default Ordersdetail;

const styles = StyleSheet.create({});
