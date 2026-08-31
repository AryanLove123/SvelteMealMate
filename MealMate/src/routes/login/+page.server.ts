import { loginInputSchema } from "../../lib/schemas/recipe.ts";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types.js";
import { findOrCreateUser, setSessionCookie } from "../../lib/server/services/session.ts";

export const actions: Actions = {
    default: async({ request, cookies}) =>{
        const form = await request.formData();

        const username = form.get('username');

        const parsed = loginInputSchema.safeParse({username});

        if(!(parsed.success)){
            return fail(400, { error: parsed.error.issues[0]?.message ?? 'Invalid username.' });
        }

        const user = await findOrCreateUser(parsed.data.username);
        setSessionCookie(cookies, user.id);
        throw redirect(303, '/');
    }
}