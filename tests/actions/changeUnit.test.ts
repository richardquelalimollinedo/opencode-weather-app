import { describe, expect, test } from "bun:test";
import type { Settings } from "../../src/types/Settings.ts";
import { changeUnit } from "../../src/actions/changeUnit.ts";
import { loadSettings } from "../../src/storage/settingsStorage.ts";
import { mockInput, setInputLines, setupEnv } from "../helpers.ts";

setupEnv();
mockInput();

describe("changeUnit", () => {
  test("opción 2 cambia a fahrenheit", async () => {
    const settings: Settings = { defaultCity: null, cities: [], unit: "celsius" };
    setInputLines(["2"]);
    await changeUnit(settings);
    expect(settings.unit).toBe("fahrenheit");
    const saved = await loadSettings();
    expect(saved.unit).toBe("fahrenheit");
  });

  test("cualquier otra opción vuelve a celsius", async () => {
    const settings: Settings = { defaultCity: null, cities: [], unit: "fahrenheit" };
    setInputLines(["zzz"]);
    await changeUnit(settings);
    expect(settings.unit).toBe("celsius");
  });
});
