import type { PageServerLoad } from "./$types.js";
import { env } from "$env/dynamic/private";
import { loadRecipesData } from "../../lib/server/repositories/recipesRepository.ts";
import { listExternalAreas, listExternalCategories } from "../../lib/server/repositories/externalRecipesRepository.ts";
import { getFavoriteKeys } from "../../lib/server/repositories/favoritesRepository.ts";

export const load: PageServerLoad = async ({ url, locals }) => {
  const search = url.searchParams.get("search")?.trim() || "";
  const category = url.searchParams.get("category")?.trim() || "";
  const area = url.searchParams.get("area")?.trim() || "";
  const source =
    (url.searchParams.get("source") as
      | "all"
      | "external"
      | "community"
      | "mine"
      | null) ?? "all";
  const page = Number(url.searchParams.get("page") ?? "1");

  const [categories, areas] = await Promise.all([
    listExternalCategories(),
    listExternalAreas(),
  ]).catch(() => {
    return [[], []];
  });
  const recipesData = await loadRecipesData({
    search,
    category,
    area,
    source,
    page,
    limit: Number(env.DEFAULT_RECIPES_LIMIT),
    createdBy: locals.user?.id,
  });

  const favoriteKeys = locals.user ? await getFavoriteKeys(locals.user.id) : new Set<string>();

  return{
    recipes: recipesData.recipes,
    externalRecipes: recipesData.externalRecipes,
    communityRecipes: recipesData.communityRecipes,
    categories,
    areas,
    favoriteKeys: Array.from(favoriteKeys),
    filters: { ...recipesData.filters, page },
    page: recipesData.page,
    totalPages: recipesData.totalPages,
    totalItems: recipesData.totalItems,
    pageSize: recipesData.pageSize,
  };
};
