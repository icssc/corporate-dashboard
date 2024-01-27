<script lang="ts">
  import { createCombobox, melt } from "@melt-ui/svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import { Check } from "lucide-svelte";
  import { derived } from "svelte/store";

  import Line from "./Line.svelte";

  import type { GetMembers } from "$api/members";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let close: () => void;

  const {
    elements: { menu, input, option },
    states: { inputValue },
    helpers: { isSelected },
  } = createCombobox<string | undefined>({
    onSelectedChange: ({ next }) => {
      if (next?.value === null) {
        goto("/");
        close();
        return undefined;
      }
      if (next?.value) {
        goto(next.value);
        close();
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

  const queryOptions = derived(inputValue, ($inputValue) => {
    return {
      queryKey: ["members", $inputValue],
      queryFn: async () => {
        const params = new URLSearchParams();
        params.set("search", $inputValue);
        return (await fetch("/api/members?" + params)).json();
      },
    };
  });

  const filteredMembersQuery = createQuery<GetMembers>(queryOptions);

  $: if ($filteredMembersQuery.isSuccess === true) filteredMembers = $filteredMembersQuery.data;
</script>

<div class="parent">
  <input use:melt={$input} class="input" placeholder="Search members" aria-label="Search members" />
  <Line loading={$filteredMembersQuery.isLoading} />
  <ul use:melt={$menu}>
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div tabindex="0">
      <li
        use:melt={$option({
          value: undefined,
          label: "All Members",
        })}
      >
        <span>All Members</span>
        {#if $isSelected(undefined)}
          <Check size="16" />
        {/if}
      </li>
      <div class="line" />
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
</div>

<style lang="scss">
  .parent {
    max-height: 512px;
    display: flex;
    flex-direction: column;
  }

  .input {
    all: unset;
    padding: 16px;
    width: 325px;
  }

  $padding: 6px;
  ul {
    margin: 0;
    padding: $padding;
    flex: 1;
    overflow: auto;

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

  .line {
    margin: 8px (-$padding);
    border-bottom: 1px solid var(--gray100);
  }
</style>
