<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";

  import type { GetContacts } from "$api/contacts";

  const query = createQuery<GetContacts>({
    queryKey: ["repoData"],
    queryFn: async () => await fetch("/api/contacts").then((r) => r.json()),
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
        <th>Last Contact Date</th>
        <th>Followup Date</th>
      </tr>
    </thead>
    <tbody>
      {#if $query.isSuccess}
        {#each $query.data as { id, name, email, title, status, lastContactDate, followupDate, company } (id)}
          <tr>
            <td>{company.name}</td>
            <td>{name}</td>
            <td>{email ?? ""}</td>
            <td>{title ?? ""}</td>
            <td>{status}</td>
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

  table {
    text-align: left;
    min-width: 100%;
    border-spacing: 0;

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
      border-bottom: 1px solid var(--gray100);
    }

    td {
      $border: 0.75px solid var(--gray100);
      border-left: $border;
      border-bottom: $border;
    }
  }
</style>
