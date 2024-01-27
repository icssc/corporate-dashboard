<script lang="ts">
  import Line from "./Line.svelte";

  export let loading: boolean;
</script>

<tr aria-hidden>
  <th class="line-parent">
    <div class="line">
      <Line {loading} />
    </div>
  </th>
</tr>

<style lang="scss">
  tr {
    position: relative;

    .line-parent {
      padding: 0;
      margin: 0;
      position: sticky;
      left: 0;
      z-index: 100;

      .line {
        position: absolute;
        width: 100vw;
      }
    }
  }
</style>
