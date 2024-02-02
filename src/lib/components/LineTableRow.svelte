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
  $height: 1px;

  tr {
    position: relative;
    height: $height;

    .line-parent {
      padding: 0;
      margin: 0;
      position: sticky;
      left: 0;
      z-index: 100;
      bottom: $height;

      .line {
        position: absolute;
        width: 100vw;
      }
    }
  }
</style>
