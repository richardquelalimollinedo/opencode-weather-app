import type { Settings } from "../types/Settings.ts";
import { saveSettings } from "../storage/settingsStorage.ts";
import { chooseCity } from "../presentation/menu.ts";
import { ok } from "../utils/colors.ts";

export async function setDefaultCity(settings: Settings): Promise<void> {
  if (settings.cities.length === 0) {
    console.log("  No hay ciudades guardadas.");
    return;
  }
  const city = await chooseCity(settings);
  if (!city) return;
  settings.defaultCity = city;
  await saveSettings(settings);
  console.log(ok(`  "${city.name}" es ahora la ciudad default.`));
}
