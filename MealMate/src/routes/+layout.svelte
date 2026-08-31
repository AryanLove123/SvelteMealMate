<script>
  import "../app.css";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  onMount(async () => {
    const { defineCustomElements } = await import("recipemealui/loader");
    defineCustomElements();
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
          <a href={link.href} class:active={$page.url.pathname === link.href}
            >{link.label}</a
          >
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
  {@render children()}
</main>

<footer class="site-footer">
    <div class="container">
      <b>MealMate</b> Recipe Finder & Meal Planner — training project. Recipe data via
      <a href="https://www.themealdb.com/" target="_blank" rel="noreferrer">TheMealDB</a>.
    </div>
  </footer>
</div>

<style>
  .app-shell{
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

  nav a.active, nav a:hover {
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

  .site-footer {
    border-top: 1px solid var(--border);
    padding: 1.5rem 0;
    color: var(--muted);
    font-size: 0.8rem;
    margin-top: auto;
  }
</style>


