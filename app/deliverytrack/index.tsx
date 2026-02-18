import { GOOGLE_MAPS_API_KEYS } from "@/config";
import { getCoordinatesFromAddress } from "@/lib/geocoding";
import { getRoute } from "@/lib/momentsimulator";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import MapViewDirections from "react-native-maps-directions";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const DeliveryTrack = () => {
  const { id, sender, recipient, status, syncStatus, address } =
    useLocalSearchParams();

  const [latLng, setLatLng] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [deliveryArray, setDeliveryArray] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return;
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      setLatLng({ latitude: latitude, longitude: longitude });
    } catch (err) {
    } finally {
      setLoading(true);
    }
  };

  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!address) return;

      const addressParam = Array.isArray(address) ? address[0] : address;

      try {
        const coords = await getCoordinatesFromAddress(addressParam);
        if (coords)
          setDestination({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
      } catch (err) {
        console.log(err);
      }
    };

    fetchCoordinates();
  }, [address]);
  useEffect(() => {
    getLocation();
    const getroute = async () => {
      if (latLng && destination) {
        const route = await getRoute(latLng, destination);
        setDeliveryArray(route);
      }
    };
    getroute();
  }, [!loading]); // <-- run once on mount

  useEffect(() => {
    if (!deliveryArray || deliveryArray.length === 0) return;

    let step = 0;

    const timer = setInterval(() => {
      if (step >= deliveryArray.length) {
        clearInterval(timer);
        return; // Stop at destination
      }

      const nextPos = deliveryArray[step];
      setLatLng({ ...nextPos }); // force new object

      // Animate map to marker
      mapRef.current?.animateToRegion(
        { ...nextPos, latitudeDelta: 0.005, longitudeDelta: 0.005 },
        1000, // animation duration in ms
      );

      step++;
    }, 1200); // Slightly longer than animation duration to ensure smoothness

    return () => clearInterval(timer);
  }, [deliveryArray]);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {loading && destination && (
          <>
            {latLng && (
              <>
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  customMapStyle={mapStyle}
                  showsUserLocation={true}
                  followsUserLocation={true}
                  rotateEnabled={true}
                  zoomEnabled={true}
                  toolbarEnabled={true}
                  initialRegion={{
                    latitude: latLng.latitude,
                    longitude: latLng.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015,
                  }}
                >
                  {destination && (
                    <>
                      <Marker
                        coordinate={{
                          latitude: destination.latitude,
                          longitude: destination.longitude,
                        }}
                      />
                      <Marker
                        key={`${latLng.latitude}-${latLng.longitude}`}
                        coordinate={{
                          latitude: latLng.latitude,
                          longitude: latLng.longitude,
                        }}
                      />

                      <MapViewDirections
                        origin={latLng}
                        destination={destination}
                        apikey={GOOGLE_MAPS_API_KEYS}
                      />
                    </>
                  )}
                </MapView>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default DeliveryTrack;

const styles = StyleSheet.create({
  map: {
    height: SCREEN_HEIGHT * 0.92,
    marginVertical: 0,
    width: SCREEN_WIDTH * 0.92,
  },

  carsAround: {
    width: 28,
    height: 14,
  },
  card: {
    alignItems: "center",
    margin: SCREEN_WIDTH / 22,
    height: 50,
    width: 50,
    borderRadius: 30,
    backgroundColor: "pink",
  },
  view2: { marginBottom: 5, borderRadius: 15 },

  fullscreen: {
    width: "100%",
    height: "100%",
  },
});

const mapStyle = [
  {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#d6e2e6",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#cfd4d5",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#7492a8",
      },
    ],
  },
  {
    featureType: "administrative.neighborhood",
    elementType: "labels.text.fill",
    stylers: [
      {
        lightness: 25,
      },
    ],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#dde2e3",
      },
    ],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#cfd4d5",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#dde2e3",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#7492a8",
      },
    ],
  },
  {
    featureType: "landscape.natural.terrain",
    elementType: "all",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#dde2e3",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#588ca4",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [
      {
        saturation: -100,
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#a9de83",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#bae6a1",
      },
    ],
  },
  {
    featureType: "poi.sports_complex",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#c6e8b3",
      },
    ],
  },
  {
    featureType: "poi.sports_complex",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#bae6a1",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#41626b",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        saturation: -45,
      },
      {
        lightness: 10,
      },
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#c1d1d6",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#a6b5bb",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#9fb6bd",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.icon",
    stylers: [
      {
        saturation: -70,
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#b4cbd4",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#588ca4",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "all",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#008cb5",
      },
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "transit.station.airport",
    elementType: "geometry.fill",
    stylers: [
      {
        saturation: -100,
      },
      {
        lightness: -5,
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#a6cbe3",
      },
    ],
  },
];
