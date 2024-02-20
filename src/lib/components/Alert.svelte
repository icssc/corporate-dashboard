<script lang="ts">
  import { createDialog, melt } from "@melt-ui/svelte";
  import type { SvelteComponent, ComponentType } from "svelte";
  import { fade } from "svelte/transition";

  export let title: string;
  export let confirmText: string;
  export let confirmIcon: ComponentType<SvelteComponent<{ size?: number | string }>> | undefined =
    undefined;

  const {
    elements: { trigger, overlay, content, title: titleElement, close, portalled },
    states: { open },
  } = createDialog({
    role: "alertdialog",
  });
</script>

<slot name="trigger" trigger={$trigger} />

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="overlay" transition:fade={{ duration: 150 }} />
    <div use:melt={$content} transition:fade={{ duration: 100 }} class="content">
      <h2 use:melt={$titleElement}>{title}</h2>
      <p class="tooltip">
        <slot name="tooltip" />
      </p>
      <div class="actions">
        <button use:melt={$close} aria-label="cancel" class="cancel">Cancel</button>
        <button class="confirm"
          ><svelte:component this={confirmIcon} size={14} />{confirmText}</button
        >
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$lib/styles/button" as button;

  .content {
    z-index: 1000;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 512px;
    width: 100%;
    border-radius: 12px;
    border: 1px solid var(--gray100);
    background-color: var(--background);

    h2 {
      font-size: 20px;
      font-weight: 500;
      margin: 24px 16px;
    }

    .tooltip {
      font-size: 14px;
      line-height: 20px;
      margin: 16px;
      overflow-wrap: break-word;

      :global(a) {
        color: var(--pink400);
      }
    }

    .actions {
      display: flex;
      gap: 8px;
      margin: 16px;

      button {
        @include button.button;
        width: 100%;
      }
    }
  }

  .overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
  }
</style>
