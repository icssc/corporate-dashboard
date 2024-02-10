<script lang="ts">
  import { createDialog, melt } from "@melt-ui/svelte";
  import { X } from "lucide-svelte";
  import { fade, fly, type FlyParams } from "svelte/transition";

  export let side: string = "left";
  export let dialogTitle: string = "Empty";
  export let dialogContent: string = "Empty";

  const {
    elements: { trigger, overlay, content, title, description, close, portalled },
    states: { open },
  } = createDialog({
    forceVisible: true,
  });

  let transition: FlyParams;
  let position: string;
  switch (side) {
    case "right":
      transition = { x: window.innerWidth, duration: 600, opacity: 1 };
      position = "right";
      break;
    case "top":
      transition = { y: -window.innerHeight, duration: 600, opacity: 1 };
      position = "top";
      break;
    case "bottom":
      transition = { y: window.innerHeight, duration: 600, opacity: 1 };
      position = "bottom";
      break;
    case "left":
    default:
      transition = { x: -window.innerWidth, duration: 600, opacity: 1 };
      position = "left";
      break;
  }
</script>

<button use:melt={$trigger} class="trigger"> View {dialogTitle} </button>
<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="overlay" transition:fade={{ duration: 300 }} />
    <div use:melt={$content} class="content {position}" transition:fly={transition}>
      <button use:melt={$close} aria-label="Close" class="close {position}">
        <X class="square-4" />
      </button>
      <h2 use:melt={$title} class="title">{dialogTitle}</h2>
      <p use:melt={$description} class="description">{dialogContent}</p>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$lib/styles/button" as button;

  button {
    @include button.button;
  }

  .overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    background-color: var(--gray600);
    opacity: 0.5;
  }

  .content {
    position: fixed;
    z-index: 50;
    padding: 1.5rem;
    background-color: var(--background);
    box-shadow:
      0 10px 15px -3px var(--gray200),
      0 4px 6px -4px var(--gray200);
  }

  .content.right {
    right: 0;
    top: 0;
    height: 100vh;
    max-width: 500px;
    width: 100%;
  }

  .content.left {
    left: 0;
    top: 0;
    height: 100vh;
    max-width: 500px;
    width: 100%;
  }

  .content.top {
    top: 0;
    height: 100%;
    max-height: 500px;
    width: 98vw;
  }

  .content.bottom {
    bottom: 0;
    height: 100%;
    max-height: 500px;
    width: 98vw;
  }

  .content:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  .title {
    margin: 0;
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 500;
    margin-top: 3rem;
  }

  .description {
    margin-bottom: 1.25rem;
    margin-top: 0.5rem;
    line-height: 1.5;
  }

  .close.left,
  .close.top,
  .close.bottom {
    float: right;
  }

  .close.top,
  .close.bottom {
    margin-right: 1.5rem;
  }
</style>
