<script lang="ts">
  import AddContact from "./AddContact.svelte";
  import BulkAddContact from "./BulkAddContact.svelte";
</script>

<div class="actions">
  <BulkAddContact />
  <AddContact />
</div>

<style lang="scss">
  .actions {
    display: flex;
    justify-content: flex-end;
    margin: 12px 16px;
    gap: 12px;
  }
</style>
