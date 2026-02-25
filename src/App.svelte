<script lang="ts">
  import { onMount } from "svelte";
  import MainCard from "./components/MainCard/index.svelte";
  import SearchBar from "./components/SearchBar/index.svelte";
  import WeatherChart from "./components/WeatherChart/index.svelte";
  import RainEffect from "./components/RainEffect/index.svelte";
  import { searchLocation, getWeather, getWeatherCondition } from "~lib/api";
  import type { IGeocodingResult, IWeatherResponse } from "~lib/types";

  let loading = true;
  let error = "";
  let weatherData: IWeatherResponse | null = null;
  let locationName = "Locating...";
  let weatherTheme = "sunny";

  function updateTheme(code: number) {
    // WMO weather codes: 
    // 0-3: Clear/Cloudy
    // 45-48: Fog
    // 51-67: Drizzle/Rain
    // 71-77: Snow
    // 80-82: Showers
    // 95-99: Thunderstorm
    
    if (code >= 51 && code <= 67 || code >= 80 && code <= 82 || code >= 95 && code <= 99) {
      weatherTheme = 'rainy';
    } else if (code === 3 || code === 2 || code >= 45 && code <= 48) {
      weatherTheme = 'cloudy';
    } else {
      weatherTheme = 'sunny';
    }
  }

  async function fetchWeather(lat: number, lon: number, name: string) {
    loading = true;
    error = "";
    try {
      weatherData = await getWeather(lat, lon);
      locationName = name;
      updateTheme(weatherData.current.weather_code);
    } catch (err: any) {
      error = err.message || "Failed to fetch weather";
    } finally {
      loading = false;
    }
  }

  async function handleLocationSelect(event: CustomEvent<IGeocodingResult>) {
    const result = event.detail;
    const name = result.admin1 ? `${result.name}, ${result.admin1}, ${result.country}` : `${result.name}, ${result.country}`;
    await fetchWeather(result.latitude, result.longitude, name);
  }

  onMount(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeather(latitude, longitude, "Current Location");
        },
        (err) => {
          console.warn("Geolocation error:", err);
          // Default to a fallback location if denied
          fetchWeather(47.6104, -122.2007, "Bellevue, Washington (Fallback)");
        }
      );
    } else {
      fetchWeather(47.6104, -122.2007, "Bellevue, Washington (Fallback)");
    }
  });
</script>

<main>
  <div class="background {weatherTheme}" aria-hidden="true"></div>
  {#if weatherTheme === 'rainy'}
    <RainEffect />
  {/if}
  <div class="content">
    <div class="dashboard">
      <SearchBar on:select={handleLocationSelect} />

      {#if loading}
        <MainCard title="Loading..." subtitle="Please wait">
          <div class="loading-state">
            <span class="spinner"></span>
            <p>Fetching weather data...</p>
          </div>
        </MainCard>
      {:else if error}
        <MainCard title="Error" subtitle="Something went wrong">
          <p class="error-text">{error}</p>
        </MainCard>
      {:else if weatherData}
        <MainCard 
          title={locationName} 
          subtitle="{getWeatherCondition(weatherData.current.weather_code)} &middot; {Math.round(weatherData.current.temperature_2m)}&deg;C"
        >
          <div class="weather-details">
            <div class="detail-item">
              <span class="detail-label">Temperature</span>
              <span class="detail-value">{Math.round(weatherData.current.temperature_2m)}&deg;C</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Humidity</span>
              <span class="detail-value">{weatherData.current.relative_humidity_2m}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Rain Chance</span>
              <span class="detail-value">{weatherData.daily.precipitation_probability_max[0]}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">UV Index</span>
              <span class="detail-value">{weatherData.daily.uv_index_max[0]}</span>
            </div>
          </div>
        </MainCard>
        
        <WeatherChart 
          hourlyTime={weatherData.hourly.time} 
          hourlyTemp={weatherData.hourly.temperature_2m} 
          hourlyHumidity={weatherData.hourly.relative_humidity_2m}
          hourlyPrecipitation={weatherData.hourly.precipitation}
        />
      {/if}
    </div>
  </div>
</main>

<style>
  main {
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 40px;
    padding-bottom: 40px;
    box-sizing: border-box;
    /* Removed overflow: hidden to allow scrolling */
  }

  .background {
    position: fixed; /* Changed to fixed for parallax */
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: url("/background.jpg") center center no-repeat;
    background-size: cover;
    animation: cloud-drift 50s ease-in-out infinite;
    z-index: 0;
    transition: filter 1s ease;
  }
  
  /* Dynamic Themes */
  .background.sunny {
    filter: brightness(1) contrast(1);
  }
  
  .background.cloudy {
    filter: brightness(0.8) grayscale(0.3);
    animation: cloud-drift 80s ease-in-out infinite; /* Slower drift for clouds */
  }
  
  .background.rainy {
    filter: brightness(0.5) grayscale(0.7) contrast(1.2);
    /* Attempt to make it look stormy and dark */
  }
  
  /* Optional pseudo-element overlay for extra ambience in rain/clouds */
  .background::after {
    content: '';
    position: absolute;
    inset: 0;
    background: transparent;
    transition: background 1s ease;
    pointer-events: none;
  }
  
  .background.rainy::after {
    background: rgba(10, 15, 30, 0.4); /* Dark blue/grey overlay */
  }
  
  .background.cloudy::after {
    background: rgba(100, 110, 120, 0.2); /* Soft grey overlay */
  }

  .content {
    position: relative;
    z-index: 1;
    width: 100%;
    flex: 1;
    min-height: 0;
    display: flex;
    justify-content: center;
    padding: 0 1rem;
  }

  .dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 800px;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border-top-color: rgba(255, 255, 255, 0.8);
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-text {
    color: #ffb3b3;
    font-weight: 500;
  }

  .weather-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.5);
  }

  .detail-value {
    font-size: 1.5rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.92);
  }

  @keyframes cloud-drift {
    0%, 100% {
      background-position: 50% 50%;
    }
    25% {
      background-position: 58% 46%;
    }
    50% {
      background-position: 46% 54%;
    }
    75% {
      background-position: 54% 58%;
    }
  }
</style>
