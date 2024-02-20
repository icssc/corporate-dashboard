<script context="module" lang="ts">
  import type { Writable } from "svelte/store";

  export type SelectedContacts = Writable<string[]>;
</script>

<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import Actions from "./Actions.svelte";
  import Table from "./Table.svelte";

  const selectedContacts: SelectedContacts = writable([]);
  setContext("selectedContacts", selectedContacts);
</script>

<Actions />
<main>
  <Table />
</main>

<style lang="scss">
  main {
    overflow-x: auto;
  }
</style>
