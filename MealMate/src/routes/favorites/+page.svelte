<script lang="ts">
  import type { PageData } from "./$types.js";
  import type { RecipeSource } from "../../lib/models/recipe.model.ts";
  import { goto, invalidateAll } from "$app/navigation";

  let { data }: { data: PageData } = $props();
  const validFavorites = $derived(data.favorites.filter( f => f.recipe!=null));

  const recipeList = $derived(validFavorites.map(f => f.recipe!));
  const favoriteKeys = $derived(validFavorites.map( f => `${f.source}:${f.recipeId}`));

  function handleRecipeClick(e: CustomEvent<{id: string, source: RecipeSource}>){
    goto(`/recipes/${e.detail.id}?source=${e.detail.source}`);
  }

  async function handleFavToggle(e: CustomEvent<{recipeId: string, source: RecipeSource}>){
    const favorite = validFavorites.find(f => f.recipeId === e.detail.recipeId && f.source === e.detail.source);
    if(!favorite) return;
    try{
        const res = await fetch(`/api/favorites/${favorite.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to remove favorite.');
        await invalidateAll();
    }catch(err){
        console.log(err);
    }
  }
</script>

<svelte:head>
  <title>My Favorites . Recipe Finder</title>
</svelte:head>

<section>
    <div class="head">
        <h1>Your Favorites</h1>
        <p class="subtitle">Public and community recipes made favorite by you.</p>
    </div>

    <recipe-grid
        recipes={recipeList}
        favorites={favoriteKeys}
        empty-message="You haven't favorited any recipes yet. Browse recipes and tap the heart to save them here."
        onrecipe-click ={handleRecipeClick}
        onfavorite-toggle ={handleFavToggle}
    ></recipe-grid>
</section>

<style>
  .head h1 {
    margin: 0 0 0.25rem;
  }

  .subtitle {
    color: var(--muted);
    margin: 0 0 1.5rem;
  }
</style>