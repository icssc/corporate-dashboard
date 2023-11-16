<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";

  import type { PageData } from "./$types";

  import type { GetContacts } from "$api/contacts";
  import Line from "$lib/components/Line.svelte";

  export let data: PageData;

  $: contactsQuery = createQuery<GetContacts>({
    queryKey: ["contacts", data.selectedMember],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (data.selectedMember) params.append("filter", data.selectedMember);
      return (await fetch("/api/contacts?" + params.toString())).json();
    },
  });
</script>

<main>
  <table>
    <thead>
      <tr>
        <th>Company</th>
        <th>Contact Name</th>
        <th>Contact Email</th>
        <th>Title</th>
        <th>Status</th>
        <th>Committee Member</th>
        <th>Last Contact Date</th>
        <th>Followup Date</th>
        <div class="line-parent" aria-hidden>
          <div class="line">
            <Line loading={$contactsQuery.isLoading} />
          </div>
        </div>
      </tr>
    </thead>
    <tbody>
      {#if $contactsQuery.isSuccess}
        {#each $contactsQuery.data as { id, name, email, title, status, committeeMember, lastContactDate, followupDate, company } (id)}
          <tr>
            <td>{company.name}</td>
            <td>{name}</td>
            <td>{email ?? ""}</td>
            <td>{title ?? ""}</td>
            <td>{status}</td>
            <td>{committeeMember?.name ?? ""}</td>
            <td>{lastContactDate ?? ""}</td>
            <td>{followupDate ?? ""}</td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</main>

<style lang="scss">
  main {
    overflow-x: auto;
  }

  // loading line positioning
  tr {
    $line-height: 1px;
    position: relative;

    th {
      border-bottom: $line-height solid var(--gray100);
    }

    .line-parent {
      position: absolute;
      bottom: $line-height;
    }

    .line {
      position: fixed;
      left: 0;
      right: 0;
    }
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

      &:first-child {
        border-left: none;
        padding-left: 16px;
      }
    }

    th {
      border-left: 0.75px solid var(--gray100);
    }

    td {
      $border: 0.75px solid var(--gray100);
      border-left: $border;
      border-bottom: $border;
    }
  }
</style>
