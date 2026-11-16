import type { Settings } from "../types/Settings.ts";
import { showForecast } from "../presentation/output.ts";
import { chooseCity } from "../presentation/menu.ts";

export async function forecastOfCity(settings: Settings): Promise<void> {
  let city: Settings["defaultCity"];
  if (settings.cities.length === 0) {
    city = settings.defaultCity;
    if (!city) {
      console.log("  No hay ciudades guardadas. Usa la opción 3 para agregar una.");
      return;
    }
  } else {
    city = await chooseCity(settings);
  }
  if (!city) return;
  await showForecast(city, settings.unit);
}
