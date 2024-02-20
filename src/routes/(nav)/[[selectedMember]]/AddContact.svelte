<script lang="ts">
  import { melt } from "@melt-ui/svelte";
  import { PlusCircle } from "lucide-svelte";
  import type { EventHandler } from "svelte/elements";

  import Dialog from "$lib/components/Dialog.svelte";
  import LabelInput from "$lib/components/LabelInput.svelte";

  const addContact: EventHandler<SubmitEvent, HTMLFormElement> = (e) => {
    const formData = new FormData(e.currentTarget);
    console.log(Object.fromEntries(formData.entries()));
  };
</script>

<Dialog title="Add Contact">
  <button let:trigger use:melt={trigger} slot="trigger">
    <PlusCircle size={14} /><span>Add Contact</span>
  </button>

  <form on:submit|preventDefault={addContact} id="add-contact">
    <LabelInput label="Company" name="company" placeholder="Company" />
    <LabelInput label="Contact Name" name="contact-name" placeholder="Contact Name" />
    <LabelInput label="Contact Email" name="contact-email" placeholder="Contact Email" />
    <LabelInput label="Title" name="title" placeholder="Title" />
    <LabelInput label="Status" name="status" placeholder="Status" />
    <LabelInput label="Committee Member" name="committee-member" placeholder="Committee Member" />
    <LabelInput
      label="Last Contact Date"
      name="last-contact-date"
      placeholder="Last Contact Date"
    />
    <LabelInput label="Followup Date" name="followup-date" placeholder="Followup Date" />
    <LabelInput label="Notes" name="notes" placeholder="Notes" />
  </form>

  <button slot="bottom" class="action" form="add-contact">
    <PlusCircle size={14} /><span>Add Contact</span>
  </button>
</Dialog>

<style lang="scss">
  @use "$lib/styles/button" as button;

  button {
    @include button.button;
  }

  form {
    --input-margin: 0 0 16px 0;
    padding: 24px 16px;
  }

  .action {
    margin-left: auto;
  }
</style>
