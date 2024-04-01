<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { TableIcon } from "lucide-svelte";

  import type { PageData } from "./$types";
  import AddMember from "./AddMember.svelte";

  import type { GetMembers } from "$api/members";
  import type { GetMembersCount } from "$api/members/count";
  import LineTableRow from "$lib/components/LineTableRow.svelte";
  import Skeleton from "$lib/components/Skeleton.svelte";

  export let data: PageData;

  $: membersQuery = createQuery<GetMembers>({
    queryKey: ["members"],
    queryFn: async () => {
      return (await fetch("/api/members")).json();
    },
    refetchInterval: 2500,
  });
  $: membersCountAdminQuery = createQuery<GetMembersCount>({
    queryKey: ["members-count", "ADMIN"],
    queryFn: async () => {
      const params = new URLSearchParams({ role: "ADMIN" });
      return (await fetch("/api/members/count?" + params.toString())).json();
    },
  });
  $: membersCountMemberQuery = createQuery<GetMembersCount>({
    queryKey: ["members-count", "MEMBER"],
    queryFn: async () => {
      const params = new URLSearchParams({ role: "MEMBER" });
      return (await fetch("/api/members/count?" + params.toString())).json();
    },
  });
</script>

<main>
  <h1>Hello, {data.name}</h1>
  <noscript>This Application Requires JS to Work </noscript>
  <a class="contacts" href="/contacts">
    <TableIcon strokeWidth={1.5} />
    <span>View Contacts ↗</span>
  </a>
  <div class="header">
    <h2>Members</h2>
    <div class="counts">
      <span class="count">
        {#if $membersCountAdminQuery.isSuccess}
          <span>{$membersCountAdminQuery.data.count}</span>
        {:else}
          <span><Skeleton height={16} width={24} /></span>
        {/if}
        Admins
      </span>
      <span class="count">
        {#if $membersCountMemberQuery.isSuccess}
          <span>{$membersCountMemberQuery.data.count}</span>
        {:else}
          <span><Skeleton height={16} width={24} /></span>
        {/if}
        Members
      </span>
    </div>
  </div>
  <div class="table-parent">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
        <LineTableRow loading={$membersQuery.isLoading} />
      </thead>
      <tbody>
        {#if $membersQuery.isSuccess}
          {#each $membersQuery.data as { id, name, email, role } (id)}
            <tr>
              <td>{name}</td>
              <td>{email}</td>
              <td>{role}</td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  <div class="actions">
    <AddMember />
  </div>
</main>

<style lang="scss">
  h1 {
    font-size: 28px;
    font-weight: 500;
    margin: 48px 16px;
  }

  .contacts {
    display: block;
    margin: 48px 16px;
    padding: 12px;
    border-radius: 6px;
    color: var(--gray600);
    border: var(--gray300) 1px solid;
    display: flex;
    flex-direction: column;
    gap: 48px;
    max-width: 480px;
    text-decoration: none;
    font-size: 16px;
    transition: border 100ms ease-in-out;

    &:hover {
      border-color: var(--gray100);
    }
  }

  .header {
    margin: 16px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    h2 {
      font-size: 20px;
      font-weight: 500;
      margin: 0;
    }

    .counts {
      display: flex;
      align-items: baseline;
      gap: 12px;
      font-size: 14px;

      .count {
        display: flex;
        align-items: flex-end;
        gap: 4px;
      }
    }
  }

  .table-parent {
    overflow-x: auto;
    width: 100%;
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
      border-top: 1px solid var(--gray100);
      border-left: 0.75px solid var(--gray100);
    }

    td {
      $border: 0.75px solid var(--gray100);
      border-left: $border;
      border-bottom: $border;
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin: 12px 16px;
    gap: 12px;
  }

  noscript {
    color: red;
    padding-left: 16px;
    font-weight: bold;
    font-size: 20px;
  }
</style>
