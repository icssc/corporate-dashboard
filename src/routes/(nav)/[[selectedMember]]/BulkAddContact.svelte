<script lang="ts">
  import { PlusCircle } from "lucide-svelte";
</script>

<button disabled>
  <PlusCircle size={14} /><span>Bulk Add Member</span>
</button>

<style lang="scss">
  @use "$lib/styles/button" as button;

  button {
    @include button.button;
  }
</style>
