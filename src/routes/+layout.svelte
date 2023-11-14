<script lang="ts">
  import "./styles.scss";

  import type { LayoutData } from "./$types";
  import { browser } from "$app/environment";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import Nav from "$lib/components/Nav.svelte";

  export let data: LayoutData;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  });
</script>

<QueryClientProvider client={queryClient}>
  <Nav name={data.name} />
  <slot />
</QueryClientProvider>
