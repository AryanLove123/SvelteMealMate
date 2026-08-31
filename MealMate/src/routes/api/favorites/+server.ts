import { addFavorite, listFavorites, removeFavoriteByRecipe } from "../../../lib/server/repositories/favoritesRepository.ts";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types.js";
import { favoriteInputSchema } from "../../../lib/schemas/recipe.ts";
import { success } from "zod";

export const GET: RequestHandler = async({locals}) =>{
    const userId = locals.user.id;
    const favorites = await listFavorites(userId);
    return json({favorites});
}

export const POST: RequestHandler = async({request, locals}) =>{
    const userId = locals.user.id;

    const body = await request.json().catch(() => null);
    const parsed = favoriteInputSchema.safeParse(body);
    if(!parsed.success){
        throw error(400, parsed.error.issues.map(i=> i.message).join(';'));
    }

    const result =  await addFavorite(userId, parsed.data.recipeId, parsed.data.source);
    if(result == 'already-exists'){
        throw error(409, 'The recipe is already in your favorite list');
    }
    return json({success: true}, {status: 201});
}

export const DELETE: RequestHandler = async({url, locals}) =>{
    const userId = locals.user.id;
    const recipeId = url.searchParams.get('recipeId');
    const source = url.searchParams.get('source');

    if (!recipeId || (source !== 'external' && source !== 'community')) {
    throw error(400, 'recipeId and a valid source (external|community) are required.');
  }

  const result = await removeFavoriteByRecipe(userId, recipeId, source);
  if (result === 'not-found') throw error(404, 'Favorite not found.');
  return json({ success: true });
}