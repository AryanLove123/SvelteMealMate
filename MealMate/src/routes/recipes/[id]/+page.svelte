<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();

  let showDeleteConfirm = $state(false);
  let deleting = $state(false);

  async function confirmDelete(){
    deleting = true;
    try{
        const res = await fetch(`api/recipes/${data.recipe.id}`, {
            method: 'DELETE'
        });

        if(!res.ok) {
            const data = await res.json().catch(()=> null);
            throw new Error(data?.message ?? "Failed to delete recipe.");
        }
        console.log("Successfully Deleted!!")
        goto('/my-recipes');
    }catch(err){
        console.log(err);
    }finally{
        deleting=false;
        showDeleteConfirm = false;
    }
  }
</script>

<svelte:head>
  <title>{data.recipe.title}</title>
</svelte:head>

<article class="recipe-detail">
  <div class="recipe-img">
    {#if data.recipe.imageUrl}
      <img src={data.recipe.imageUrl} alt={data.recipe.title} />
    {:else}
      <div class="img-placeholder">No image available</div>
    {/if}
  </div>
  <div class="content">
    <div class="title-row">
      <div>
        <span
          class="badge-pill"
          class:external={data.recipe.source === "external"}
        >
          {data.recipe.source === "external"
            ? "Public Recipe · TheMealDB"
            : "Community Recipe"}
        </span>
        <h1>{data.recipe.title}</h1>
        {#if data.recipe.source === "community" && data.recipe.createdBy}
          <p class="author">Created by {data.recipe.createdBy}</p>
        {/if}
        <p class="meta">
          {#if data.recipe.category}<span>{data.recipe.category}</span>{/if}
          {#if data.recipe.area}<span> · {data.recipe.area}</span>{/if}
        </p>
      </div>

      <div class="actions">
        {#if data.isOwner}
          <a class="btn" href={`/my-recipes/${data.recipe.id}/edit`}>Edit</a>
          <button
            class="btn danger"
            type="button"
            onclick={() => (showDeleteConfirm = true)}>Delete</button
          >
        {/if}
      </div>
    </div>

    {#if data.recipe.description}
      <p class="description">{data.recipe.description}</p>
    {/if}

    <div class="grid">
      <section class="ingredients">
        <h2>Ingredients</h2>
        <ul>
          {#each data.recipe.ingredients as ing}
            <li>
              <strong>{ing.name}</strong>{#if ing.measure}
                — {ing.measure}{/if}
            </li>
          {/each}
        </ul>
      </section>

      <section class="instructions">
        <h2>Instructions</h2>
        <p>{data.recipe.instructions}</p>
      </section>
    </div>
  </div>
</article>


<confirmation-dialog
  open={showDeleteConfirm}
  heading="Delete this recipe?"
  message="This will permanently remove the recipe, and it will also be removed from anyone's favorites or meal plans."
  confirm-label={deleting ? 'Deleting…' : 'Delete'}
  onconfirm={confirmDelete}
  oncancel={() => (showDeleteConfirm = false)}
></confirmation-dialog>


<style>
  .recipe-img {
    aspect-ratio: 21 / 8;
    border-radius: 18px;
    overflow: hidden;
    background: var(--bg-muted);
    margin-bottom: 1.75rem;
  }

  .recipe-img img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .img-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--muted);
  }

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .badge-pill.external {
    color: #1d6fa5;
  }

  h1 {
    margin: 0.4rem 0 0.2rem;
  }

  .author {
    margin: 0;
    color: var(--muted);
    font-style: italic;
    font-size: 0.9rem;
  }

  .meta {
    margin: 0.2rem 0 0;
    color: var(--muted);
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .btn {
    border: 1px solid var(--border);
    background: var(--surface);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    text-decoration: none;
    color: var(--text);
    cursor: pointer;
  }

  .btn.danger {
    color: #c0392b;
    border-color: #f0c4be;
  }

  .description {
    color: var(--muted);
    line-height: 1.6;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    margin-top: 1.5rem;
  }

  @media (max-width: 720px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  h2 {
    font-size: 1.05rem;
    margin: 0 0 0.75rem;
  }

  .ingredients ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ingredients li {
    font-size: 0.9rem;
    border-bottom: 1px dashed var(--border);
    padding-bottom: 0.4rem;
  }

  .instructions p {
    white-space: pre-line;
    line-height: 1.7;
    color: var(--text);
  }
</style>

