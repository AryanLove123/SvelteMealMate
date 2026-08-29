import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types.js";
import { addMealPlanEntry, listMealPlan } from "../../../lib/server/repositories/mealPlanRepository.ts";
import { mealPlanInputSchema } from "../../../lib/schemas/recipe.ts";

export const GET: RequestHandler = async({ url, locals}) =>{
    const userId = locals.user.id;
    const weekStart = url.searchParams.get('weekStart');
    if(!weekStart) throw error(400, 'weekStart query parameter is required');

    const entries = await listMealPlan(userId, weekStart);
    return json({entries}); 
}

export const POST: RequestHandler = async({request, locals}) =>{
    const userId = locals.user.id;
    const body = await request.json().catch( () => null);
    const parsed = mealPlanInputSchema.safeParse(body);
    if(!parsed.success){
        throw error(400, parsed.error.issues.map(i => i.message).join(';'));
    }

    const entry = await addMealPlanEntry(userId, parsed.data);
    return json({entry}, {status: 201});
}