import { GOOGLE_MAPS_API_KEYS } from "@/config";

export const getCoordinatesFromAddress = async (address: string) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address,
      )}&key=${GOOGLE_MAPS_API_KEYS}`,
    );

    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;

      return { latitude: lat, longitude: lng };
    } else {
      console.log("No results found for this address");
      return null;
    }
  } catch (error) {
    console.log("Error fetching coordinates:", error);
    return null;
  }
};
