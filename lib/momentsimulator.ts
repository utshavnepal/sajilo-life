import { GOOGLE_MAPS_API_KEYS } from "@/config";
import polyline from "@mapbox/polyline";

type LatLng = { latitude: number; longitude: number };

const GOOGLE_API_KEY = GOOGLE_MAPS_API_KEYS;

export async function getRoute(
  origin: LatLng,
  destination: LatLng,
): Promise<LatLng[]> {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_API_KEY}`,
    );
    const data = await res.json();
    if (!data.routes?.length) return [];
    const points = data.routes[0].overview_polyline.points;

    return polyline
      .decode(points)
      .map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
  } catch (e) {
    console.error(e);
    return [];
  }
}
