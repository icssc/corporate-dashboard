<script lang="ts">
  import type { LayoutData } from "./$types";

  import Nav from "$lib/components/Nav.svelte";

  export let data: LayoutData;
</script>

<Nav name={data.name} />
<slot />
