import type { RecipeSource } from "../../../lib/models/recipe.model.ts";
import type { PageServerLoad } from ".././$types.js";

const load: PageServerLoad = async ({ params, url, locals }) => {
  const requestedSource = url.searchParams.get("source") as RecipeSource | null;

  const tryOrder: RecipeSource[] =
    requestedSource === "external"
      ? ["external"]
      : requestedSource === "community"
        ? ["community"]
        : ["community", "external"];
};
