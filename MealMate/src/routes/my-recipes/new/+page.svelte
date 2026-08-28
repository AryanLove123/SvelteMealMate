<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types.js";

    let {data}: {data: PageData} = $props();
    let submitting = $state(false);

    async function handleSubmit(e: CustomEvent<any>){
      submitting = true;
      try{
        const res = await fetch('/api/recipes', {
          method: 'POST',
          headers: {'Content-Type': 'application/json' },
          body: JSON.stringify(e.detail),
        });
        if(!res.ok){
          const data = await res.json().catch(() => null);
          throw new Error(data?.message?? 'Falied to create a recipe');
        }
        const { recipe } = await res.json();
        goto(`/recipes/${recipe.id}?source=community`);
      }catch(err){
        console.log(err);
      }
      finally{
        submitting=false;
      }
    }
</script>

<svelte:head>
  <title>New Recipe · Recipe Finder</title>
</svelte:head>

<section class="form-page">
    <h1>Create a recipe</h1>
    <p class="subtitle">Share a recipe with the community</p>

    <div class="card">
      <recipe-form
        mode="create"
        submitting={submitting}
        categories={data.categories}
        areas={data.areas}
        onrecipe-submit={handleSubmit}
        onrecipe-cancel={() => goto('/my-recipes')}
      ></recipe-form>  
    </div>
</section>

<style>
  .form-page{
    max-width: 40rem;
  }
  
  h1{
    margin: 0 0 0 0.25rem
  }

  .subtitle{
    color: var(--muted);
    margin: 0 0 1.5rem;
  }

  .card{
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
  }
</style>