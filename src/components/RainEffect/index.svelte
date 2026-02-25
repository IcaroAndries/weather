<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // We want to generate e.g. 100 drops
  const DROP_COUNT = 100;
  
  let drops: { left: string; delay: string; duration: string }[] = [];

  onMount(() => {
    // Generate random properties for each drop exactly once on mount
    drops = Array.from({ length: DROP_COUNT }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${0.5 + Math.random() * 0.5}s`
    }));
  });
</script>

<div class="rain-container" aria-hidden="true">
  {#each drops as drop}
    <div 
      class="drop" 
      style="left: {drop.left}; animation-delay: {drop.delay}; animation-duration: {drop.duration};"
    ></div>
  {/each}
</div>

<style lang="sass">
  .rain-container
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    pointer-events: none
    z-index: 0
    overflow: hidden
    
  .drop
    position: absolute
    top: -20px
    width: 2px
    height: 15px
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4))
    animation: rain linear infinite
    border-radius: 50%
    
  @keyframes rain
    0%
      transform: translateY(0) rotate(15deg)
      opacity: 0
    10%
      opacity: 1
    90%
      opacity: 1
    100%
      transform: translateY(110vh) rotate(15deg)
      opacity: 0
</style>
