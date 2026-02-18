import { Order, orderDetails } from "@/constants/api";
import { deleteAllOrders, getAllOrders } from "@/lib/db";
import { useRouter } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppContext } from "../_layout";

const Orders = () => {
  const { isOnline, dbReady } = useContext(AppContext);
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const loadOrders = async () => {
    try {
      await delay(1000); // 1 second artificial delay

      if (isOnline) {
        const data = orderDetails;
        setOrders(data);
      }

      const allOrders = getAllOrders();
      if (allOrders.length > 0) {
        setOrders((prevOrders) => [...prevOrders, ...allOrders]);
      } else {
        Alert.alert("no offline data");
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    deleteAllOrders();
    const data = orderDetails;
    setOrders(data);
    loadOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const statuscheck = ({ item }: any) => {
    if (["delivered", "pending", "offline"].includes(item.status)) {
      console.log(item);
      router.push({
        pathname: "/orders/Ordersdetail",
        params: {
          id: item.id,
          sender: item.sender,
          recipient: item.recipient,
          status: item.status,
          syncstatus: item.syncStatus,
          address: item.address,
        },
      });
    }

    if (["in_transit"].includes(item.status)) {
      console.log(item);
      router.push({
        pathname: "/deliverytrack",
        params: {
          id: item.id,
          sender: item.sender,
          recipient: item.recipient,
          status: item.status,
          syncstatus: item.syncStatus,
          address: item.address,
        },
      });
    }
  };
  return (
    <View style={styles.container}>
      {/** headers  */}
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 10,
        }}
      >
        <Text>
          {" "}
          Your connection is{" "}
          {isOnline === null
            ? "Checking..."
            : isOnline
              ? "Online ✅"
              : "Offline ❌"}
        </Text>
      </View>
      <View style={styles.headerRow}>
        <Text style={[styles.cell, styles.headerText]}>Order ID</Text>
        <Text style={[styles.cell, styles.headerText]}>Sender</Text>
        <Text style={[styles.cell, styles.headerText]}>Recipient</Text>
        <Text style={[styles.cell, styles.headerText]}>Status</Text>
        <Text style={[styles.cell, styles.headerText]}>Syncstatus</Text>
        <Text style={[styles.cell, styles.headerText]}>Address</Text>
      </View>
      <View>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{item.id}</Text>
              <Text style={styles.cell}>{item.senderName}</Text>
              <Text style={styles.cell}>{item.recipientName}</Text>
              <TouchableOpacity onPress={() => statuscheck({ item })}>
                <Text
                  style={[
                    styles.cell,
                    item.status === "pending" && styles.pending,
                    item.status === "in_transit" && styles.inTransit,
                    item.status === "delivered" && styles.delivered,
                  ]}
                >
                  {item.status}
                </Text>
              </TouchableOpacity>
              <Text style={styles.cell}>{item.syncStatus}</Text>
              <Text style={styles.cell}>{item.address}</Text>
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.navigate("/newdelivery")}
        accessibilityRole="button"
        accessibilityLabel="Create new delivery request"
        accessibilityHint="Navigates to create delivery request screen"
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>Create new delivery</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 30,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    paddingBottom: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    padding: 5,
  },
  headerText: {
    fontWeight: "bold",
  },
  pending: {
    color: "red",
    fontWeight: "600",
  },
  inTransit: {
    color: "blue",
    fontWeight: "600",
  },
  delivered: {
    color: "green",
    fontWeight: "600",
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 100,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  fabText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
