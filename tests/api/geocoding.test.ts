import { describe, expect, test } from "bun:test";
import { geocode } from "../../src/api/geocoding.ts";
import { mockFetch, setupEnv } from "../helpers.ts";

setupEnv();

describe("geocode", () => {
  test("parsea resultados de la API", async () => {
    mockFetch({
      results: [
        { name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canadá", admin1: "Ontario" },
      ],
    });
    const cities = await geocode("Ottawa");
    expect(cities.length).toBe(1);
    expect(cities[0]).toEqual({
      name: "Ottawa",
      latitude: 45.4,
      longitude: -75.7,
      country: "Canadá",
      region: "Ontario",
    });
  });

  test("sin resultados devuelve lista vacía", async () => {
    mockFetch({});
    const cities = await geocode("Xyzabc");
    expect(cities).toEqual([]);
  });

  test("HTTP 500 lanza error", async () => {
    mockFetch({ error: true }, 500);
    expect(geocode("Ottawa")).rejects.toThrow("Geocoding falló (HTTP 500)");
  });
});
