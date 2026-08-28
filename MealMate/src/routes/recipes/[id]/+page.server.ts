import { getCommunityRecipeById } from "../../../lib/server/repositories/recipesRepository.ts";
import type { RecipeSource } from "../../../lib/models/recipe.model.ts";
import type { PageServerLoad } from "./$types.js";
import { ExternalApiError, getExternalRecipeById } from "../../../lib/server/repositories/externalRecipesRepository.ts";
import { error } from "@sveltejs/kit";
import { isFavorite } from "../../../lib/server/repositories/favoritesRepository.ts";

export const load: PageServerLoad = async ({ params, url, locals }) => {
  const requestedSource = url.searchParams.get("source") as RecipeSource | null;

  const tryOrder: RecipeSource[] =
    requestedSource === "external"
      ? ["external"]
      : requestedSource === "community"
        ? ["community"]
        : ["community", "external"];

  for (const source of tryOrder) {
    if (source === 'community') {
      const recipe = await getCommunityRecipeById(params.id);
      if (recipe) {
        const favorited = locals.user ? await isFavorite(locals.user.id, recipe.id, 'community') : false;
        const isOwner = locals.user ? locals.user.displayName === recipe.createdBy : false;
        return { recipe, favorited, isOwner };
      }
    } else {
      try {
        const recipe = await getExternalRecipeById(params.id);
        if (recipe) {
          const favorited = locals.user ? await isFavorite(locals.user.id, recipe.id, 'external') : false;
          return { recipe, favorited, isOwner: false };
        }
      } catch (err) {
        if (err instanceof ExternalApiError) continue; // try next source rather than failing the whole page
        throw err;
      }
    }
  }

  throw error(404, 'Recipe not found.');
};