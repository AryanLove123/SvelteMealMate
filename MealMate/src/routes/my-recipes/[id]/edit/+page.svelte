<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();

  let submitting = $state(false);

  const formValue = $derived({
    title: data.recipe.title,
    description: data.recipe.description ?? '',
    imageUrl: data.recipe.imageUrl ?? '',
    category: data.recipe.category ?? '',
    area: data.recipe.area ?? '',
    ingredients: data.recipe.ingredients,
    instructions: data.recipe.instructions,
  });

  async function handleSubmit(e: CustomEvent<any>){
    submitting = true;
    try {
      const res = await fetch(`/api/recipes/${data.recipe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(e.detail),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? 'Failed to update recipe.');
      }
      goto(`/recipes/${data.recipe.id}?source=community`);
    } catch (err) {
        console.log(err);
    } finally {
      submitting = false;
    }
  }
  
</script>

<svelte:head>
    <title>Edit {data.recipe.title} . Recipe Finder</title>
</svelte:head>

<section class="form-page">
    <h1>Edit recipe</h1>
    <p class="subtitle">You can update the details below</p>

    <div class="card">
        <recipe-form
            mode="edit"
            recipe={formValue}
            submitting={submitting}
            onrecipe-submit={handleSubmit}
            onrecipe-cancel={() => goto(`/recipes/${data.recipe.id}?source=community`)}
        >
        </recipe-form>
    </div>
</section>


<style>
  .form-page {
    max-width: 40rem;
  }

  h1 {
    margin: 0 0 0.25rem;
  }

  .subtitle {
    color: var(--muted);
    margin: 0 0 1.5rem;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
  }
</style>
