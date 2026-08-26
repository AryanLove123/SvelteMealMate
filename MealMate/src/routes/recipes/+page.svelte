<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types.js';
  import type { RecipeSummary } from '../../lib/models/recipe.model.ts';

  let { data }: { data: PageData } = $props();

  function buildQuery(next: Partial<{ search: string; category: string; area: string; source: string; page: string }>) {
    const params = new URLSearchParams({
      search: next.search ?? data.filters.search,
      category: next.category ?? data.filters.category,
      area: next.area ?? data.filters.area,
      source: next.source ?? data.filters.source,
      page: next.page ?? '1',
    });
    for (const [k, v] of [...params.entries()]) if (!v) params.delete(k);
    return `/recipes?${params.toString()}`;
  }

  function applyFilters(next: Partial<{ search: string; category: string; area: string; source: string }>) {
    const incoming = {
      search: next.search ?? data.filters.search,
      category: next.category ?? data.filters.category,
      area: next.area ?? data.filters.area,
      source: next.source ?? data.filters.source,
    };

    if (
      incoming.search === data.filters.search &&
      incoming.category === data.filters.category &&
      incoming.area === data.filters.area &&
      incoming.source === data.filters.source
    ) {
      return;
    }

    goto(buildQuery({ ...next, page: '1' }), { keepFocus: true, noScroll: true });
  }

  function handlePageChange(nextPage: number) {
    const safePage = Math.max(1, nextPage);
    goto(buildQuery({ page: String(safePage) }), { keepFocus: true, noScroll: true });
  }

  function handleSearch(e: CustomEvent<string>) {
    applyFilters({ search: e.detail });
  }

  function handleFilterChange(e: CustomEvent<{ source: string; category: string; area: string }>) {
    applyFilters(e.detail);
  }

  function handleRecipeClick(e: CustomEvent<{ id: string; source: 'external' | 'community' }>) {
    goto(`/recipes/${e.detail.id}?source=${e.detail.source}`);
  }
</script>

<svelte:head>
  <title>MealMate · Recipe Finder</title>
</svelte:head>

<section class="discovery">
  <div class="head">
    <h1>MealMate</h1>
    <p class="subtitle">Search public recipes from TheMealDB alongside recipes created by the community.</p>
  </div>

  <div class="controls">
    <recipe-search value={data.filters.search} placeholder="Search by name, e.g. chicken curry" onsearch={handleSearch}></recipe-search>
    <recipe-filter
      source={data.filters.source}
      category={data.filters.category}
      area={data.filters.area}
      categories={data.categories}
      areas={data.areas}
      show-mine={!!data.user}
      onfilter-change={handleFilterChange}
    ></recipe-filter>
  </div>

  <recipe-grid
    recipes={data.recipes as RecipeSummary[]}
    empty-message="No recipes matched your search. Try a different term or clear filters."
    onrecipe-click={handleRecipeClick}
  ></recipe-grid>

  {#if data.totalPages > 1}
    <div class="pagination">
      <button type="button" disabled={data.page <= 1} onclick={() => handlePageChange(data.page - 1)}>Previous</button>
      <span>Page {data.page} / {data.totalPages}</span>
      <button type="button" disabled={data.page >= data.totalPages} onclick={() => handlePageChange(data.page + 1)}>Next</button>
    </div>
  {/if}
</section>

<style>
  .head h1 {
    margin: 0 0 0.25rem;
  }

  .subtitle {
    color: var(--muted);
    margin: 0 0 1.5rem;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1.75rem;
  }

  .controls recipe-search {
    flex: 1;
    min-width: 220px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .pagination button {
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 8px;
    padding: 0.55rem 0.9rem;
    cursor: pointer;
  }

  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
