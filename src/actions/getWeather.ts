import type { Settings } from "../types/Settings.ts";
import { showWeather } from "../presentation/output.ts";

export async function weatherOfDefault(settings: Settings): Promise<void> {
  if (!settings.defaultCity) {
    console.log("  No hay ciudad default. Usa la opción 3 para agregar una.");
    return;
  }
  await showWeather(settings.defaultCity, settings.unit);
}

export async function weatherOfAll(settings: Settings): Promise<void> {
  if (settings.cities.length === 0) {
    console.log("  No hay ciudades guardadas. Usa la opción 3 para agregar una.");
    return;
  }
  for (const city of settings.cities) {
    await showWeather(city, settings.unit);
  }
}
