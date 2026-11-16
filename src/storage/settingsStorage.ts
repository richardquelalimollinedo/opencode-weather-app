import { homedir } from "node:os";
import { join } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import type { Settings } from "../types/Settings.ts";

export function configFilePath(): string {
  // WEATHER_CLI_CONFIG_DIR permite redirigir la config (útil en tests).
  const override = process.env.WEATHER_CLI_CONFIG_DIR;
  if (override) return join(override, "config.json");
  if (process.platform === "win32" && process.env.APPDATA) {
    return join(process.env.APPDATA, "weather-cli", "config.json");
  }
  if (process.env.XDG_CONFIG_HOME) {
    return join(process.env.XDG_CONFIG_HOME, "weather-cli", "config.json");
  }
  return join(homedir(), ".config", "weather-cli", "config.json");
}

export const emptySettings = (): Settings => ({
  defaultCity: null,
  cities: [],
  unit: "celsius",
});

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await readFile(configFilePath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      defaultCity: parsed.defaultCity ?? null,
      cities: Array.isArray(parsed.cities) ? parsed.cities : [],
      unit: parsed.unit === "fahrenheit" ? "fahrenheit" : "celsius",
    };
  } catch {
    return emptySettings();
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  const file = configFilePath();
  await mkdir(join(file, ".."), { recursive: true });
  await writeFile(file, JSON.stringify(settings, null, 2), "utf8");
}
