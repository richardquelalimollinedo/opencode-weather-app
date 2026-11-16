import { describe, expect, test } from "bun:test";
import type { Settings } from "../../src/types/Settings.ts";
import { setDefaultCity } from "../../src/actions/setDefaultCity.ts";
import { loadSettings } from "../../src/storage/settingsStorage.ts";
import { mockInput, setInputLines, setupEnv } from "../helpers.ts";

setupEnv();
mockInput();

describe("setDefaultCity", () => {
  test("cambia la ciudad default y persiste", async () => {
    const settings: Settings = {
      defaultCity: { name: "Ottawa", latitude: 45.4, longitude: -75.7 },
      cities: [
        { name: "Ottawa", latitude: 45.4, longitude: -75.7 },
        { name: "Lima", latitude: -12, longitude: -77 },
      ],
      unit: "celsius",
    };
    setInputLines(["2"]);
    await setDefaultCity(settings);
    expect(settings.defaultCity?.name).toBe("Lima");
    const saved = await loadSettings();
    expect(saved.defaultCity?.name).toBe("Lima");
  });
});
