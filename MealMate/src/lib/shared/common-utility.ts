import type { RecipeSource } from "../../lib/models/recipe.model.ts";

export function refKey(recipeId: string, source: RecipeSource): string {
  return `${source}:${recipeId}`;
}