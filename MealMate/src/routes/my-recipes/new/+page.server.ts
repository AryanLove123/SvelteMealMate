import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { listExternalAreas, listExternalCategories } from "../../../lib/server/repositories/externalRecipesRepository.ts";

export const load: PageServerLoad = async({locals})=>{
    if(!locals.user) throw redirect(303, '/login');

    const [categories, areas] = await Promise.all([
        listExternalCategories(),
        listExternalAreas()
    ]).catch(() => [[],[]]);

    return {categories,areas};
}