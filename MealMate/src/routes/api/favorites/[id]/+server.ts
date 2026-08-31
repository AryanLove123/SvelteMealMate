import { error, json } from "@sveltejs/kit";
import { removeFavoriteById } from "../../../../lib/server/repositories/favoritesRepository.ts";
import type { RequestHandler } from "./$types.js";


//used inside favorite page
export const DELETE: RequestHandler = async ({ params, locals }) => {
  const userId = locals.user.id;

  const result = await removeFavoriteById(userId, params.id);
  if (result === 'not-found') throw error(404, 'Favorite not found.');
  return json({ success: true });
};