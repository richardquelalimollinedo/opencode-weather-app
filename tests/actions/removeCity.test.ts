import { describe, expect, test } from "bun:test";
import type { Settings } from "../../src/types/Settings.ts";
import { removeCity } from "../../src/actions/removeCity.ts";
import { mockInput, setInputLines, setupEnv } from "../helpers.ts";

setupEnv();
mockInput();

describe("removeCity", () => {
  test("elimina la ciudad elegida", async () => {
    const settings: Settings = {
      defaultCity: { name: "Ottawa", latitude: 45.4, longitude: -75.7 },
      cities: [
        { name: "Ottawa", latitude: 45.4, longitude: -75.7 },
        { name: "Lima", latitude: -12, longitude: -77 },
      ],
      unit: "celsius",
    };
    setInputLines(["2"]);
    await removeCity(settings);
    expect(settings.cities.length).toBe(1);
    expect(settings.cities[0]?.name).toBe("Ottawa");
  });

  test("al eliminar la default asume la primera restante", async () => {
    const settings: Settings = {
      defaultCity: { name: "Ottawa", latitude: 45.4, longitude: -75.7 },
      cities: [
        { name: "Ottawa", latitude: 45.4, longitude: -75.7 },
        { name: "Lima", latitude: -12, longitude: -77 },
      ],
      unit: "celsius",
    };
    setInputLines(["1"]);
    await removeCity(settings);
    expect(settings.defaultCity?.name).toBe("Lima");
  });

  test("sin ciudades no hace nada", async () => {
    const settings: Settings = { defaultCity: null, cities: [], unit: "celsius" };
    await removeCity(settings);
    expect(settings.cities.length).toBe(0);
  });
});
