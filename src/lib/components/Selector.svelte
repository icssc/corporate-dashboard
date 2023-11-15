<script lang="ts">
  import { createPopover, melt } from "@melt-ui/svelte";
  import { ChevronsUpDown } from "lucide-svelte";
  import { fade } from "svelte/transition";

  import Content from "./Content.svelte";

  const {
    elements: { trigger, content },
    states: { open },
  } = createPopover({
    positioning: {
      placement: "top-start",
      // offset doesn't work with gutter set (default value 5)
      gutter: undefined,
      offset: {
        mainAxis: 10,
        crossAxis: -8,
      },
    },
  });

  const close = () => {
    open.set(false);
  };
</script>

<button use:melt={$trigger} class="filter-selector" aria-label="Update dimensions">
  <span>All Members</span>
  <div class="icon">
    <ChevronsUpDown size="16" />
    <!-- <span class="sr-only">Open Popover</span> -->
  </div>
</button>

{#if $open}
  <div use:melt={$content} transition:fade={{ duration: 100 }} class="content">
    <!-- <div use:melt={$arrow} /> -->
    <Content {close} />
  </div>
{/if}

<style lang="scss">
  .filter-selector {
    all: unset;
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;

    .icon {
      line-height: 0;
      color: var(--gray400);
      padding: 8px 2px;
      border-radius: 4px;

      &:hover {
        background-color: var(--gray100);
      }
    }
  }

  .content {
    position: absolute;
    border-radius: 12px;
    border: 1px solid var(--gray100);
    background-color: var(--background);
  }
</style>
