<script lang="ts">
  import IcsscLogo from "$lib/components/ICSSCLogo.svelte";
</script>

<main>
  <div class="content">
    <div class="logo">
      <IcsscLogo />
    </div>
    <h1>Unauthorized</h1>
    <noscript>This application requires JS to work.</noscript>
    <p class="description">
      You are not currently authorized to access this tool. Please ask your Committee Chair(s) to
      add you as a member on their dashboard, then sign in again.
    </p>
    <p class="description">
      <a href="/signin">Sign In</a>
    </p>
  </div>
</main>

<style lang="scss">
  @use "$lib/styles/button" as button;

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0 16px;
  }

  .content {
    max-width: 350px;
    width: 100%;
  }

  .logo {
    width: 64px;
    margin: auto;
  }

  h1 {
    font-size: 28px;
    font-weight: 500;
    margin: 32px 0 16px 0;
    text-align: center;
  }

  noscript {
    color: var(--pink400);
    font-size: 14px;
  }

  .description {
    font-size: 14px;
    color: var(--gray500);
    max-width: 35ch;
    line-height: 1.4;
    text-align: center;
    margin: 16px auto;

    a {
      color: var(--gray500);
      text-decoration: underline;
    }
  }
</style>
