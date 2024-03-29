<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import {
    createSvelteTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
  } from "@tanstack/svelte-table";
  import type { SortingState, RowSelectionState, TableOptions } from "@tanstack/svelte-table";
  import { Check } from "lucide-svelte";
  import { getContext } from "svelte";
  import { writable } from "svelte/store";

  import type { SelectedContacts } from "./+page.svelte";

  import type { GetContacts } from "$api/contacts";
  import { page } from "$app/stores";
  import Drawer from "$lib/components/Drawer.svelte";
  import LineTableRow from "$lib/components/LineTableRow.svelte";
  import { formatDateToPST } from "$lib/util/formatDateToPST";

  const selectedRows = getContext<SelectedContacts>("selectedContacts");

  let sorting = [] as SortingState;
  let rowSelection = {} as RowSelectionState;
  const columnHelper = createColumnHelper<GetContacts[0]>();
  const options = writable<TableOptions<GetContacts[0]>>({
    data: [],
    getRowId: (row) => row.id,
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
        cell: (props) => formatDateToPST(props.getValue()),
      }),
      columnHelper.accessor("followupDate", {
        header: "Followup Date",
        cell: (props) => formatDateToPST(props.getValue()),
      }),
      columnHelper.accessor("notes", {
        header: "Notes",
      }),
    ],
    state: {
      sorting,
      rowSelection,
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
    enableMultiRowSelection: true,
    onRowSelectionChange: (updater) => {
      if (updater instanceof Function) {
        rowSelection = updater(rowSelection);
      } else {
        rowSelection = updater;
      }

      const selectedRowIds = Object.keys(rowSelection).filter((key) => rowSelection[key]);
      selectedRows.set(selectedRowIds);

      options.update((old) => ({
        ...old,
        state: {
          ...old.state,
          rowSelection,
        },
      }));
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const table = createSvelteTable(options);

  $: selectedMember = $page.params.selectedMember;

  $: contactsQuery = createQuery<GetContacts>({
    queryKey: ["contacts", selectedMember],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedMember) params.append("filter", selectedMember);
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

<table>
  <thead>
    {#each $table.getHeaderGroups() as headerGroup}
      <tr>
        <th class="padding-left">
          <button
            class="select"
            class:is-selected={$table.getIsAllPageRowsSelected()}
            on:click={() => {
              $table.toggleAllPageRowsSelected();
            }}
          >
            {#if $table.getIsAllPageRowsSelected()}
              <Check size={16} />
            {/if}
          </button>
        </th>
        {#each headerGroup.headers as header}
          <th colSpan={header.colSpan}>
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
    <noscript>
      <tr>
        <td class="no-js"> This Application Requires JS to Work </td>
      </tr>
    </noscript>
    <LineTableRow loading={$contactsQuery.isLoading} />
  </thead>
  <tbody>
    {#each $table.getRowModel().rows.slice(0, 10) as row}
      <tr class:selected={row.getIsSelected()}>
        <td class="padding-left">
          <button
            class="select"
            class:is-selected={row.getIsSelected()}
            on:click={() => {
              row.toggleSelected();
            }}
          >
            {#if row.getIsSelected()}
              <Check size={16} />
            {/if}
          </button>
        </td>
        {#each row.getVisibleCells() as cell}
          <td>
            {#if cell.column.id === "notes"}
              <Drawer
                side="right"
                dialogTitle="Notes"
                dialogContent={cell.getValue() ? String(cell.getValue()) : "No notes provided."}
              />
            {:else}
              <svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  table {
    text-align: left;
    min-width: 100%;
    border-spacing: 0;

    .select {
      all: unset;
      border: 1px solid var(--gray600);
      border-radius: 4px;
      height: 16px;
      width: 16px;
      color: var(--background);

      &.is-selected {
        background-color: var(--gray600);
      }
    }

    tbody tr {
      &.selected {
        background-color: var(--pink100);

        &:hover {
          background-color: var(--pink200);
        }
      }

      &:hover {
        background-color: var(--gray100);
      }
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

    .no-js {
      color: red;
      padding-left: 16px;
      font-weight: bold;
      font-size: 20px;
    }

    td {
      $border: 0.75px solid var(--gray100);
      border-left: $border;
      border-bottom: $border;
    }
  }
</style>
