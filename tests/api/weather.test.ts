import { describe, expect, test } from "bun:test";
import { getDailyForecast, getTemperature } from "../../src/api/weather.ts";
import type { City } from "../../src/types/City.ts";
import { mockFetch, setupEnv } from "../helpers.ts";

setupEnv();

const city: City = {
  name: "Ottawa",
  latitude: 45.4,
  longitude: -75.7,
};

describe("getTemperature", () => {
  test("devuelve la temperatura actual", async () => {
    mockFetch({ current: { temperature_2m: 21.5 } });
    expect(await getTemperature(city, "celsius")).toBe(21.5);
  });

  test("sin datos actuales lanza error", async () => {
    mockFetch({});
    expect(getTemperature(city, "celsius")).rejects.toThrow(
      "La respuesta no incluyó datos actuales",
    );
  });

  test("HTTP 500 lanza error", async () => {
    mockFetch({}, 500);
    expect(getTemperature(city, "celsius")).rejects.toThrow("Forecast falló (HTTP 500)");
  });
});

describe("getDailyForecast", () => {
  const dailyPayload = {
    daily: {
      time: ["2026-11-15", "2026-11-16"],
      temperature_2m_max: [10, 12],
      temperature_2m_min: [2, 3],
      weather_code: [0, 61],
    },
  };

  test("devuelve el pronóstico diario", async () => {
    mockFetch(dailyPayload);
    const daily = await getDailyForecast(city, "celsius");
    expect(daily.time.length).toBe(2);
    expect(daily.weather_code[0]).toBe(0);
  });

  test("sin datos diarios lanza error", async () => {
    mockFetch({ current: { temperature_2m: 20 } });
    expect(getDailyForecast(city, "celsius")).rejects.toThrow(
      "La respuesta no incluyó el pronóstico diario",
    );
  });

  test("HTTP 500 lanza error", async () => {
    mockFetch({}, 500);
    expect(getDailyForecast(city, "celsius")).rejects.toThrow("Forecast falló (HTTP 500)");
  });
});
