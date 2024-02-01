<script lang="ts">
  import { createCombobox, melt } from "@melt-ui/svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import { Check } from "lucide-svelte";

  import type { GetMembers } from "$api/members";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Line from "$lib/components/Line.svelte";

  const {
    elements: { menu, input, option },
    states: { inputValue },
    helpers: { isSelected },
  } = createCombobox<string | undefined>({
    onSelectedChange: ({ next }) => {
      if (next?.value) {
        goto(next.value);
        return undefined;
      }
      return undefined;
    },
    forceVisible: true,
    positioning: null,
    defaultSelected: {
      value: $page.params.selectedMember,
    },
  });

  const allMembersQuery = createQuery<GetMembers>({
    queryKey: ["members"],
    queryFn: async () => await fetch("/api/members").then((r) => r.json()),
  });

  $: allMembers = ($allMembersQuery.isSuccess ? $allMembersQuery.data : []) as GetMembers;
  let filteredMembers = [] as GetMembers;

  $: filteredMembersQuery = createQuery<GetMembers>({
    queryKey: ["members", $inputValue],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("search", $inputValue);
      return (await fetch("/api/members?" + params)).json();
    },
  });

  $: if ($filteredMembersQuery.isSuccess === true) filteredMembers = $filteredMembersQuery.data;
</script>

<p class="tooltip">
  Members must sign up by visiting
  <a href="https://corporate.internal.icssc.club">https://corporate.internal.icssc.club</a>
  before they're discoverable.
</p>
<input use:melt={$input} class="input" placeholder="Search members" aria-label="Search members" />
<Line loading={$filteredMembersQuery.isLoading} />
<ul use:melt={$menu}>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div tabindex="0">
    {#each filteredMembers ?? allMembers as { id, name } (id)}
      <li
        use:melt={$option({
          value: id,
          label: name ?? id,
        })}
      >
        <span>{name ?? id}</span>
        {#if $isSelected(id)}
          <Check size="16" />
        {/if}
      </li>
    {:else}
      <li>No members found</li>
    {/each}
  </div>
</ul>

<style lang="scss">
  .tooltip {
    font-size: 14px;
    line-height: 20px;
    margin: 0;
    padding: 16px;
    border-bottom: 1px solid var(--gray100);
    overflow-wrap: break-word;

    a {
      color: var(--pink400);
    }
  }

  .input {
    all: unset;
    padding: 16px;
    min-width: 325px;
    width: 100%;
    box-sizing: border-box;
  }

  $padding: 6px;
  ul {
    margin: 0;
    padding: $padding;
    overflow-y: auto;

    // not nesting in li below + using :global to prevent `css-unused-selector`
    :global([data-disabled]) {
      color: var(--gray400);
    }
    :global(li[data-highlighted]) {
      background-color: var(--gray100);
    }
    :global(li[data-selected]) {
      background-color: var(--gray200);
    }
  }

  li {
    padding: 12px;
    border-radius: 6px;
    list-style-type: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
