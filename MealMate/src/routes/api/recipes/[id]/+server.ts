import { error, json } from "@sveltejs/kit";
import {
  getCommunityRecipeById,
  updateCommunityRecipe,
} from "../../../../lib/server/repositories/recipesRepository.ts";
import type { RequestHandler } from "./$types.js";
import { recipeInputSchema } from "../../../../lib/schemas/recipe.ts";
import { deleteCommunityRecipeAndCleanup } from "../../../../lib/server/services/recipeDeletion.ts";

export const GET: RequestHandler = async ({ params }) => {
  const recipe = await getCommunityRecipeById(params.id);
  if (!recipe) throw error(404, "Community recipe not found");
  return json({ recipe });
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  const username = locals.user.displayName;
  const body = await request.json().catch(() => null);
  const parsed = recipeInputSchema.safeParse(body);
  if (!parsed.success) {
    throw error(400, parsed.error.issues.map((i) => i.message).join(";"));
  }
  const result = await updateCommunityRecipe(params.id, username, parsed.data);
  if (result == null) {
    throw error(404, "Recipe not found");
  }
  if (result == "forbidden") {
    throw error(403, "You can only edit recipes you have created");
  }
  return json({ recipe: result });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const username = locals.user.displayName;
  const result = await deleteCommunityRecipeAndCleanup(params.id, username);
  if (result === "not-found") throw error(404, "Recipe not found.");
  if (result === "forbidden")
    throw error(403, "You can only delete recipes you created.");
  return json({ success: true });
};
