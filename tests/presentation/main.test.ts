import { describe, expect, test } from "bun:test";
import { main } from "../../src/presentation/main.ts";
import { loadSettings } from "../../src/storage/settingsStorage.ts";
import { ExitSignal, mockInput, setInputLines, setupEnv, stubProcessExit } from "../helpers.ts";

setupEnv();
mockInput();

// ── main() ───────────────────────────────────────────────────

describe("main", () => {
  test("cambiar unidad (8 → 2) y salir (9) termina con código 0", async () => {
    const exit = stubProcessExit();
    setInputLines(["8", "2", "", "9"]);
    try {
      await main();
      throw new Error("main() no debía terminar sin exit");
    } catch (error) {
      if (!(error instanceof ExitSignal)) throw error;
    } finally {
      exit.restore();
    }
    expect(exit.code).toBe(0);
    const saved = await loadSettings();
    expect(saved.unit).toBe("fahrenheit");
  });

  test("opción inválida vuelve al menú y puede salir después", async () => {
    const exit = stubProcessExit();
    setInputLines(["xyz", "", "9"]);
    try {
      await main();
      throw new Error("main() no debía terminar sin exit");
    } catch (error) {
      if (!(error instanceof ExitSignal)) throw error;
    } finally {
      exit.restore();
    }
    expect(exit.code).toBe(0);
  });
});
