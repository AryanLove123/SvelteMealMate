import { clearSessionCookie } from "../../lib/server/services/session.ts";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({cookies}) =>{
    clearSessionCookie(cookies);
    throw redirect(303, '/api/login');
}

export const actions: Actions = {
    default: async({cookies}) =>{
        clearSessionCookie(cookies);
        throw redirect(303,'/login');
    }
}