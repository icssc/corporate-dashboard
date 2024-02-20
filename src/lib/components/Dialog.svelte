<script lang="ts">
  import { createDialog, melt } from "@melt-ui/svelte";
  import { X } from "lucide-svelte";
  import { fade } from "svelte/transition";

  export let title: string;

  const {
    elements: { trigger, overlay, content, title: titleElement, close, portalled },
    states: { open },
  } = createDialog({});
</script>

<slot name="trigger" trigger={$trigger} />

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="overlay" transition:fade={{ duration: 150 }} />
    <div use:melt={$content} transition:fade={{ duration: 100 }} class="content">
      <div class="top">
        <h2 use:melt={$titleElement}>{title}</h2>
        <button use:melt={$close} aria-label="close" class="close">
          <X size={16} strokeWidth={4} />
        </button>
        <p class="tooltip">
          <slot name="tooltip" />
        </p>
      </div>
      <div class="middle">
        <slot />
      </div>
      <div class="bottom">
        <slot name="bottom" />
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$lib/styles/button" as button;

  .content {
    display: flex;
    flex-direction: column;
    z-index: 1000;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 512px;
    max-height: 100%;
    height: 512px;
    width: 100%;
    border-radius: 12px;
    border: 1px solid var(--gray100);
    background-color: var(--background);

    h2 {
      font-size: 20px;
      font-weight: 500;
      margin: 24px 16px;
    }

    .top {
      border-bottom: 1px solid var(--gray100);

      .tooltip {
        font-size: 14px;
        line-height: 20px;
        margin: 16px;
        overflow-wrap: break-word;

        :global(a) {
          color: var(--pink400);
        }
      }
    }

    .middle {
      overflow-y: auto;
    }

    .bottom {
      border-top: 1px solid var(--gray100);
      padding: 16px;
    }

    .close {
      @include button.button;
      position: fixed;
      top: 16px;
      right: 16px;
    }
  }

  .overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
  }
</style>
