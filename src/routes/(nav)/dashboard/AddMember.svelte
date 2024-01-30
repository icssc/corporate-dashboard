<script lang="ts">
  import { createDialog, melt } from "@melt-ui/svelte";
  import { PlusCircle } from "lucide-svelte";
  import { fade } from "svelte/transition";

  import Content from "./Content.svelte";

  const {
    elements: { trigger, overlay, content, title, portalled },
    states: { open },
  } = createDialog({});
</script>

<button use:melt={$trigger}><PlusCircle size={14} /><span>Add Member</span></button>

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="" transition:fade={{ duration: 150 }} />
    <div use:melt={$content} transition:fade={{ duration: 100 }} class="content">
      <h2 use:melt={$title}>Add Member</h2>
      <Content
        close={() => {
          $open = false;
        }}
      />
    </div>
  {/if}
</div>

<style lang="scss">
  button {
    all: unset;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    border-radius: 6px;
    background-color: var(--gray100);
    border: 1px solid var(--gray200);
    padding: 6px 12px;
    transform: scale(1);
    transition:
      transform 250ms cubic-bezier(0.76, 0, 0.24, 1),
      border 250ms cubic-bezier(0.76, 0, 0.24, 1);

    &:hover {
      border: 1px solid var(--gray300);
      transform: scale(1.015);
    }
  }

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
