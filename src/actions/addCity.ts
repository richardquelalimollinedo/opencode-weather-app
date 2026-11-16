import type { Settings } from "../types/Settings.ts";
import { geocode } from "../api/geocoding.ts";
import { saveSettings } from "../storage/settingsStorage.ts";
import { ask } from "../presentation/input.ts";
import { pickGeocodedCity } from "../presentation/menu.ts";
import { withSpinner } from "../presentation/output.ts";
import { ok, warn } from "../utils/colors.ts";
import { errorMessage } from "../utils/format.ts";
import type { City } from "../types/City.ts";

export async function addCity(settings: Settings): Promise<void> {
  const name = (await ask("  Nombre de la ciudad: ")).trim();
  if (!name) {
    console.log("  Nombre vacío.");
    return;
  }
  try {
    const results = await withSpinner(`Buscando "${name}"`, geocode(name));
    if (results.length === 0) {
      console.log(`  No se encontró ninguna ciudad llamada "${name}".`);
      return;
    }
    const city = await pickGeocodedCity(results);
    if (!city) return;
    const exists = settings.cities.some(
      (c) => c.name.toLowerCase() === city.name.toLowerCase(),
    );
    if (exists) {
      console.log(`  "${city.name}" ya está guardada.`);
      return;
    }
    settings.cities.push(city);
    if (!settings.defaultCity) {
      settings.defaultCity = city;
      console.log(ok(`  "${city.name}" guardada y establecida como default.`));
    } else {
      console.log(ok(`  "${city.name}" guardada.`));
    }
    await saveSettings(settings);
  } catch (error) {
    console.log(warn(`  Error buscando la ciudad: ${errorMessage(error)}`));
  }
}
