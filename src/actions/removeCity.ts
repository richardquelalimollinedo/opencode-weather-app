import type { Settings } from "../types/Settings.ts";
import { saveSettings } from "../storage/settingsStorage.ts";
import { chooseCity } from "../presentation/menu.ts";
import { ok } from "../utils/colors.ts";

export async function removeCity(settings: Settings): Promise<void> {
  if (settings.cities.length === 0) {
    console.log("  No hay ciudades guardadas.");
    return;
  }
  const city = await chooseCity(settings);
  if (!city) return;
  settings.cities = settings.cities.filter((c) => c.name !== city.name);
  if (settings.defaultCity?.name === city.name) {
    settings.defaultCity = settings.cities[0] ?? null;
  }
  await saveSettings(settings);
  console.log(ok(`  "${city.name}" eliminada.`));
}
