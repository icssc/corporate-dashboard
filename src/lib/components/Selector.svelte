<script lang="ts">
  import { createPopover, melt } from "@melt-ui/svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import { ChevronsUpDown } from "lucide-svelte";
  import { fade } from "svelte/transition";

  import Content from "./Content.svelte";

  import type { GetMember } from "$api/members/[id]";
  import { page } from "$app/stores";

  $: memberQuery = createQuery<GetMember>({
    queryKey: ["members", $page.params.selectedMember],
    queryFn: async () => (await fetch(`/api/members/${$page.params.selectedMember}`)).json(),
  });

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

<button use:melt={$trigger} class="filter-selector" aria-label="Switch committee member filter">
  {#if $page.params.selectedMember}
    {#if $memberQuery.isSuccess}
      <span>{$memberQuery.data?.name ?? $memberQuery.data?.id}</span>
    {:else}
      <div class="skeleton" />
    {/if}
  {:else}
    <span>All Members</span>
  {/if}
  <div class="icon">
    <ChevronsUpDown size="16" />
  </div>
  <span class="sr-only">Open Popover</span>
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

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
    white-space: nowrap;
  }

  .skeleton {
    height: 20px;
    width: 128px;
    border-radius: 4px;
    background-color: var(--gray100);

    @keyframes pulse {
      0% {
        background-color: var(--gray100);
      }
      100% {
        background-color: var(--gray200);
      }
    }
    animation: pulse 1s ease-in-out infinite alternate both;
  }

  .content {
    position: absolute;
    border-radius: 12px;
    border: 1px solid var(--gray100);
    background-color: var(--background);
  }
</style>
