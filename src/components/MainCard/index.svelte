<script lang="ts">
  export let title: string | undefined;
  export let subtitle: string | undefined;
</script>

<article class="glass-card">
  {#if title}
    <header class="glass-card__header">
      <h2 class="glass-card__title">{title}</h2>
      {#if subtitle}
        <p class="glass-card__subtitle">{subtitle}</p>
      {/if}
    </header>
  {/if}
  <div class="glass-card__content">
    <slot />
  </div>
</article>

<style lang="sass">
  .glass-card
    --glass-bg: rgba(30, 41, 59, 0.45)
    --glass-border: rgba(255, 255, 255, 0.08)
    --glass-radius: 16px
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.2)

    width: 80vw
    max-width: 80vw
    min-height: 200px
    padding: 1.5rem 1.75rem
    border-radius: var(--glass-radius)
    background: var(--glass-bg)
    border: 1px solid var(--glass-border)
    box-shadow: var(--glass-shadow)
    backdrop-filter: blur(12px)
    -webkit-backdrop-filter: blur(12px)
    color: rgba(255, 255, 255, 0.92)

  .glass-card__header
    margin-bottom: 1rem

  .glass-card__title
    margin: 0
    font-size: 1.25rem
    font-weight: 600
    letter-spacing: -0.02em

  .glass-card__subtitle
    margin: 0.25rem 0 0
    font-size: 0.875rem
    color: rgba(255, 255, 255, 0.7)

  .glass-card__content
    :global(*)
      margin: 0
</style>
