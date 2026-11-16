import type { City, Unit } from "../types/City.ts";

export function unitSymbol(unit: Unit): string {
  return unit === "celsius" ? "°C" : "°F";
}

export function weatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: "Despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna ligera",
    53: "Llovizna",
    55: "Llovizna intensa",
    56: "Llovizna helada",
    57: "Llovizna helada intensa",
    61: "Lluvia ligera",
    63: "Lluvia",
    65: "Lluvia intensa",
    66: "Lluvia helada",
    67: "Lluvia helada intensa",
    71: "Nieve ligera",
    73: "Nieve",
    75: "Nieve intensa",
    77: "Granos de nieve",
    80: "Chubascos ligeros",
    81: "Chubascos",
    82: "Chubascos intensos",
    85: "Chubascos de nieve",
    86: "Chubascos de nieve intensos",
    95: "Tormenta",
    96: "Tormenta con granizo",
    99: "Tormenta fuerte con granizo",
  };
  return descriptions[code] ?? "Desconocido";
}

export function formatDay(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  const label = date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  const today = new Date().toISOString().slice(0, 10);
  return isoDate === today ? `${label} (hoy)` : label;
}

export function placeLabel(city: City): string {
  return city.country ? `${city.name} (${city.country})` : city.name;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
