import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.d.ts';
import {
  searchExternalRecipes,
  filterExternalRecipes,
  ExternalApiError,
  getDefaultExternalRecipes,
} from '../../../lib/server/repositories/externalRecipesRepository.ts';

export const GET: RequestHandler = async ({ url }) => {
  const search = url.searchParams.get('search')?.trim();
  const category = url.searchParams.get('category')?.trim();
  const area = url.searchParams.get('area')?.trim();

  try {
    if (search) {
      const results = await searchExternalRecipes(search);
      return json({ recipes: results });
    }
    if (category || area) {
      const results = await filterExternalRecipes({ category: category || undefined, area: area || undefined });
      return json({ recipes: results });
    }
    // No filters supplied: default to a broad, category-based aggregate
    // so the app behaves like a discovery page instead of a keyword search.
    const results = await getDefaultExternalRecipes();
    return json({ recipes: results });
  } catch (err) {
    if (err instanceof ExternalApiError) {
      throw error(err.status, err.message);
    }
    throw error(500, 'Unexpected error while contacting the external recipe API.');
  }
};
