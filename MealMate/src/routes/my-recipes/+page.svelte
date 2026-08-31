<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();

  let showDeleteConfirm = $state(false);
  let pendingDeleteId = $state<string | null>(null);

  function handleRecipeClick(
    e: CustomEvent<{ id: string; source: "external" | "community" }>,
  ) {
    goto(`/recipes/${e.detail.id}`);
  }

  function handleRecipeEdit(e: CustomEvent<{ id: string }>) {
    goto(`my-recipes/${e.detail.id}/edit`);
  }

  function handleRecipeDelete(e: CustomEvent<{ id: string }>) {
    pendingDeleteId = e.detail.id;
    showDeleteConfirm = true;
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    try {
      const res = await fetch(`/api/recipes/${pendingDeleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete recipe.");
      await invalidateAll();
    } catch (err) {
      throw err;
    } finally {
      showDeleteConfirm = false;
      pendingDeleteId = null;
    }
  }
</script>

<svelte:head>
  <title>My Recipes . Recipe Finder</title>
</svelte:head>

<section>
  <div class="head">
    <div>
      <h1>My recipes</h1>
      <p class="subtitle">
        Recipes you've created. Other users can view and favorite them, but only
        you can edit or delete them.
      </p>
    </div>
    <a class="btn primary" href="/my-recipes/new">+ New recipe</a>
  </div>

  <recipe-grid
    recipes={data.recipes}
    favorites={data.favoriteKeys}
    show-actions={true}
    empty-message="You haven't created any recipes yet."
    onrecipe-click={handleRecipeClick}
    onrecipe-edit={handleRecipeEdit}
    onrecipe-delete={handleRecipeDelete}
  >
  </recipe-grid>
</section>

<confirmation-dialog
  open={showDeleteConfirm}
  heading="Delete this recipe?"
  message="This will permanently remove the recipe and it will also be removed from anyone's favorite or meal-plan"
  onconfirm={confirmDelete}
  oncancel={() => {
    showDeleteConfirm = false;
  }}
>
</confirmation-dialog>

<style>
  .head{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  .head h1{
    margin: 0 0 0.25rem;
  }

  .subtitle{
    color: var(--muted);
    margin:0;
    max-width: 40rem;
  }

  .btn.primary {
    background: var(--accent);
    color: #fff;
    padding: 0.6rem 1.1rem;
    border-radius: 8px;
    text-decoration: none;
    font-size: 0.9rem;
    white-space: nowrap;
    margin-top: 0.5rem;
  }
</style>
