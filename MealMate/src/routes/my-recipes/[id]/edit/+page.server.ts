import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { getCommunityRecipeById } from "../../../../lib/server/repositories/recipesRepository.ts";

export const load: PageServerLoad = async({params, locals}) =>{
    if(!locals.user) throw redirect(303, '/login');

    const recipe = await getCommunityRecipeById(params.id);
    if(!recipe) throw error(404, 'Recipe not found');

    if(recipe.createdBy != locals.user.displayName){
        throw error(403, 'You can only edit recipe you have created');
    }

    return {recipe};
}