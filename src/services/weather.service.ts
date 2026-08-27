export interface WeatherDay {
  date: string;
  latitude: number;
  longitude: number;
  timezone: string;
  temperatureMax: number | null;
  temperatureMin: number | null;
  precipitation: number | null;
  windSpeedMax: number | null;
  weatherCode: number | null;
}

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  daily?: {
    time?: string[];
    temperature_2m_max?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
    precipitation_sum?: Array<number | null>;
    wind_speed_10m_max?: Array<number | null>;
    weather_code?: Array<number | null>;
  };
}

export async function getWeatherForDate(
  date: string,
  latitude: number,
  longitude: number
): Promise<WeatherDay | undefined> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('start_date', date);
  url.searchParams.set('end_date', date);
  url.searchParams.set(
    'daily',
    'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code'
  );
  url.searchParams.set('timezone', 'auto');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo returned HTTP ${response.status}.`);
  }

  const data = await response.json() as OpenMeteoResponse;
  const daily = data.daily;
  if (!daily?.time?.length) {
    return undefined;
  }

  return {
    date: daily.time[0],
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    temperatureMax: daily.temperature_2m_max?.[0] ?? null,
    temperatureMin: daily.temperature_2m_min?.[0] ?? null,
    precipitation: daily.precipitation_sum?.[0] ?? null,
    windSpeedMax: daily.wind_speed_10m_max?.[0] ?? null,
    weatherCode: daily.weather_code?.[0] ?? null
  };
}
