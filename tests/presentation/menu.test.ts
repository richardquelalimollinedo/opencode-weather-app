import { describe, expect, test } from "bun:test";
import type { Settings } from "../../src/types/Settings.ts";
import type { City } from "../../src/types/City.ts";
import { chooseCity, pickGeocodedCity, printCities } from "../../src/presentation/menu.ts";
import { mockInput, setInputLines, setupEnv } from "../helpers.ts";

setupEnv();
mockInput();

const settings: Settings = {
  defaultCity: { name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canadá" },
  cities: [
    { name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canadá" },
    { name: "Lima", latitude: -12, longitude: -77, country: "Perú" },
  ],
  unit: "celsius",
};

describe("chooseCity", () => {
  test("devuelve la ciudad según el número", async () => {
    setInputLines(["2"]);
    const city = await chooseCity(settings);
    expect(city?.name).toBe("Lima");
  });

  test("0 devuelve null", async () => {
    setInputLines(["0"]);
    expect(await chooseCity(settings)).toBeNull();
  });

  test("texto no numérico devuelve null", async () => {
    setInputLines(["banana"]);
    expect(await chooseCity(settings)).toBeNull();
  });

  test("número fuera de rango devuelve null", async () => {
    setInputLines(["99"]);
    expect(await chooseCity(settings)).toBeNull();
  });
});

describe("pickGeocodedCity", () => {
  test("un solo resultado se devuelve sin preguntar", async () => {
    const city: City = { name: "Ottawa", latitude: 45.4, longitude: -75.7 };
    const result = await pickGeocodedCity([city]);
    expect(result?.name).toBe("Ottawa");
  });

  test("varios resultados pide elegir", async () => {
    const results: City[] = [
      { name: "Lima", latitude: -12, longitude: -77 },
      { name: "Lima", latitude: -12.1, longitude: -77.1 },
    ];
    setInputLines(["1"]);
    const result = await pickGeocodedCity(results);
    expect(result?.latitude).toBe(-12);
  });

  test("varios resultados con 0 devuelve null", async () => {
    const results: City[] = [
      { name: "Lima", latitude: -12, longitude: -77 },
      { name: "Lima", latitude: -12.1, longitude: -77.1 },
    ];
    setInputLines(["0"]);
    expect(await pickGeocodedCity(results)).toBeNull();
  });

  test("lista vacía devuelve null", async () => {
    expect(await pickGeocodedCity([])).toBeNull();
  });
});

describe("printCities", () => {
  test("imprime las ciudades con la default marcada", () => {
    const logs: string[] = [];
    const original = console.log;
    console.log = (msg: string) => logs.push(msg);
    try {
      printCities(settings);
    } finally {
      console.log = original;
    }
    expect(logs.some((l) => l.includes("Ottawa") && l.includes("[default]"))).toBe(true);
    expect(logs.some((l) => l.includes("Lima (Perú)"))).toBe(true);
  });

  test("sin ciudades imprime aviso", () => {
    const logs: string[] = [];
    const original = console.log;
    console.log = (msg: string) => logs.push(msg);
    try {
      printCities({ defaultCity: null, cities: [], unit: "celsius" });
    } finally {
      console.log = original;
    }
    expect(logs[0]).toContain("(No hay ciudades guardadas)");
  });
});
