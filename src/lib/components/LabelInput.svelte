<script lang="ts">
  import type { HTMLInputTypeAttribute } from "svelte/elements";

  export let label: string;
  export let id: string | undefined = undefined;
  export let name: string;
  export let type: HTMLInputTypeAttribute | undefined = undefined;
  export let placeholder: string | undefined = undefined;
</script>

<label>
  <span>{label}</span>
  <input {id} {name} {type} {placeholder} />
</label>

<style lang="scss">
  label {
    display: block;
    font-size: 14px;
    margin: var(--input-margin, 0);

    span {
      display: block;
      margin-bottom: 12px;
    }
  }

  input {
    all: unset;
    font-size: 16px;
    border-radius: 6px;
    border: 1px solid var(--gray200);
    padding: 8px 12px;
    transition: border 250ms cubic-bezier(0.76, 0, 0.24, 1);
    box-sizing: border-box;
    cursor: text;
    width: 100%;

    // TODO: Check browser compatibility
    &:hover:not(:disabled) {
      border: 1px solid var(--gray300);
    }

    &:disabled {
      cursor: not-allowed;
    }
  }
</style>
