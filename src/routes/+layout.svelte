<script lang="ts">
  import "./styles.scss";

  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";

  import { browser } from "$app/environment";

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  });
</script>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>
