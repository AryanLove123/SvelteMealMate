import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types.js";
import { createCommunityRecipe, listCommunityRecipes } from "../../../lib/server/repositories/recipesRepository.ts";
import { recipeInputSchema } from "../../../lib/schemas/recipe.ts";

export const GET: RequestHandler = async ({ url }) => {
  const search = url.searchParams.get("search")?.trim() || "";
  const category = url.searchParams.get("category")?.trim() || "";
  const area = url.searchParams.get("area")?.trim() || "";
  const mine = url.searchParams.get("mine");

  const recipes = await listCommunityRecipes({
    category,
    area,
    search,
    createdBy: mine || undefined,
  });
  return json({ recipes });
};

export const POST: RequestHandler = async({ request, locals}) =>{
  const user = locals.user;
  const payload = await request.json().catch( () => null);
  const parsed = recipeInputSchema.safeParse(payload);

  if(!parsed.success){
    throw error(400, parsed.error.issues.map(i => i.message).join(';'));
  }

  const recipe = await createCommunityRecipe(parsed.data, user.displayName);

  return json({recipe}, {status: 201});
}
