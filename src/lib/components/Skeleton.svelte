<script lang="ts">
  export let height: number = 20;
  export let width: number = 128;
</script>

<div class="skeleton" style:height="{height}px" style:width="{width}px" />

<style lang="scss">
  .skeleton {
    border-radius: 4px;
    background-color: var(--gray100);

    @keyframes pulse {
      0% {
        background-color: var(--gray100);
      }
      100% {
        background-color: var(--gray200);
      }
    }
    animation: pulse 1s ease-in-out infinite alternate both;
  }
</style>
