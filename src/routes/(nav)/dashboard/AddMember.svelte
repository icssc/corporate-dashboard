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
  button {
    all: unset;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    border-radius: 6px;
    background-color: var(--gray100);
    border: 1px solid var(--gray200);
    padding: 6px 12px;
    transform: scale(1);
    transition:
      transform 250ms cubic-bezier(0.76, 0, 0.24, 1),
      border 250ms cubic-bezier(0.76, 0, 0.24, 1);

    &:hover {
      border: 1px solid var(--gray300);
      transform: scale(1.015);
    }
  }
</style>
