import type { RecipeSource, RecipeSummary } from "./recipe.model.ts";

export interface FavoriteEntry {
  id: string;
  recipeId: string;
  source: RecipeSource;
  createdAt: string;
  recipe: RecipeSummary | null;
}