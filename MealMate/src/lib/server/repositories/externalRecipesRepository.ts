import { env } from "$env/dynamic/private";
import type { Recipe, RecipeSummary } from "../../../lib/models/recipe.model.ts";

const BASE_URL = env.MEALDB_BASE_URL;

interface MealDbMeal {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
}

interface MealDbListResponse {
  meals: MealDbMeal[] | null;
}

function toSummary(recipe: Recipe): RecipeSummary {
  return {
    id: recipe.id,
    source: recipe.source,
    title: recipe.title,
    imageUrl: recipe.imageUrl,
    category: recipe.category,
    area: recipe.area,
  };
}

class ExternalApiError extends Error {
  constructor(
    message: string,
    public status: number = 502,
  ) {
    super(message);
    this.name = "ExternalAPIError";
  }
}

function normalizeMeal(meal: MealDbMeal): Recipe {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredientName = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();

    if (ingredientName) {
      ingredients.push({ name: ingredientName, measure: measure || undefined });
    }
  }

  return {
    id: meal.idMeal,
    source: "external",
    title: meal.strMeal,
    description: undefined,
    imageUrl: meal?.strMealThumb,
    category: meal?.strCategory,
    area: meal?.strMeal,
    ingredients,
    instructions: meal.strInstructions ?? "",
  };
}

export async function filterExternalRecipes(
  params: { category?: string; area?: string },
  limit = Number(env.DEFAULT_RECIPES_LIMIT),
): Promise<RecipeSummary[]> {
  const { category, area } = params;

  if (category && area) {
    const candidates = await filterExternalRecipes({ category }, limit * 3);
    const result = await Promise.all(
      candidates.map(async (c) => {
        const full = await getExternalRecipeById(c.id).catch(() => null);
        return full && full.area == area ? toSummary(full) : null;
      }),
    );
    return result.filter((r) => r !== null).slice(0, limit);
  }

  const query = category
    ? `c=${encodeURIComponent(category)}`
    : area
      ? `a=${encodeURIComponent(area)}`
      : null;
  if (!query) return [];

  const data = await fetchJson<MealDbListResponse>(`/filter.php?${query}`);

  return (data.meals ?? [])
    .map((m) => ({
      id: m.idMeal,
      source: "external" as const,
      title: m.strMeal,
      imageUrl: m.strMealThumb,
      category,
      area,
    }))
    .slice(0, limit);
}

async function fetchJson<T>(path: string): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${BASE_URL}${path}`);
  } catch (err) {
    throw new ExternalApiError(
      `Could not reach the external recipe API: ${(err as Error).message}`,
      502,
    );
  }

  if (!res.ok) {
    throw new ExternalApiError(
      `External recipe API responded with ${res.status}`,
    );
  }
  return res.json();
}

export async function getExternalRecipeById(
  id: string,
): Promise<Recipe | null> {
  const data = await fetchJson<MealDbListResponse>(
    `/lookup.php?i=${encodeURIComponent(id)}`,
  );
  const meal = data.meals?.[0];
  return meal ? normalizeMeal(meal) : null;
}

export async function listExternalCategories(): Promise<string[]> {
  const data = await fetchJson<{ meals: { strCategory: string }[] | null }>(
    `/list.php?c=list`,
  );
  return (data.meals ?? []).map((m) => m.strCategory);
}

export async function listExternalAreas(): Promise<string[]> {
  const data = await fetchJson<{ meals: { strArea: string }[] | null }>(
    `/list.php?a=list`,
  );
  return (data.meals ?? []).map((m) => m.strArea);
}

export async function getDefaultExternalRecipes(limit= Number(env.DEFAULT_RECIPES_LIMIT)): Promise<RecipeSummary[]>{
  const categories = await listExternalCategories().catch(()=> []);
  const seen = new Set<string>();
  const items: RecipeSummary[] = [];

  for(const category of categories){
    const categoryRecipes = await filterExternalRecipes({category}, limit*2);
    for(const recipe of categoryRecipes){
      if(seen.has(recipe.id)) continue;
      seen.add(recipe.id);
      items.push(recipe);
      if(items.length >= limit) return items;
    }
  }
  return items.length>0 ? items: searchExternalRecipes('chicken',limit);
}

export async function searchExternalRecipes(search: string, limit = Number(env.DEFAULT_RECIPES_LIMIT)): Promise<RecipeSummary[]>{
  const data = await fetchJson<MealDbListResponse>(`/search.php?s=${encodeURIComponent(search)}`);
  return (data.meals ?? []).map(normalizeMeal).map(toSummary).slice(0,limit);
}

export { ExternalApiError };
