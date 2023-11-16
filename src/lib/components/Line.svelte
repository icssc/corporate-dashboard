<script lang="ts">
  import { onDestroy } from "svelte";
  import { quintOut } from "svelte/easing";
  import { fly } from "svelte/transition";

  export let loading: boolean;
  export let idleLine = true;
  export let threshold = 250;
  export let cycleTime = 750;
  export let height = "1px";

  let pastThreshold = false;
  let loaderState = false;
  let width: number;

  let thresholdTimeout: NodeJS.Timeout;
  const setPastThreshold = (loading: boolean) => {
    if (loading) {
      thresholdTimeout = setTimeout(() => {
        pastThreshold = true;
      }, threshold);
    } else {
      clearTimeout(thresholdTimeout);
      pastThreshold = false;
    }
  };

  let loaderTimeout: NodeJS.Timeout;
  const setLoaderState = (cycle: boolean) => {
    if (cycle) {
      loaderState = true;
      loaderTimeout = setTimeout(() => {
        loaderState = false;
        loaderTimeout = setTimeout(() => {
          setLoaderState(loading && pastThreshold);
        }, cycleTime);
      }, cycleTime);
    }
  };

  $: setPastThreshold(loading);
  $: setLoaderState(loading && pastThreshold);

  onDestroy(() => {
    clearTimeout(thresholdTimeout);
    clearTimeout(loaderTimeout);
  });
</script>

<div bind:offsetWidth={width} style:height class="line">
  {#if idleLine}
    <div style:height class="idle-line" />
  {/if}
  {#if loaderState}
    <div
      in:fly={{ x: -width, duration: cycleTime, opacity: 0.5, easing: quintOut }}
      out:fly={{ x: width, duration: cycleTime, opacity: 0.5, easing: quintOut }}
      style:height
      class="loader-line"
    />
  {/if}
</div>

<style lang="scss">
  .line {
    z-index: 10;
    position: relative;
    overflow-x: hidden;
    overflow-y: visible;
  }

  .idle-line {
    position: absolute;
    top: 0;
    width: 100%;
    background-color: var(--gray100);
  }

  .loader-line {
    position: absolute;
    top: 0;
    width: 100%;
    background-color: var(--gray400);
  }
</style>
