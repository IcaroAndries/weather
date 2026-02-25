import type { IGeocodingResponse, IWeatherResponse } from "./types";

// Open-Meteo Geocoding API
export async function searchLocation(
  query: string,
): Promise<IGeocodingResponse> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch location data");
  return res.json();
}

// Open-Meteo Weather API (Current and Daily)
export async function getWeather(
  lat: number,
  lon: number,
): Promise<IWeatherResponse> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation&daily=uv_index_max,precipitation_probability_max&timezone=auto&forecast_days=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather data");
  return res.json();
}

// WMO Weather interpretation codes (WW)
export function getWeatherCondition(code: number): string {
  const codes: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle: Light",
    53: "Drizzle: Moderate",
    55: "Drizzle: Dense intensity",
    56: "Freezing Drizzle: Light",
    57: "Freezing Drizzle: Dense intensity",
    61: "Rain: Slight",
    63: "Rain: Moderate",
    65: "Rain: Heavy intensity",
    66: "Freezing Rain: Light",
    67: "Freezing Rain: Heavy intensity",
    71: "Snow fall: Slight",
    73: "Snow fall: Moderate",
    75: "Snow fall: Heavy intensity",
    77: "Snow grains",
    80: "Rain showers: Slight",
    81: "Rain showers: Moderate",
    82: "Rain showers: Violent",
    85: "Snow showers slight",
    86: "Snow showers heavy",
    95: "Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return codes[code] || "Unknown";
}
