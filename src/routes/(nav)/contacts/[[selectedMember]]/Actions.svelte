<script lang="ts">
  import AddContact from "./AddContact.svelte";
  import BulkAddContact from "./BulkAddContact.svelte";
  import SendEmails from "./SendEmails.svelte";
</script>

<div class="actions">
  <SendEmails />
  <BulkAddContact />
  <AddContact />
</div>

<style lang="scss">
  .actions {
    top: 0;
    position: sticky;
    display: flex;
    justify-content: flex-end;
    padding: 12px 16px;
    gap: 12px;
    background-color: var(--background);
    z-index: 500;
    border-bottom: 1px solid var(--gray100);
  }
</style>
