import { removeFavoritesForRecipe } from "../repositories/favoritesRepository.ts";
import { removeMealPlanEntriesForRecipe } from "../repositories/mealPlanRepository.ts";
import { deleteCommunityRecipe } from "../repositories/recipesRepository.ts";

export async function deleteCommunityRecipeAndCleanup(
  recipeId: string,
  username: string,
): Promise<'deleted' | 'not-found' | 'forbidden'> {
  const result = await deleteCommunityRecipe(recipeId, username);
  if (result === 'deleted') {
    await Promise.all([
      removeFavoritesForRecipe(recipeId, 'community'),
      removeMealPlanEntriesForRecipe(recipeId, 'community'),
    ]);
  }
  return result;
}