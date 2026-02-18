import { AppContext } from "@/app/_layout"; // adjust import path
import { router } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
const Index = () => {
  const { isOnline, dbReady } = useContext(AppContext);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Sajilo life please click to proceed</Text>
      {/* order hub */}
      <TouchableOpacity onPress={() => router.push("/orders")}>
        <View
          style={{
            width: 120,
            height: 60,
            backgroundColor: "orange",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white" }}>Orders</Text>
        </View>
      </TouchableOpacity>

      {/* delivery request */}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
