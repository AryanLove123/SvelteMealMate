import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { listFavorites } from "../../lib/server/repositories/favoritesRepository.ts";

export const load: PageServerLoad = async({locals}) =>{
    if(!locals.user) throw redirect(303, '/login');
    const favorites = await listFavorites(locals.user.id);
    return {favorites};
}