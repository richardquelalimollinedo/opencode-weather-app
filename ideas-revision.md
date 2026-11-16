# Revisión Weather CLI

- [x] **Colores:** ANSI sin dependencias (cyan menú, amarillo temp, verde ok, rojo error).
- [x] **AGENTS.md:** actualizado con la estructura real de `index.ts`, tests y build.
- [x] **Ciudades:** geocoding con `count=5` + sub-menú de selección (nombre/región/país).
- [x] **Tests:** `index.test.ts` — 15 tests de storage y APIs con fetch mockeado.
- [x] **Binario:** recompilado; guarda en `APPDATA\weather-cli\` (Win) / `~/.config/weather-cli/`.
- [x] **Escalabilidad:** single-file con secciones ordenadas; exports para tests.
- [x] **Carga:** spinner `withSpinner` en geocoding y forecast.
- [x] **7 day forecast:** opción 6 del menú (t_max/t_min + weather_code WMO en español).