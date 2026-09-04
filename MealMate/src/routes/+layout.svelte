<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import { onMount, setContext } from 'svelte';

  let stencilReady = $state(false);
  setContext('stencilReady', () => stencilReady);

  onMount(() => {
    const tags = new Set<string>();
    document.querySelectorAll('*').forEach((el) => {
      if (el.tagName.includes('-')) tags.add(el.tagName.toLowerCase());
    });
    // console.log('Waiting for these custom elements to register:', [...tags]);

    const allDefined = Promise.all([...tags].map((tag) => customElements.whenDefined(tag)));
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 3000));

    Promise.race([allDefined, timeout]).then(() => {
      // console.log('Proceeding to render');
      stencilReady = true;
    });
  });

  let { children, data } = $props();
  const navLinks = [
    { href: "/recipes", label: "Home" },
    { href: "/favorites", label: "Favorites" },
    { href: "/planner", label: "Planner" },
    { href: "/my-recipes", label: "My Recipes" },
  ];
</script>

<div class="app-shell">
  <header class="navbar">
    <div class="container navbar-inner">
      <nav>
        {#each navLinks as link}
          <a href={link.href} class:active={$page.url.pathname === link.href}>{link.label}</a>
        {/each}
      </nav>
      <div class="account">
        {#if data.user}
          <span class="username">Hi, {data.user.displayName}</span>
          <form method="POST" action="/logout">
            <button type="submit" class="link-btn">Log out</button>
          </form>
        {:else}
          <a class="login-link" href="/login">Log in</a>
        {/if}
      </div>
    </div>
  </header>

  <main class="container page">
    {#if stencilReady}
      {@render children()}
    {:else}
      <p style="padding: 2rem; text-align: center; color: #888;">Loading…</p>
    {/if}
  </main>

  <footer class="app-footer">
    <div class="footer-inner">
      <span class="footer-brand">MealMate 🍕</span>
      <span class="footer-divider">·</span>
      <span class="footer-credit">
        Made with ❤️ by <strong>Lovekesh Kumar Arya</strong>
      </span>
      <span class="footer-divider">·</span>
      <a
        href="https://github.com/AryanLove123/SvelteMealMate"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-link"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
            1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
            0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18
            1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
            .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
            0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
        Source Code
      </a>
    </div>
  </footer>
</div>

<style>
  .app-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .navbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .navbar-inner {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 0.85rem 1.25rem;
    flex-wrap: wrap;
  }

  nav {
    display: flex;
    gap: 1.1rem;
    flex: 1;
    flex-wrap: wrap;
  }
  nav a {
    text-decoration: none;
    color: var(--muted);
    font-size: 0.9rem;
    padding: 0.3rem 0;
    border-bottom: 2px solid transparent;
  }

  nav a.active,
  nav a:hover {
    color: var(--text);
    border-color: var(--accent);
  }

  .account {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.85rem;
  }

  .username {
    color: var(--muted);
  }

  .link-btn {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    font-size: 0.85rem;
    padding: 0;
  }

  .login-link {
    background: var(--accent);
    color: #fff;
    padding: 0.4rem 0.9rem;
    border-radius: 8px;
    text-decoration: none;
    font-size: 0.85rem;
  }

  .app-footer {
    flex-shrink: 0;
    padding: 14px 20px;
    border-top: 1px solid #fff;
    background: white;
  }

  .footer-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 0.85rem;
  }

  .footer-brand {
    font-weight: 700;
  }

  .footer-credit strong {
    color: var(--accent);
  }

  .footer-divider {
    color: #e5dad0;
  }

  .footer-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #2d2a26;
    text-decoration: none;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid #f0e6de;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .footer-link:hover {
    background: #fff9f5;
    border-color: #ff6b4a;
  }

  .app-footer a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
  }

  .app-footer a:hover {
    text-decoration: underline;
  }
</style>