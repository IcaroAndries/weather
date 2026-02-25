export interface ICoords {
  latitude: number;
  longitude: number;
}

export interface IGeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface IGeocodingResponse {
  results?: IGeocodingResult[];
}

export interface IWeatherResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
    relative_humidity_2m: number;
  };
  daily: {
    uv_index_max: number[];
    precipitation_probability_max: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
  };
}
