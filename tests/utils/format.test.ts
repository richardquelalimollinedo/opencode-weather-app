import { describe, expect, test } from "bun:test";
import { unitSymbol, weatherDescription, formatDay, placeLabel, errorMessage } from "../../src/utils/format.ts";
import type { City } from "../../src/types/City.ts";

describe("unitSymbol", () => {
  test("celsius → °C", () => {
    expect(unitSymbol("celsius")).toBe("°C");
  });

  test("fahrenheit → °F", () => {
    expect(unitSymbol("fahrenheit")).toBe("°F");
  });
});

describe("weatherDescription", () => {
  test("códigos WMO conocidos", () => {
    expect(weatherDescription(0)).toBe("Despejado");
    expect(weatherDescription(61)).toBe("Lluvia ligera");
    expect(weatherDescription(95)).toBe("Tormenta");
  });

  test("código desconocido devuelve Desconocido", () => {
    expect(weatherDescription(9999)).toBe("Desconocido");
  });
});

describe("formatDay", () => {
  test("fecha inválida devuelve el string original", () => {
    expect(formatDay("no-es-fecha")).toBe("no-es-fecha");
  });

  test("fecha de hoy incluye (hoy)", () => {
    const today = new Date().toISOString().slice(0, 10);
    const label = formatDay(today);
    expect(label).toContain("(hoy)");
  });

  test("fecha de otro año no incluye (hoy)", () => {
    const label = formatDay("2000-01-01");
    expect(label).not.toContain("(hoy)");
  });
});

describe("placeLabel", () => {
  test("con país incluye el país entre paréntesis", () => {
    const city: City = { name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canadá" };
    expect(placeLabel(city)).toBe("Ottawa (Canadá)");
  });

  test("sin país devuelve solo el nombre", () => {
    const city: City = { name: "Lima", latitude: -12, longitude: -77 };
    expect(placeLabel(city)).toBe("Lima");
  });
});

describe("errorMessage", () => {
  test("Error devuelve su message", () => {
    expect(errorMessage(new Error("algo falló"))).toBe("algo falló");
  });

  test("no-Error devuelve String()", () => {
    expect(errorMessage(42)).toBe("42");
    expect(errorMessage(null)).toBe("null");
  });
});
