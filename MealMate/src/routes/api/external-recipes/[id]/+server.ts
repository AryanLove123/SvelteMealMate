import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.d.ts';
import { getExternalRecipeById, ExternalApiError } from '../../../../lib/server/repositories/externalRecipesRepository.ts';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const recipe = await getExternalRecipeById(params.id);
    if (!recipe) throw error(404, 'External recipe not found.');
    return json({ recipe });
  } catch (err) {
    if (err instanceof ExternalApiError) throw error(err.status, err.message);
    throw err;
  }
};
