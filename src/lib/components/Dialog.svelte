<script lang="ts">
  import { createDialog, melt } from "@melt-ui/svelte";
  import { fade } from "svelte/transition";

  export let title: string;

  const {
    elements: { trigger, overlay, content, title: titleElement, portalled },
    states: { open },
  } = createDialog({});
</script>

<slot name="trigger" trigger={$trigger} />

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="" transition:fade={{ duration: 150 }} />
    <div use:melt={$content} transition:fade={{ duration: 100 }} class="content">
      <h2 use:melt={$titleElement}>{title}</h2>
      <slot />
    </div>
  {/if}
</div>

<style lang="scss">
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
      margin: 24px 16px 0 16px;
    }
  }
</style>
