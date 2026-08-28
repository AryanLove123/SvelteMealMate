import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { listCommunityRecipes } from "../../lib/server/repositories/recipesRepository.ts";
import { getFavoriteKeys } from "../../lib/server/repositories/favoritesRepository.ts";

export const load:PageServerLoad = async({locals}) =>{
    if(!locals.user) throw redirect(303,'/login');

    const [recipes, favoriteKeys] = await Promise.all([
        listCommunityRecipes({createdBy: locals.user.displayName}),
        getFavoriteKeys(locals.user.id)
    ]);
    return {recipes, favoriteKeys: Array.from(favoriteKeys)};
}