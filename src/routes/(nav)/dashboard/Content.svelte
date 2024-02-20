<script lang="ts">
  import { createCombobox, melt } from "@melt-ui/svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import { Check } from "lucide-svelte";

  import type { GetMembers } from "$api/members";
  import { page } from "$app/stores";
  import Line from "$lib/components/Line.svelte";

  export let selectedUser: string | undefined;

  const {
    elements: { menu, input, option },
    states: { inputValue },
    helpers: { isSelected },
  } = createCombobox<string | undefined>({
    onSelectedChange: ({ next }) => {
      selectedUser = next?.value;
      return next;
    },
    forceVisible: true,
    positioning: null,
    defaultSelected: {
      value: $page.params.selectedMember,
    },
  });

  const allMembersQuery = createQuery<GetMembers>({
    queryKey: ["members", "UNAUTHORIZED"],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("role", JSON.stringify(["UNAUTHORIZED"]));

      return (await fetch("/api/members?" + params)).json();
    },
  });

  $: allMembers = ($allMembersQuery.isSuccess ? $allMembersQuery.data : []) as GetMembers;
  let filteredMembers = [] as GetMembers;

  $: filteredMembersQuery = createQuery<GetMembers>({
    queryKey: ["members", "UNAUTHORIZED", $inputValue],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("role", JSON.stringify(["UNAUTHORIZED"]));
      params.set("search", $inputValue);

      return (await fetch("/api/members?" + params)).json();
    },
  });

  $: if ($filteredMembersQuery.isSuccess === true) filteredMembers = $filteredMembersQuery.data;
</script>

<div class="sticky">
  <input use:melt={$input} class="input" placeholder="Search users" aria-label="Search users" />
  <Line loading={$filteredMembersQuery.isLoading} />
</div>
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
      <li>No non-member users found</li>
    {/each}
  </div>
</ul>

<style lang="scss">
  .sticky {
    position: sticky;
    top: 0;
  }

  .input {
    all: unset;
    cursor: text;
    padding: 16px;
    min-width: 325px;
    width: 100%;
    box-sizing: border-box;
    background-color: var(--background);
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
