<script lang="ts">
  import type { GetCompany } from "$api/company";
  import { createQuery } from "@tanstack/svelte-query";

  const query = createQuery<GetCompany>({
    queryKey: ["repoData"],
    queryFn: async () => await fetch("/api/company").then((r) => r.json()),
  });

  $: console.log($query.data);
</script>

<table>
  <thead>
    <tr>
      <th>Contact Name</th>
      <th>Contact Email</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {#if $query.isSuccess}
      {#each $query.data as { id, name, url } (id)}
        <tr>
          <td>{name}</td>
          <td>{url}</td>
        </tr>
      {/each}
    {/if}
  </tbody>
</table>
