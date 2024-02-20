<script lang="ts">
  import { melt } from "@melt-ui/svelte";
  import { useQueryClient } from "@tanstack/svelte-query";
  import { UserPlus } from "lucide-svelte";

  import Content from "./Content.svelte";

  import Dialog from "$lib/components/Dialog.svelte";

  let selectedUser: string | undefined;

  let closeDialog: () => void;

  const queryClient = useQueryClient();
  const addMember = async () => {
    await fetch(`/api/members/${selectedUser}`, {
      method: "PUT",
      body: JSON.stringify({ role: "MEMBER" }),
    });

    queryClient.invalidateQueries({
      queryKey: ["members"],
      exact: true,
    });

    closeDialog();
  };
</script>

<Dialog bind:closeDialog title="Add Member">
  <svelte:fragment slot="tooltip">
    Members must register by visiting and signing in at
    <a href="https://corporate.internal.icssc.club">https://corporate.internal.icssc.club</a>
    before they're discoverable.
  </svelte:fragment>
  <button let:trigger use:melt={trigger} slot="trigger">
    <UserPlus size={14} /><span>Add Member</span>
  </button>
  <Content bind:selectedUser />
  <button on:click={addMember} slot="bottom" class="action">
    <UserPlus size={14} /><span>Add Member</span>
  </button>
</Dialog>

<style lang="scss">
  @use "$lib/styles/button" as button;

  button {
    @include button.button;
  }

  .action {
    margin-left: auto;
  }
</style>
