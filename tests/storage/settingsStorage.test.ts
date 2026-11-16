import { describe, expect, test } from "bun:test";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { emptySettings, loadSettings, saveSettings } from "../../src/storage/settingsStorage.ts";
import type { Settings } from "../../src/types/Settings.ts";
import { sampleSettings, setConfigDir, setupEnv } from "../helpers.ts";

setupEnv();

describe("persistencia", () => {
  test("guarda y carga settings sin pérdida de datos", async () => {
    await saveSettings(sampleSettings);
    const loaded = await loadSettings();
    expect(loaded).toEqual(sampleSettings);
  });

  test("archivo corrupto devuelve settings vacíos", async () => {
    const dir = await setConfigDir();
    await writeFile(join(dir, "config.json"), "no-es-json{{{", "utf8");
    const loaded = await loadSettings();
    expect(loaded).toEqual(emptySettings());
  });

  test("archivo inexistente devuelve settings vacíos", async () => {
    const loaded = await loadSettings();
    expect(loaded).toEqual(emptySettings());
  });

  test("unidad inválida se normaliza a celsius", async () => {
    const dir = await setConfigDir();
    await writeFile(
      join(dir, "config.json"),
      JSON.stringify({ ...sampleSettings, unit: "kelvin" }),
      "utf8",
    );
    const loaded = await loadSettings();
    expect(loaded.unit).toBe("celsius");
  });

  test("cities no-array se normaliza a lista vacía", async () => {
    const dir = await setConfigDir();
    await writeFile(
      join(dir, "config.json"),
      JSON.stringify({ cities: "no-es-lista", defaultCity: null, unit: "celsius" }),
      "utf8",
    );
    const loaded = await loadSettings();
    expect(loaded.cities).toEqual([]);
  });

  test("saveSettings crea el directorio si no existe", async () => {
    const dir = await setConfigDir();
    const nested = join(dir, "sub", "dir");
    process.env.WEATHER_CLI_CONFIG_DIR = nested;
    await saveSettings(sampleSettings as Settings);
    const loaded = await loadSettings();
    expect(loaded).toEqual(sampleSettings);
  });
});
