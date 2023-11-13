<script lang="ts">
  import type { GetContacts } from "$api/contacts";
  import { createQuery } from "@tanstack/svelte-query";

  const query = createQuery<GetContacts>({
    queryKey: ["repoData"],
    queryFn: async () => await fetch("/api/contacts").then((r) => r.json()),
  });

  $: console.log($query.data);
</script>

<table>
  <thead>
    <tr>
      <th>Company</th>
      <th>Contact Name</th>
      <th>Contact Email</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {#if $query.isSuccess}
      {#each $query.data as { id, name, email, company, status } (id)}
        <tr>
          <td>{company.name}</td>
          <td>{name}</td>
          <td>{email}</td>
          <td>{status}</td>
        </tr>
      {/each}
    {/if}
  </tbody>
</table>
