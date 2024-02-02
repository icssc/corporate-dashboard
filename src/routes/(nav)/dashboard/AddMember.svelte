<script lang="ts">
  import { melt } from "@melt-ui/svelte";
  import { PlusCircle } from "lucide-svelte";

  import Content from "./Content.svelte";

  import Dialog from "$lib/components/Dialog.svelte";
</script>

<Dialog title="Add Member">
  <button let:trigger use:melt={trigger} slot="trigger">
    <PlusCircle size={14} /><span>Add Member</span>
  </button>
  <Content />
</Dialog>

<style lang="scss">
  @use "$lib/styles/button" as button;

  button {
    @include button.button;
  }
</style>
