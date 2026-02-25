# 🌤️ Glassmorphism Weather App

A modern, immersive weather dashboard built with **Svelte**, **TypeScript**, and **Vite**. This application features a stunning glassmorphism design, real-time data from the Open-Meteo API, dynamic weather-themed backgrounds, and interactive data visualization.

---

## ✨ Key Features

- **Real-Time Data**: Get the current temperature, weather conditions, humidity, UV index, and rain chances instantly.
- **Interactive Hourly Chart**: View detailed 24-hour forecasts. Toggle seamlessly between `Temperature (°C)`, `Humidity (%)`, and `Precipitation (mm)`.
- **Search Autocomplete**: A sleek, debounced search bar connects to the Geocoding API to provide real-time location suggestions as you type.
- **Dynamic Theming & Parallax**: The dashboard's background and ambiance dynamically adapt to the searched location's current weather (Sunny, Cloudy, Rainy). Elements float smoothly over a parallax scrolling background.
- **Realistic Pure CSS Rain**: When it rains in the searched location, the app renders a highly realistic, hardware-accelerated pure CSS rain animation.
- **Geolocation Support**: Automatically detects your location on load to provide immediate, localized weather insights.

## 🛠️ Tech Stack

- **Framework**: [Svelte](https://svelte.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS & Sass (Indented syntax for streamlined component design)
- **Charts**: [Chart.js](https://www.chartjs.org/) for interactive data visualization
- **APIs**: 
  - [Open-Meteo Weather API](https://open-meteo.com/) (No API key required)
  - Browser Geolocation API

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed (v18+ recommended).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **View the app:**
   Open your browser and navigate to `http://localhost:5173`.

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI elements
│   ├── MainCard/        # The primary weather data display
│   ├── RainEffect/      # Pure CSS weather animation component
│   ├── SearchBar/       # Glassmorphism autocomplete search input
│   └── WeatherChart/    # Interactive Chart.js forecast component
├── lib/
│   ├── api.ts           # Open-Meteo fetch logic (Geocoding & Forecast)
│   └── types.ts         # TypeScript interfaces for API responses
├── App.svelte           # Main application state and layout
├── app.sass             # Global styles, variables, and dynamic theming
└── main.ts              # Svelte app entry point
```

## 💅 Design Philosophy: Glassmorphism

The application strictly adheres to modern glassmorphism UI principles to create a sleek, premium feel:
- Deep background blurs using `backdrop-filter`.
- Semi-transparent, vibrant white borders representing glass reflections.
- Soft, spread-out shadows for depth simulation.
- High-contrast, highly legible typography overlaid on frosted elements.

## 📜 License

This project is licensed under the MIT License.
