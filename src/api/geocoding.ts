import type { City } from "../types/City.ts";
import type { GeocodingResponse } from "../types/Weather.ts";

export async function geocode(name: string, count = 5): Promise<City[]> {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(name)}&count=${count}&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding falló (HTTP ${res.status})`);
  const data = (await res.json()) as GeocodingResponse;
  return (data.results ?? []).map((first) => ({
    name: first.name,
    latitude: first.latitude,
    longitude: first.longitude,
    country: first.country,
    region: first.admin1,
  }));
}
