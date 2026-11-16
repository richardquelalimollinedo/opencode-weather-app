import { LINE, title } from "../utils/colors.ts";
import { unitSymbol } from "../utils/format.ts";
import type { Settings } from "../types/Settings.ts";
import type { City } from "../types/City.ts";
import { ask } from "./input.ts";

// ── Helpers de menú ──────────────────────────────────────────

export function printMenu(settings: Settings): void {
  console.log(title(LINE));
  console.log(title("         WEATHER CLI"));
  console.log(title(LINE));
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${settings.cities.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log("  6. Pronóstico de 7 días");
  console.log(`  8. Ajustes (${unitSymbol(settings.unit)})`);
  console.log("  9. Salir");
  console.log(title(LINE));
}

export function printCities(settings: Settings): void {
  if (settings.cities.length === 0) {
    console.log("  (No hay ciudades guardadas)");
    return;
  }
  for (const [i, city] of settings.cities.entries()) {
    const isDefault = settings.defaultCity?.name === city.name ? " [default]" : "";
    const country = city.country ? ` (${city.country})` : "";
    console.log(`  ${i + 1}. ${city.name}${country}${isDefault}`);
  }
}

export async function chooseCity(settings: Settings): Promise<City | null> {
  printCities(settings);
  const answer = await ask("  Número de ciudad (0 para cancelar): ");
  const index = Number.parseInt(answer.trim(), 10);
  if (Number.isNaN(index) || index <= 0) return null;
  const city = settings.cities[index - 1];
  if (!city) {
    console.log("  Número fuera de rango.");
    return null;
  }
  return city;
}

export async function pickGeocodedCity(results: City[]): Promise<City | null> {
  if (results.length === 1) return results[0] ?? null;
  console.log("  Se encontraron varias coincidencias:");
  for (const [i, city] of results.entries()) {
    const region = city.region ? `, ${city.region}` : "";
    const country = city.country ? `, ${city.country}` : "";
    console.log(`  ${i + 1}. ${city.name}${region}${country}`);
  }
  const answer = await ask("  Número de ciudad (0 para cancelar): ");
  const index = Number.parseInt(answer.trim(), 10);
  if (Number.isNaN(index) || index <= 0) return null;
  const city = results[index - 1];
  if (!city) {
    console.log("  Número fuera de rango.");
    return null;
  }
  return city;
}
