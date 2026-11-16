import type { Settings } from "../types/Settings.ts";
import type { MenuOption } from "../types/MenuOption.ts";
import { loadSettings } from "../storage/settingsStorage.ts";
import { ask, closeInput } from "./input.ts";
import { printMenu } from "./menu.ts";
import { weatherOfAll, weatherOfDefault } from "../actions/getWeather.ts";
import { addCity } from "../actions/addCity.ts";
import { removeCity } from "../actions/removeCity.ts";
import { setDefaultCity } from "../actions/setDefaultCity.ts";
import { forecastOfCity } from "../actions/forecast.ts";
import { changeUnit } from "../actions/changeUnit.ts";

// ── Bucle principal ──────────────────────────────────────────

export async function main(): Promise<void> {
  const settings: Settings = await loadSettings();

  while (true) {
    printMenu(settings);
    const answer = await ask("  Selecciona una opción: ");

    switch (answer.trim() as MenuOption) {
      case "1":
        await weatherOfDefault(settings);
        break;
      case "2":
        await weatherOfAll(settings);
        break;
      case "3":
        await addCity(settings);
        break;
      case "4":
        await removeCity(settings);
        break;
      case "5":
        await setDefaultCity(settings);
        break;
      case "6":
        await forecastOfCity(settings);
        break;
      case "8":
        await changeUnit(settings);
        break;
      case "9":
        console.log("  ¡Hasta luego!");
        closeInput();
        process.exit(0);
        return;
      default:
        console.log("  Opción no válida.");
    }

    await ask("\n  Presiona Enter para continuar...");
    console.log("");
  }
}
