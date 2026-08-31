<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import type { MealPlanEntry, MealType, WeekDay } from "../../lib/models/mealPlan.model.ts";
  import type { RecipeSummary } from "../../lib/models/recipe.model.ts";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();

  let pickerOpen = $state(false);
  let pickerContext = $state<{ day: WeekDay; mealType: MealType, editingId?: string} | null>(null);
  let pickerQuery = $state('');
  let pickerLoading = $state(false);
  let pickerResults = $state<RecipeSummary[]>([]);
  let pickerTimer : ReturnType<typeof setTimeout> | undefined;


  const uiMeals = $derived(
    data.entries
      .filter((e) => e.recipe !== null)
      .map((e) => ({
        id: e.id,
        day: e.day,
        mealType: e.mealType,
        recipe: {
          id: e.recipe!.id,
          source: e.recipe!.source,
          title: e.recipe!.title,
          imageUrl: e.recipe!.imageUrl,
          category: e.recipe!.category,
          area: e.recipe!.area,
          createdBy: e.recipe!.createdBy,
        },
      })),
  );

  function handleMealAdd(e: CustomEvent<{day: WeekDay; mealType: MealType}>){
    pickerContext = {day: e.detail.day, mealType: e.detail.mealType};
    pickerOpen = true;
  }

  function handleMealEdit(e: CustomEvent<MealPlanEntry>) {
    pickerContext = { day: e.detail.day, mealType: e.detail.mealType, editingId: e.detail.id };
    pickerOpen = true;
  } 

  async function handleMealRemove(e: CustomEvent<MealPlanEntry>){
    try{
      const res = await fetch(`/api/planner/${e.detail.id}`, {method: 'DELETE'});
      if(!res.ok) throw new Error("Failed to remove meal form planner");
      await invalidateAll();
    }catch(err){
      console.log(err);
    }
  }

  async function onPickerRecipe(recipe: RecipeSummary){
    if(!pickerContext) return;
    const context = pickerContext;

    try{
      if(context.editingId){
        const res = await fetch(`/api/planner/${context.editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeId: recipe.id, source: recipe.source }),
        });
        if (!res.ok) throw new Error('Failed to update meal.from the planner');
      }
      else{
        const payload ={
          recipeId: recipe.id,
          source: recipe.source,
          day : context.day,
          mealType: context.mealType,
          weekStart: data.weekStart,
        };
        const res =  await fetch(`/api/planner`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if(!res.ok) throw new Error('Failed to add meal to the planner');
      }
    }catch(err){
      console.log(err);
    }finally{
      pickerOpen = false;
      pickerContext = null;
      pickerQuery = '';
      pickerResults = [];
      await invalidateAll();
    }
  }

  async function runPickerSearch(q: string) {
    const term = q.trim();
    if (!term) {
      pickerResults = [];
      return;
    }

    pickerLoading = true;
    try {
      const [externalRes, communityRes] = await Promise.all([
        fetch(`/api/external-recipes?search=${encodeURIComponent(term)}`),
        fetch(`/api/recipes?search=${encodeURIComponent(term)}`),
      ]);

      const external = externalRes.ok ? (await externalRes.json()).recipes ?? [] : [];
      const community = communityRes.ok ? (await communityRes.json()).recipes ?? [] : [];
      pickerResults = [...community, ...external];
    } finally {
      pickerLoading = false;
    }
  }

  function onPickerInput(e:Event){
    const value = (e.target as HTMLInputElement).value.trim();
    pickerQuery = value;
    clearTimeout(pickerTimer);
    pickerTimer =  setTimeout(() => {
        void runPickerSearch(value);
    }, 250);
  }

  function formatWeekLabel(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
</script>

<svelte:head>
  <title>Meal Planner · Recipe Finder</title>
</svelte:head>

<section>
  <div class="head">
    <div>
      <h1>Weekly meal planner</h1>
      <p class="subtitle">Week of {formatWeekLabel(data.weekStart)}</p>
    </div>
    <div class="week-nav">
      <button
        type="button"
        onclick={() => goto(`/planner?week=${data.prevWeek}`)}
        >← Previous</button
      >
      <button
        type="button"
        onclick={() => goto(`/planner?week=${data.nextWeek}`)}>Next →</button
      >
    </div>
  </div>

  <meal-plan-week
    meals={uiMeals}
    onmeal-add = {handleMealAdd}
    onmeal-edit= {handleMealEdit}
    onmeal-remove = {handleMealRemove}
  ></meal-plan-week>
</section>


<modal-dialog open={pickerOpen}  onmodal-close={() =>{
  pickerOpen = false;
  pickerQuery = '';
  pickerResults= [];
}}>
  <span slot="title">
    {pickerContext?.editingId ? 'Change Meal': `Add ${pickerContext?.mealType ?? ''} for ${pickerContext?.day ?? ''}`}
  </span>

  <div class="picker">
    <input type="search" placeholder="Search a recipe to add…" value={pickerQuery} oninput={onPickerInput} />
    {#if pickerLoading}
      <div class="state">Searching…</div>
    {:else if pickerResults.length === 0}
      <div class="state">No recipes found</div>
    {:else}
      <ul class="results">
        {#each pickerResults as recipe (recipe.source + recipe.id)}
          <li>
            <button type="button" class="result-row" onclick={() => onPickerRecipe(recipe)}>
              {#if recipe.imageUrl}
                <img src={recipe.imageUrl} alt="" />
              {:else}
                <span class="thumb-placeholder">🍽️</span>
              {/if}
              <span class="result-info">
                <span class="result-title">{recipe.title}</span>
                <span class="result-source">{recipe.source === 'external' ? 'Public' : 'Community'}</span>
              </span>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</modal-dialog>


<style>
  .head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.75rem;
  }

  .head h1 {
    margin: 0 0 0.25rem;
  }

  .subtitle {
    color: var(--muted);
    margin: 0;
  }

  .week-nav {
    display: flex;
    gap: 0.6rem;
  }

  .week-nav button {
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 8px;
    padding: 0.45rem 0.9rem;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .week-nav button:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .picker {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  input {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.55rem 0.8rem;
    font-size: 0.9rem;
  }

  .state {
    color: var(--muted);
    font-size: 0.85rem;
  }

  .results {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 18rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .result-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    text-align: left;
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 10px;
    padding: 0.4rem;
    cursor: pointer;
  }

  .result-row:hover {
    border-color: var(--accent);
  }

  .result-row img,
  .thumb-placeholder {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 8px;
    object-fit: cover;
    background: var(--bg-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .result-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .result-title {
    font-size: 0.85rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .result-source {
    font-size: 0.72rem;
    color: var(--muted);
  }
</style>

