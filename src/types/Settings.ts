import type { City, Unit } from "./City.ts";

export type Settings = {
  defaultCity: City | null;
  cities: City[];
  unit: Unit;
};
