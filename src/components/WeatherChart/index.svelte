<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Chart from "chart.js/auto";

  export let hourlyTime: string[];
  export let hourlyTemp: number[];
  export let hourlyHumidity: number[];
  export let hourlyPrecipitation: number[];

  type MetricType = 'temperature' | 'humidity' | 'precipitation';
  let selectedMetric: MetricType = 'temperature';

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;

  $: if (canvas && hourlyTime) {
    if (chart) {
      chart.destroy();
    }
    
    // Only show next 24 hours
    const labels = hourlyTime.slice(0, 24).map(t => {
      const date = new Date(t);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    
    let data: number[];
    let label = '';
    let yAxisSuffix = '';
    let borderColor = '';
    let backgroundColor = '';

    if (selectedMetric === 'temperature') {
      data = hourlyTemp.slice(0, 24);
      label = 'Temperature (°C)';
      yAxisSuffix = '°';
      borderColor = 'rgba(255, 255, 255, 0.8)';
      backgroundColor = 'rgba(255, 255, 255, 0.2)';
    } else if (selectedMetric === 'humidity') {
      data = hourlyHumidity.slice(0, 24);
      label = 'Humidity (%)';
      yAxisSuffix = '%';
      borderColor = 'rgba(100, 200, 255, 0.8)';
      backgroundColor = 'rgba(100, 200, 255, 0.2)';
    } else {
      data = hourlyPrecipitation.slice(0, 24);
      label = 'Precipitation (mm)';
      yAxisSuffix = 'mm';
      borderColor = 'rgba(150, 150, 255, 0.8)';
      backgroundColor = 'rgba(150, 150, 255, 0.2)';
    }

    chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data,
          borderColor,
          backgroundColor,
          borderWidth: 2,
          pointBackgroundColor: 'rgba(30, 41, 59, 1)',
          pointBorderColor: borderColor,
          pointRadius: 3,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            displayColors: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              maxTicksLimit: 8
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              callback: function(value) {
                return value + yAxisSuffix;
              }
            }
          }
        }
      }
    });
  }

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });

  function setMetric(metric: MetricType) {
    selectedMetric = metric;
  }
</script>

<article class="glass-chart">
  <header class="glass-chart__header">
    <h3 class="glass-chart__title">Hourly Forecast</h3>
    <div class="glass-chart__controls">
      <button 
        class="metric-btn {selectedMetric === 'temperature' ? 'active' : ''}" 
        on:click={() => setMetric('temperature')}
      >
        Temp
      </button>
      <button 
        class="metric-btn {selectedMetric === 'humidity' ? 'active' : ''}" 
        on:click={() => setMetric('humidity')}
      >
        Humidity
      </button>
      <button 
        class="metric-btn {selectedMetric === 'precipitation' ? 'active' : ''}" 
        on:click={() => setMetric('precipitation')}
      >
        Rain (mm)
      </button>
    </div>
  </header>
  <div class="glass-chart__canvas-container">
    <canvas bind:this={canvas}></canvas>
  </div>
</article>

<style lang="sass">
  .glass-chart
    --glass-bg: rgba(30, 41, 59, 0.45)
    --glass-border: rgba(255, 255, 255, 0.08)
    --glass-radius: 16px
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.2)
    
    width: 80vw
    max-width: 80vw
    margin-top: 2rem
    padding: 1.5rem 1.75rem
    border-radius: var(--glass-radius)
    background: var(--glass-bg)
    border: 1px solid var(--glass-border)
    box-shadow: var(--glass-shadow)
    backdrop-filter: blur(12px)
    -webkit-backdrop-filter: blur(12px)
    color: rgba(255, 255, 255, 0.92)

  .glass-chart__header
    display: flex
    justify-content: space-between
    align-items: center
    flex-wrap: wrap
    gap: 1rem
    margin-bottom: 1rem

  .glass-chart__title
    margin: 0
    font-size: 1.125rem
    font-weight: 500
    letter-spacing: -0.01em
    color: rgba(255, 255, 255, 0.8)

  .glass-chart__controls
    display: flex
    background: rgba(0, 0, 0, 0.2)
    border-radius: 8px
    padding: 0.25rem
    gap: 0.25rem

  .metric-btn
    background: transparent
    border: none
    color: rgba(255, 255, 255, 0.6)
    padding: 0.4rem 0.8rem
    font-size: 0.75rem
    font-weight: 500
    border-radius: 6px
    cursor: pointer
    transition: all 0.2s ease
    
    &:hover
      color: rgba(255, 255, 255, 0.9)
      background: rgba(255, 255, 255, 0.05)
      
    &.active
      color: #fff
      background: rgba(255, 255, 255, 0.15)
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

  .glass-chart__canvas-container
    position: relative
    height: 300px
    width: 100%
</style>
