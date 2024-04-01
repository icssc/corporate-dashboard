<script lang="ts">
  import { Slash } from "lucide-svelte";

  import Selector from "./Selector.svelte";

  import { page } from "$app/stores";
  import Logo from "$lib/components/Logo.svelte";

  export let name: string | undefined;
</script>

<nav>
  <div class="left">
    <a id="logo" href="/">
      <Logo />
    </a>
    <div class="slash">
      <Slash size="16" />
    </div>
    <span>Corporate Contacts</span>
    {#if $page.route.id === "/(nav)/contacts/[[selectedMember]]"}
      <div class="slash">
        <Slash size="16" />
      </div>
      <Selector />
    {/if}
    {#if $page.route.id === "/(nav)/(dashboard)"}
      <div class="slash">
        <Slash size="16" />
      </div>
      <span>Dashboard</span>
    {/if}
  </div>
  {#if name}
    <div class="profile">
      {name.charAt(0)}
    </div>
  {/if}
</nav>

<style lang="scss">
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--gray100);
  }

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  #logo {
    width: 32px;
    line-height: 0;
    color: var(--gray600);

    &:hover {
      color: var(--pink400);
    }
  }

  .slash {
    line-height: 0;
    color: var(--gray200);
  }

  .profile {
    background-color: var(--periwinkle400);
    color: var(--background);
    display: grid;
    place-content: center;
    height: 32px;
    width: 32px;
    border-radius: 1000px;
  }
</style>
