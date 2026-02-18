import { iccheck } from "@/helper/iccheck";
import { initDB, testDB } from "@/lib/db";
import * as Location from "expo-location";
import { Stack } from "expo-router";
import React, { createContext, useEffect, useState } from "react";
// 1️ Context type
interface AppContextType {
  isOnline: boolean | null;
  dbReady: boolean;
}

// 2️ Create context
export const AppContext = createContext<AppContextType>({
  isOnline: null,
  dbReady: false,
});

// 3️ RootLayout
export default function RootLayout() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [dbReady, setDbReady] = useState(false);
  const checkPermission = async () => {
    const hasPermission = await Location.requestForegroundPermissionsAsync();
    if (hasPermission.status === "granted") {
      const permission = await askPermission();
      return permission;
    }
    return true;
  };
  const askPermission = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    return permission.status === "granted";
  };
  const getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return;
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
    } catch (err) {}
  };
  useEffect(() => {
    checkPermission();
    getLocation();
    // Initialize DB (synchronous)

    initDB();
    testDB(); // optional DB check
    setDbReady(true); // mark DB as ready after init

    let sub: any;

    // Listen to online/offline changes
    iccheck((onlineStatus: boolean) => {
      console.log("Online:", onlineStatus);
      setIsOnline(onlineStatus); // reactive state
    }).then((s) => (sub = s));

    // Cleanup listener on unmount
    return () => {
      sub && sub.remove();
    };
  }, []);

  return (
    <AppContext.Provider value={{ isOnline, dbReady }}>
      <Stack screenOptions={{ headerShown: false, statusBarHidden: true }} />
    </AppContext.Provider>
  );
}
