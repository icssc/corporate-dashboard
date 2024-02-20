<script lang="ts">
  import IcsscLogo from "$lib/components/ICSSCLogo.svelte";
</script>

<main>
  <div class="content">
    <div class="logo">
      <IcsscLogo />
    </div>
    <h1>Corporate Dashboard</h1>
    <noscript>This application requires JS to work.</noscript>
    <a class="sign-in" href="/signin/google">Sign in with Google</a>
    <p class="description">Use your UCI Google Workspace account to sign in.</p>
    <p class="description">
      <span class="alpha">α</span> This application is still in its early stages. Expect rough edges
      and rapid changes as we iron out bugs and implement feedback. Please report bugs, suggestions,
      and pain points you encounter in the
      <a href="https://discord.com/channels/760915616793755669/1209485470808019005"
        >#corporate-dashboard-feedback</a
      >
      channel.
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

  .sign-in {
    @include button.button;
    margin: 48px 0 16px 0;
    font-size: 16px;
    padding: 16px;
    border-radius: 12px;
  }

  .description {
    font-size: 14px;
    color: var(--gray500);
    max-width: 35ch;
    line-height: 1.4;

    a {
      color: var(--gray500);
      text-decoration: underline;
    }
  }

  .alpha {
    background-color: var(--pink100);
    padding: 2px;
    border-radius: 4px;
    margin-right: 2px;
  }
</style>
