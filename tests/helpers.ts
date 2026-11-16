import { afterEach, beforeEach, mock } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import type { Settings } from "../src/types/Settings.ts";
import type { City } from "../src/types/City.ts";

// ── Fixtures ─────────────────────────────────────────────────

export const ottawa: City = {
  name: "Ottawa",
  latitude: 45.4,
  longitude: -75.7,
  country: "Canadá",
};

export const lima: City = {
  name: "Lima",
  latitude: -12,
  longitude: -77,
  country: "Perú",
};

export const sampleSettings: Settings = {
  defaultCity: ottawa,
  cities: [ottawa, lima],
  unit: "fahrenheit",
};

// ── fetch mock ───────────────────────────────────────────────

export const originalFetch = globalThis.fetch;

export function mockFetch(payload: unknown, status = 200): void {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { "content-type": "application/json" },
    })) as unknown as typeof fetch;
}

// ── Directorio de config temporal ────────────────────────────

const originalConfigDir = process.env.WEATHER_CLI_CONFIG_DIR;
const tempDirs: string[] = [];

export async function setConfigDir(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "weather-cli-test-"));
  tempDirs.push(dir);
  process.env.WEATHER_CLI_CONFIG_DIR = dir;
  return dir;
}

// ── Mock del módulo de input (readline) ──────────────────────

let inputLines: string[] = [];
let inputMocked = false;

/** Cola de líneas que devolverá `ask` en el próximo test. */
export function setInputLines(lines: string[]): void {
  inputLines = [...lines];
}

/**
 * Reemplaza `src/presentation/input.ts` por un ask que consume líneas
 * de la cola. Es global (bun test corre todo en un proceso), así que
 * solo se instala una vez; cada test usa setInputLines().
 */
export function mockInput(): void {
  if (inputMocked) return;
  inputMocked = true;
  const inputPath = resolve(import.meta.dir, "../src/presentation/input.ts");
  mock.module(inputPath, () => ({
    ask: async (): Promise<string> => inputLines.shift()?.trimEnd() ?? "",
    closeInput: (): void => {},
  }));
}

// ── Stub de process.exit (para probar main()) ────────────────

export class ExitSignal extends Error {}

export function stubProcessExit(): { code: number | null; restore: () => void } {
  const realExit = process.exit;
  const state = { code: null as number | null };
  process.exit = ((code?: number) => {
    state.code = code ?? 0;
    throw new ExitSignal("__exit__");
  }) as typeof process.exit;
  return {
    get code() {
      return state.code;
    },
    restore: () => {
      process.exit = realExit;
    },
  };
}

// ── Setup / teardown compartidos ─────────────────────────────

export function setupEnv(): void {
  beforeEach(async () => {
    await setConfigDir();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (originalConfigDir === undefined) {
      delete process.env.WEATHER_CLI_CONFIG_DIR;
    } else {
      process.env.WEATHER_CLI_CONFIG_DIR = originalConfigDir;
    }
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop()!;
      void rm(dir, { recursive: true, force: true });
    }
    setInputLines([]);
  });
}
