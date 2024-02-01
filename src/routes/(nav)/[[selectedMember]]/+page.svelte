<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import {
    createSvelteTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
  } from "@tanstack/svelte-table";
  import type { SortingState, TableOptions } from "@tanstack/svelte-table";
  import { writable } from "svelte/store";

  import type { PageData } from "./$types";

  import type { GetContacts } from "$api/contacts";
  import LineTableRow from "$lib/components/LineTableRow.svelte";

  export let data: PageData;

  let sorting = [] as SortingState;
  const columnHelper = createColumnHelper<GetContacts[0]>();
  const options = writable<TableOptions<GetContacts[0]>>({
    data: [],
    columns: [
      columnHelper.accessor("company.name", {
        header: "Company",
      }),
      columnHelper.accessor("name", {
        header: "Contact Name",
      }),
      columnHelper.accessor("email", {
        header: "Contact Email",
      }),
      columnHelper.accessor("title", {
        header: "Title",
      }),
      columnHelper.accessor("status", {
        header: "Status",
      }),
      columnHelper.accessor("committeeMember", {
        header: "Committee Member",
      }),
      columnHelper.accessor("lastContactDate", {
        header: "Last Contact Date",
      }),
      columnHelper.accessor("followupDate", {
        header: "Followup Date",
      }),
      columnHelper.accessor("notes", {
        header: "Notes",
      }),
    ],
    state: {
      sorting,
    },
    onSortingChange: (updater) => {
      if (updater instanceof Function) {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }

      options.update((old) => ({
        ...old,
        state: {
          ...old.state,
          sorting,
        },
      }));
    },
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const table = createSvelteTable(options);

  $: contactsQuery = createQuery<GetContacts>({
    queryKey: ["contacts", data.selectedMember],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (data.selectedMember) params.append("filter", data.selectedMember);
      if (sorting[0]) params.append("sorting", JSON.stringify(sorting));
      return (await fetch("/api/contacts?" + params.toString())).json();
    },
  });

  $: (() => {
    const data = $contactsQuery.data;

    if (data) {
      options.update((options) => ({
        ...options,
        data,
      }));
    }
  })();
</script>

<main>
  <table>
    <thead>
      {#each $table.getHeaderGroups() as headerGroup}
        <tr>
          {#each headerGroup.headers as header, i}
            <th colSpan={header.colSpan} class:padding-left={i === 0}>
              {#if !header.isPlaceholder}
                <button
                  class="sort-button"
                  class:cursor-pointer={header.column.getCanSort()}
                  class:select-none={header.column.getCanSort()}
                  on:click={header.column.getToggleSortingHandler()}
                >
                  <svelte:component
                    this={flexRender(header.column.columnDef.header, header.getContext())}
                  />
                  {#if header.column.getIsSorted() === "asc"}
                    🔼
                  {:else if header.column.getIsSorted() === "desc"}
                    🔽
                  {/if}
                </button>
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
      <LineTableRow loading={$contactsQuery.isLoading} />
    </thead>
    <tbody>
      {#each $table.getRowModel().rows.slice(0, 10) as row}
        <tr>
          {#each row.getVisibleCells() as cell, i}
            <td class:padding-left={i === 0}>
              <svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style lang="scss">
  main {
    overflow-x: auto;
  }

  table {
    text-align: left;
    min-width: 100%;
    border-spacing: 0;

    tbody tr:hover {
      background-color: var(--gray100);
    }

    th,
    td {
      padding: 6px 12px 6px 6px;
      white-space: nowrap;
      font-size: 14px;
    }

    .padding-left {
      border-left: none;
      padding-left: 16px;
    }

    th {
      border-left: 0.75px solid var(--gray100);

      .sort-button {
        all: unset;

        &.cursor-pointer {
          cursor: pointer;
        }

        &.select-none {
          user-select: none;
        }
      }
    }

    td {
      $border: 0.75px solid var(--gray100);
      border-left: $border;
      border-bottom: $border;
    }
  }
</style>
