import type { City, Unit } from "../types/City.ts";
import type { DailyForecast, ForecastResponse } from "../types/Weather.ts";

function forecastUrl(city: City, unit: Unit, daily: boolean): string {
  const unitParam = unit === "fahrenheit" ? "&temperature_unit=fahrenheit" : "";
  const dailyParam = daily
    ? "&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto"
    : "";
  return (
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${city.latitude}&longitude=${city.longitude}` +
    `&current=temperature_2m${dailyParam}${unitParam}`
  );
}

export async function getTemperature(city: City, unit: Unit): Promise<number> {
  const res = await fetch(forecastUrl(city, unit, false));
  if (!res.ok) throw new Error(`Forecast falló (HTTP ${res.status})`);
  const data = (await res.json()) as ForecastResponse;
  const current = data.current;
  if (!current) throw new Error("La respuesta no incluyó datos actuales");
  return current.temperature_2m;
}

export async function getDailyForecast(city: City, unit: Unit): Promise<DailyForecast> {
  const res = await fetch(forecastUrl(city, unit, true));
  if (!res.ok) throw new Error(`Forecast falló (HTTP ${res.status})`);
  const data = (await res.json()) as ForecastResponse;
  const daily = data.daily;
  if (!daily?.time?.length) throw new Error("La respuesta no incluyó el pronóstico diario");
  return daily;
}
