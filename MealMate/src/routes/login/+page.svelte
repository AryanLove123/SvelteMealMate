<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types.js";

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Log in · Meal Mate</title>
</svelte:head>

<div class="login-page">
  <div class="login-card">
    <h1>Welcome, Food Lovers!!</h1>
    <p class="subtitle">
      Dummy Login (no password) so we can demonstrate recipe ownership
    </p>

    <form method="POST" use:enhance>
      <label>
        <span>Username</span>
        <input type="text" name="username" autocomplete="username" required />
      </label>
      {#if form?.error}
        <p class="error">{form.error}</p>
      {/if}

      <button type="submit">Continue</button>
    </form>
  </div>
</div>

<style>
  .login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    min-height: 70vh;
  }

  .login-card {
    width: 100%;
    max-width: 26rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
  }

  .subtitle {
    color: var(--muted);
    font-size: 0.9rem;
    margin: 0 0 1.5rem;
    line-height: 1.5;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-size: 0.85rem;

      input {
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 0.6rem 0.8rem;
        font-size: 0.95rem;
      }
    }

    button {
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0.7rem;
      font-size: 0.95rem;
      cursor: pointer;
    }
  }

  .error {
    color: #c0392b;
    font-size: 0.85rem;
    margin: 0;
  }
</style>
