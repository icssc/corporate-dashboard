<script lang="ts">
  import { melt } from "@melt-ui/svelte";
  import { Send } from "lucide-svelte";
  import { getContext } from "svelte";

  import type { SelectedContacts } from "./+page.svelte";

  import Alert from "$lib/components/Alert.svelte";

  const selectedRows = getContext<SelectedContacts>("selectedContacts");
</script>

<Alert title="Send Emails" confirmText="Send" confirmIcon={Send}>
  <svelte:fragment slot="tooltip"
    >You have {$selectedRows.length} contacts selected.</svelte:fragment
  >
  <button let:trigger use:melt={trigger} slot="trigger">
    <Send size={14} /><span>Send Emails</span>
  </button>
</Alert>

<style lang="scss">
  @use "$lib/styles/button" as button;

  button {
    @include button.button;
  }
</style>
