import type { Settings } from "../types/Settings.ts";
import type { Unit } from "../types/City.ts";
import { saveSettings } from "../storage/settingsStorage.ts";
import { ask } from "../presentation/input.ts";
import { ok } from "../utils/colors.ts";
import { unitSymbol } from "../utils/format.ts";

export async function changeUnit(settings: Settings): Promise<void> {
  console.log(`  Unidad actual: ${unitSymbol(settings.unit)}`);
  console.log("  1. Celsius (°C)");
  console.log("  2. Fahrenheit (°F)");
  const answer = await ask("  Selecciona una opción: ");
  const unit: Unit = answer.trim() === "2" ? "fahrenheit" : "celsius";
  settings.unit = unit;
  await saveSettings(settings);
  console.log(ok(`  Unidad cambiada a ${unitSymbol(unit)}.`));
}
