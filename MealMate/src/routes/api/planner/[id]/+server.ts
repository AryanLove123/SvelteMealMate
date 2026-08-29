import { mealPlanInputSchema } from "../../../../lib/schemas/recipe.ts";
import { error, json} from "@sveltejs/kit";
import type { RequestHandler } from "./$types.js";
import { removeMealPlanEntry, updateMealPlanEntry } from "../../../../lib/server/repositories/mealPlanRepository.ts";

export const PUT: RequestHandler = async({params, request, locals}) =>{
    const userId = locals.user.id;

    const body = await request.json().catch(() => null);
    const parsed = mealPlanInputSchema.safeParse(body);

    if(!parsed.success){
        throw error(400, parsed.error.issues.map(i=> i.message).join(';'));
    }

    const res = await updateMealPlanEntry(userId, params.id, parsed.data);
    if(res == 'not-found') throw error(404, 'Planned Meal Not found');

    return json({success: true});
}

export const DELETE: RequestHandler = async( {params,  locals}) =>{
    const userId = locals.user.id;
    const res = await removeMealPlanEntry(userId, params.id);
    if(res == 'not-found') throw error(404, 'Planned Meal not found');
    return json({success: true});    
}