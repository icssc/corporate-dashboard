<script lang="ts">
  import { createDialog, melt } from "@melt-ui/svelte";
  import { X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  // Internal helpers

  export let dialogTitle: string;
  export let dialogContent: string;

  const {
    elements: { trigger, overlay, content, title, description, close, portalled },
    states: { open },
  } = createDialog({
    forceVisible: true,
  });
</script>

<button use:melt={$trigger} class="trigger"> View {dialogTitle} </button>
<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="overlay" transition:fade={{ duration: 150 }} />
    <div
      use:melt={$content}
      class="content"
      transition:fly={{
        x: -350,
        duration: 300,
        opacity: 1,
      }}
    >
      <button use:melt={$close} aria-label="Close" class="close">
        <X class="square-4" />
      </button>
      <h2 use:melt={$title} class="title">{dialogTitle}</h2>
      <p use:melt={$description} class="description">{dialogContent}</p>
    </div>
  {/if}
</div>

<style lang="scss">
  .trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    background-color: var(--background);
    font-weight: 500;
    line-height: 1;
    color: var(--periwinkle600);
    box-shadow: 0 10px 15px -3px 0 4px 6px -4px;
  }

  .trigger:hover {
    opacity: 0.7;
  }

  .overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    background-color: var(--gray600);
    opacity: 0.5;
  }

  .content {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 50;
    height: 100vh;
    max-width: 500px;
    width: 100%;
    padding: 1.5rem;
    background-color: var(--background);
    box-shadow:
      0 10px 15px -3px var(--gray200),
      0 4px 6px -4px var(--gray200);
  }

  .content:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  .close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 10px;
    top: 10px;
    appearance: none;
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 9999px;
    color: var(--periwinkle300);
  }

  .close:hover {
    background-color: var(--periwinkle400);
  }

  .close:focus {
    outline: 1px solid transparent;
    outline-offset: 2px;
    box-shadow: 0px 0px 0px 3px var(--gray100);
  }

  .title {
    margin: 0;
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 500;
    margin-top: 3rem;
  }

  .description {
    margin-bottom: 1.25rem;
    margin-top: 0.5rem;
    line-height: 1.5;
  }
</style>
