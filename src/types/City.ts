export type City = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
};

export type Unit = "celsius" | "fahrenheit";
