# AGENTS.md

Bun + TypeScript single-file CLI exercise (`index.ts`). Tests live in `index.test.ts` (`bun test`); the CLI itself is a single file. No lint/CI config exists; don't invent commands for them.

## Commands

- Run: `bun index.ts`
- Tests: `bun test`
- Typecheck: `bun run typecheck` — runs `bun check` (works on Bun 1.4.4). Use this as the verification step.
- Build: `bun run build` — `bun build --compile` → `weather` binary (Windows: `weather.exe`; committed artifact is gitignored).

## Conventions that differ from defaults

- `allowImportingTsExtensions` + `verbatimModuleSyntax` are on: import with explicit `.ts` extensions (`./foo.ts`, never `./foo`) and use `import type` for type-only imports.
- `noUncheckedIndexedAccess` is on: array/object index access yields `T | undefined`; handle it.
- Everything is ESM (`"type": "module"`, `moduleResolution: "bundler"`).

## Estructura de `index.ts` (single-file, en orden)

1. Tipos (`City`, `Settings`, respuestas de OpenMeteo)
2. Colores ANSI (`paint`, `ok`, `warn`, `highlight`, `title`) — sin dependencias
3. Entrada línea a línea (`ask`, cola de input; `ensureRl` crea readline perezosamente)
4. Spinner (`withSpinner`) para tareas async
5. Persistencia (`configFilePath`, `loadSettings`, `saveSettings`; respeta `WEATHER_CLI_CONFIG_DIR` para tests)
6. APIs (`geocode` con `count=5`, `getTemperature`, `getDailyForecast`, `weatherDescription` WMO)
7. Helpers de menú + acciones + `main()` (protegido con `import.meta.main`)

Funciones de persistencia/APIs y el tipo `Settings` se exportan para `index.test.ts`.

## Menú (opciones)

1. Clima de ciudad default · 2. Clima de todas · 3. Buscar/agregar ciudad · 4. Eliminar · 5. Establecer default · 6. Pronóstico 7 días (t_max/t_min + weather_code) · 8. Ajustes (°C/°F) · 9. Salir. No hay 7 (reservada).

## Project spec (from README, in Spanish)

- Weather CLI that prompts for a city, using OpenMeteo with no API key:
  1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
  2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
- Features: default city (persisted), multiple saved cities, set/remove cities, units setting (°C). Menu UI is Spanish; follow the example menu layout in the README.
- End goal is a standalone executable binary (see `bun build --compile`).
