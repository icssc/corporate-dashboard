<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import type { LayoutData } from "./$types";

  import Nav from "$lib/components/Nav.svelte";

  export let data: LayoutData;

  setContext("selectedMember", writable({ value: data.selectedMember }));
</script>

<Nav name={data.name} />
<slot />
