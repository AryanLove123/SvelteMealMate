import { error, json } from "@sveltejs/kit";
import { getCommunityRecipeById } from "../../../../lib/server/repositories/recipesRepository.ts";
import type { RequestHandler } from "./$types.js";

export const GET: RequestHandler = async({params}) =>{
    const recipe = await getCommunityRecipeById(params.id);
    if(!recipe) throw error(404, "Community recipe not found");
    return json({recipe});
}