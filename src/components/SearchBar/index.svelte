<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { searchLocation } from '~lib/api';
  import type { IGeocodingResult } from '~lib/types';
  
  const dispatch = createEventDispatcher<{ select: IGeocodingResult }>();
  
  let query = '';
  let suggestions: IGeocodingResult[] = [];
  let loading = false;
  let showDropdown = false;
  let debounceTimer: ReturnType<typeof setTimeout>;

  async function fetchSuggestions(q: string) {
    if (!q.trim()) {
      suggestions = [];
      showDropdown = false;
      return;
    }
    
    loading = true;
    try {
      const res = await searchLocation(q);
      suggestions = res.results || [];
      showDropdown = suggestions.length > 0;
    } catch (e) {
      console.error("Failed to fetch suggestions", e);
      suggestions = [];
    } finally {
      loading = false;
    }
  }

  function handleInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
  }

  function handleSelect(result: IGeocodingResult) {
    query = '';
    suggestions = [];
    showDropdown = false;
    dispatch('select', result);
  }

  // Handle clicking outside the dropdown to close it
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
      showDropdown = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
    clearTimeout(debounceTimer);
  });
</script>

<div class="search-container">
  <form class="search-bar {showDropdown ? 'open' : ''}" on:submit|preventDefault={() => {
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else {
      fetchSuggestions(query);
    }
  }}>
    <input 
      type="text" 
      bind:value={query} 
      on:input={handleInput}
      on:focus={() => { if (suggestions.length > 0) showDropdown = true; }}
      placeholder="Search for a city..." 
      class="search-input" 
    />
    <button type="submit" class="search-button" aria-label="Search">
      {#if loading}
        <div class="spinner-small"></div>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      {/if}
    </button>
  </form>

  {#if showDropdown}
    <ul class="dropdown">
      {#each suggestions as s}
        <li>
          <button type="button" class="suggestion-item" on:click={() => handleSelect(s)}>
            <span class="location-name">{s.name}</span>
            <span class="location-details">
              {#if s.admin1}{s.admin1}, {/if}{s.country}
            </span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="sass">
  .search-container
    position: relative
    width: 100%
    margin-bottom: 2rem
    z-index: 50

  .search-bar
    --glass-bg: rgba(30, 41, 59, 0.45)
    --glass-border: rgba(255, 255, 255, 0.08)
    --glass-radius: 12px
    --glass-shadow: 0 4px 16px rgba(0, 0, 0, 0.1)
    
    display: flex
    align-items: center
    background: var(--glass-bg)
    border: 1px solid var(--glass-border)
    border-radius: var(--glass-radius)
    box-shadow: var(--glass-shadow)
    backdrop-filter: blur(12px)
    -webkit-backdrop-filter: blur(12px)
    padding: 0.25rem 1rem
    width: 100%
    box-sizing: border-box
    transition: box-shadow 0.3s ease, border-color 0.3s ease, border-radius 0.2s ease
    
    &.open
      border-bottom-left-radius: 0
      border-bottom-right-radius: 0
      border-bottom-color: transparent

    &:focus-within
      border-color: rgba(255, 255, 255, 0.3)
      box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1)

  .search-input
    flex: 1
    background: transparent
    border: none
    color: rgba(255, 255, 255, 0.92)
    font-size: 1rem
    outline: none
    padding: 0.75rem 0
    font-family: inherit
    
    &::placeholder
      color: rgba(255, 255, 255, 0.5)

  .search-button
    background: transparent
    border: none
    color: rgba(255, 255, 255, 0.7)
    cursor: pointer
    padding: 0.5rem
    display: flex
    align-items: center
    justify-content: center
    transition: color 0.2s ease
    
    &:hover
      color: rgba(255, 255, 255, 0.92)

  .spinner-small
    width: 16px
    height: 16px
    border: 2px solid rgba(255, 255, 255, 0.2)
    border-radius: 50%
    border-top-color: rgba(255, 255, 255, 0.8)
    animation: spin-small 0.8s linear infinite

  @keyframes spin-small
    to
      transform: rotate(360deg)

  .dropdown
    position: absolute
    top: calc(100%)
    left: 0
    width: 100%
    margin: 0
    padding: 0.5rem 0
    list-style: none
    background: var(--glass-bg)
    border: 1px solid var(--glass-border)
    border-top: none
    border-radius: 0 0 var(--glass-radius) var(--glass-radius)
    box-shadow: var(--glass-shadow)
    backdrop-filter: blur(16px)
    -webkit-backdrop-filter: blur(16px)
    z-index: 10
    max-height: 250px
    overflow-y: auto

  .suggestion-item
    width: 100%
    display: flex
    flex-direction: column
    align-items: flex-start
    background: transparent
    border: none
    padding: 0.75rem 1.25rem
    color: rgba(255, 255, 255, 0.92)
    text-align: left
    cursor: pointer
    transition: background 0.2s ease
    
    &:hover
      background: rgba(255, 255, 255, 0.1)

  .location-name
    font-size: 1rem
    font-weight: 500

  .location-details
    font-size: 0.75rem
    color: rgba(255, 255, 255, 0.6)
    margin-top: 0.125rem
</style>
