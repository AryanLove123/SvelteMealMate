import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types.js";
import { listCommunityRecipes } from "../../../../lib/server/repositories/recipesRepository.ts";

export const GET: RequestHandler = async ({ url }) => {
  const search = url.searchParams.get("search")?.trim() || "";
  const category = url.searchParams.get("category")?.trim() || "";
  const area = url.searchParams.get("area")?.trim() || "";
  const mine = url.searchParams.get("mine");

  const recipes = await listCommunityRecipes({
    category,
    area,
    search,
    createdBy: mine || undefined,
  });
  return json({ recipes });
};
