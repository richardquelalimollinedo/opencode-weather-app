import { describe, expect, test } from "bun:test";
import { LINE, ok, paint, title, warn, highlight } from "../../src/utils/colors.ts";

describe("colors", () => {
  test("paint conserva el texto", () => {
    expect(paint("\x1b[32m", "hola")).toContain("hola");
  });

  test("ok/warn/highlight/title devuelven el texto original", () => {
    expect(ok("bien")).toContain("bien");
    expect(warn("mal")).toContain("mal");
    expect(highlight("dato")).toContain("dato");
    expect(title("título")).toContain("título");
  });

  test("LINE es la línea decorativa", () => {
    expect(LINE).toBe("════════════════════════════════════════");
  });

  test("sin TTY, paint devuelve texto plano", () => {
    if (process.stdout.isTTY !== true) {
      expect(paint("\x1b[32m", "plano")).toBe("plano");
      expect(ok("plano")).toBe("plano");
    }
  });
});
