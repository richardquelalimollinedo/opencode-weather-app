import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { configFilePath } from "../../src/storage/settingsStorage.ts";
import type { Settings } from "../../src/types/Settings.ts";
import { addCity } from "../../src/actions/addCity.ts";
import { mockFetch, mockInput, setInputLines, setupEnv } from "../helpers.ts";

setupEnv();
mockInput();

describe("addCity", () => {
  test("agrega ciudad nueva y la persiste", async () => {
    mockFetch({
      results: [{ name: "Bogotá", latitude: 4.6, longitude: -74.1, country: "Colombia" }],
    });
    const settings: Settings = {
      defaultCity: { name: "Ottawa", latitude: 45.4, longitude: -75.7 },
      cities: [{ name: "Ottawa", latitude: 45.4, longitude: -75.7 }],
      unit: "celsius",
    };
    setInputLines(["Bogotá"]);
    await addCity(settings);
    expect(settings.cities.length).toBe(2);
    expect(settings.cities[1]?.name).toBe("Bogotá");
    const saved = JSON.parse(await readFile(configFilePath(), "utf8")) as Settings;
    expect(saved.cities.length).toBe(2);
    


  });

  test("ciudad sin default se convierte en default", async () => {
    mockFetch({
      results: [{ name: "Lima", latitude: -12, longitude: -77, country: "Perú" }],
    });
    const settings: Settings = { defaultCity: null, cities: [], unit: "celsius" };
    setInputLines(["Lima"]);
    await addCity(settings);
    expect(settings.defaultCity?.name).toBe("Lima");
  });

  test("ciudad duplicada no se agrega", async () => {
    mockFetch({
      results: [{ name: "Ottawa", latitude: 45.4, longitude: -75.7 }],
    });
    const settings: Settings = {
      defaultCity: { name: "Ottawa", latitude: 45.4, longitude: -75.7 },
      cities: [{ name: "Ottawa", latitude: 45.4, longitude: -75.7 }],
      unit: "celsius",
    };
    setInputLines(["Ottawa"]);
    await addCity(settings);
    expect(settings.cities.length).toBe(1);
  });

  test("nombre vacío no busca", async () => {
    let called = false;
    mockFetch({});
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      called = true;
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;
    const settings: Settings = { defaultCity: null, cities: [], unit: "celsius" };
    setInputLines(["   "]);
    await addCity(settings);
    globalThis.fetch = originalFetch;
    expect(called).toBe(false);
    expect(settings.cities.length).toBe(0);
  });

  test("sin resultados no agrega nada", async () => {
    mockFetch({});
    const settings: Settings = { defaultCity: null, cities: [], unit: "celsius" };
    setInputLines(["Xyzabc"]);
    await addCity(settings);
    expect(settings.cities.length).toBe(0);
  });

  test("elección 0 cancela", async () => {
    mockFetch({
      results: [
        { name: "Lima", latitude: -12, longitude: -77 },
        { name: "Lima", latitude: -12.1, longitude: -77.1 },
      ],
    });
    const settings: Settings = { defaultCity: null, cities: [], unit: "celsius" };
    setInputLines(["Lima", "0"]);
    await addCity(settings);
    expect(settings.cities.length).toBe(0);
  });
});
