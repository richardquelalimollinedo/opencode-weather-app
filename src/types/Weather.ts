export type GeocodingResponse = {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
  }>;
};

export type DailyForecast = {
  time: string[];
  temperature_2m_max: Array<number | null>;
  temperature_2m_min: Array<number | null>;
  weather_code: Array<number | null>;
};

export type ForecastResponse = {
  current?: {
    temperature_2m: number;
  };
  daily?: DailyForecast;
};
