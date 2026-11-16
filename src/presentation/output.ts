import { colorEnabled, highlight, paint, warn, YELLOW } from "../utils/colors.ts";
import { SPIN_FRAMES } from "../utils/constants.ts";
import { errorMessage, formatDay, placeLabel, unitSymbol, weatherDescription } from "../utils/format.ts";
import { getDailyForecast, getTemperature } from "../api/weather.ts";
import type { City, Unit } from "../types/City.ts";

// ── Estado de carga (spinner) ────────────────────────────────

export async function withSpinner<T>(label: string, task: Promise<T>): Promise<T> {
  const clearLine = (): void => {
    process.stdout.write("\r" + " ".repeat(label.length + 6) + "\r");
  };
  if (!colorEnabled) {
    process.stdout.write(`  ${label}... `);
  }
  let i = 0;
  const timer = setInterval(() => {
    process.stdout.write(`\r  ${label} ${paint(YELLOW, SPIN_FRAMES[i++ % SPIN_FRAMES.length]!)}`);
  }, 80);
  try {
    const result = await task;
    clearLine();
    return result;
  } catch (error) {
    clearLine();
    throw error;
  } finally {
    clearInterval(timer);
  }
}

// ── Salida de datos (clima y pronóstico) ─────────────────────

export async function showWeather(city: City, unit: Unit): Promise<void> {
  try {
    const temp = await withSpinner(
      `Consultando ${city.name}`,
      getTemperature(city, unit),
    );
    const tempText = `${Math.round(temp * 10) / 10} ${unitSymbol(unit)}`;
    console.log(`  Clima en ${placeLabel(city)}: ${highlight(tempText)}`);
  } catch (error) {
    console.log(warn(`  Error consultando ${city.name}: ${errorMessage(error)}`));
  }
}

export async function showForecast(city: City, unit: Unit): Promise<void> {
  try {
    const daily = await withSpinner(
      `Pronóstico de ${city.name}`,
      getDailyForecast(city, unit),
    );
    console.log(`\n  Pronóstico 7 días para ${placeLabel(city)}:`);
    for (let i = 0; i < daily.time.length; i++) {
      const date = daily.time[i]!;
      const max = daily.temperature_2m_max[i];
      const min = daily.temperature_2m_min[i];
      const code = daily.weather_code[i];
      if (max == null || min == null || code == null) continue;
      const symbol = unitSymbol(unit);
      console.log(
        `  ${formatDay(date).padEnd(18)}` +
          `${weatherDescription(code).padEnd(28)}` +
          `${highlight(`${Math.round(min)} — ${Math.round(max)} ${symbol}`)}`,
      );
    }
  } catch (error) {
    console.log(warn(`  Error consultando ${city.name}: ${errorMessage(error)}`));
  }
}
